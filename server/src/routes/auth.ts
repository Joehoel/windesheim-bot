import { Router } from "express";
import { URLSearchParams } from "url";
import fetch from "node-fetch";
import User from "../schemas/User";

const router = Router();

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

router.get("/", async (req, res) => {
  try {
    if (!req.query.code) {
      // @ts-ignore
      const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.CALLBACK_URL,
        response_type: "code",
        scope: ["identify", "guilds", "guilds.join"].join(" "),
        state: req.query.state,
      });
      const url = `${API_ENDPOINT}/oauth2/authorize?${params}`;
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
        state: req.query.state,
      }),
    });
    const data: AuthResponse = await response.json();
    res.cookie("key", data.access_token, { maxAge: 2592000000 });

    const userResponse = await fetch(`${API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    const user: UserResponse = await userResponse.json();
    const state = JSON.parse(req.query.state?.toString()!);

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
        },
        {
          upsert: true,
        }
      );

      await fetch(`${API_ENDPOINT}/guilds/850653163379884033/members/${user.id}`, {
        method: "PUT",
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

      return res.json({ ...data, user: newUser });
    }
    return res.status(500).json({ message: "Error" });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      state: JSON.stringify(req.body),
    });

    res.redirect(`/api/auth?${params}`);
  } catch (error) {}
});

router.get("/user", async (req, res) => {
  try {
    const user: UserResponse = await fetch(`${API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${req.cookies.get("key")}`,
      },
    }).then(res => res.json());

    // const roles = await fetch(`${API_ENDPOINT}/guilds/850653163379884033/members/${user.id}`, {
    //   method: "PUT",
    //   headers: {
    //     Authorization: `Bot ${process.env.BOT_TOKEN}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     access_token: req.cookies.get("key"),
    //     roles: ["851392898317418527"],
    //     nick: "",
    //   }),
    // }).then(res => res.json());

    return res.json({ user, state: req.body.state });
  } catch (error) {
    console.error(error);
    return res.json(error);
  }
});

router.get("/guilds", async (req, res) => {
  try {
    const guilds = await fetch(`${API_ENDPOINT}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${req.cookies.get("key")}`,
      },
    }).then(res => res.json());
    return res.json(guilds);
  } catch (error) {
    console.error(error);
  }
});

export default router;
