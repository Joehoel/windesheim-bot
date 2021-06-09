import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import connect from "../../middleware/mongo";
import User from "../../models/User";

const API_ENDPOINT = "https://discord.com/api/v8";

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const state = req.body;
  try {
    if (!req.query.code) {
      // @ts-ignore
      const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.CALLBACK_URL,
        response_type: "code",
        scope: ["identify", "guilds", "guilds.join"].join(" "),
        state: JSON.stringify(state),
      });
      const url = `${API_ENDPOINT}/oauth2/authorize?${params}`;
      console.log("REDIRECTING TO DISCORD");
      return res.redirect(url);
    }
    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      //@ts-ignore
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.CALLBACK_URL,
        state: JSON.stringify(state),
      }),
    });
    console.log("GETTING TOKEN");
    const data: AuthResponse = await response.json();

    const userResponse = await fetch(`${API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    const user: UserResponse = await userResponse.json();

    if (user) {
      const studentnummer = state.email.split("@")[0];
      const nickname = `${state.firstname} ${state.lastname} (${studentnummer})`;

      const newUser = await User.findOneAndUpdate(
        {
          discordId: user.id,
        },
        {
          discordId: user.id,
          username: `${user.username}#${user.discriminator}`,
          avatar: user.avatar,
          email: state.email,
          opleiding: state.opleiding,
          studentnummer,
          nickname,
          firstname: state.firstname,
          lastname: state.lastname,
          verified: false,
        },
        {
          upsert: true,
        }
      );
      console.log("CREATING USER");

      await fetch(`${API_ENDPOINT}/guilds/850653163379884033/members/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: data.access_token,
          roles: ["851392898317418527"],
          nick: nickname,
        }),
      }).then(res => res.json());

      console.log("ADDING USER");
      return res.json({ ...data, user: newUser });
    }
    return res.status(500).json({ message: "Error" });
  } catch (error) {
    console.error(error);
  }
};

export default connect(handler);
