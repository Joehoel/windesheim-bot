import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../middleware/mongo";
import User, { IUser } from "../../models/User";

const API_ENDPOINT = "https://discord.com/api/v8";

export interface IAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface IUserResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
}

export interface IUserData {
  firstname: string;
  lastname: string;
  email: string;
  opleiding: string;
  id: string;
  docent: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res);

  const { code, state } = req.query;
  if (!code) return res.status(400).json({ message: "No code given!" });
  const data = await exchangeCode(code);
  cookies.set("access_token", data.access_token, {
    httpOnly: true,
    maxAge: data.expires_in,
  });

  const discordUser = await getDiscordUser(data.access_token);

  if (discordUser.id) {
    const user = await insertUser({
      id: discordUser.id,
      ...JSON.parse(state as string),
    });

    await updateDiscord(user, data.access_token);
    return res.redirect("/success");
  }

  return res.status(500).json({ message: "Error" });
};

const insertUser = async ({ email, firstname, lastname, opleiding, id }): Promise<IUser> => {
  const studentnummer = email.split("@")[0];
  const nickname = `${firstname} ${lastname} (${studentnummer})`;
  const docent = email.split("@")[0].match(/^s\d+$/gi) ? false : true;

  const user: IUser = await User.findOneAndUpdate(
    {
      id,
    },
    {
      id,
      email,
      opleiding,
      studentnummer,
      nickname,
      firstname,
      lastname,
      docent,
    },
    {
      new: true,
      upsert: true,
    }
  );
  return user;
};

const exchangeCode = async (code: string | string[]) => {
  const body: BodyInit = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.CALLBACK_URL,
    grant_type: "authorization_code",
    code: code as string,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(`${API_ENDPOINT}/oauth2/token`, {
    method: "POST",
    body,
    headers,
  });

  const json: IAuthResponse = await res.json();
  return json;
};

const exchangeRefreshToken = async (refreshToken: string) => {
  const body: BodyInit = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    refresh_token: refreshToken,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(`${API_ENDPOINT}/oauth2/token`, {
    method: "POST",
    body,
    headers,
  });

  const data: IAuthResponse = await res.json();
  return data;
};

const getDiscordUser = async (accessToken: string) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await fetch(`${API_ENDPOINT}/users/@me`, {
    headers,
  });

  const data: IUserResponse = await res.json();
  return data;
};

const updateDiscord = async (user: IUser, accessToken: string) => {
  const body = JSON.stringify({
    access_token: accessToken,
    roles: [user.opleiding, user.docent ? "851392975925280788" : "851392898317418527"],
    nick: user.nickname,
  });
  const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_ENDPOINT}/guilds/850653163379884033/members/${user.id}`, {
    method: "PATCH",
    headers,
    body,
  });

  const data = await res.json();
  return data;
};

//#region
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const state = req.body;
//   try {
//     if (!req.query.code) {
//       // @ts-ignore
//       const params = new URLSearchParams({
//         client_id: process.env.CLIENT_ID,
//         redirect_uri: process.env.CALLBACK_URL,
//         response_type: "code",
//         scope: ["identify", "guilds", "guilds.join"].join(" "),
//         state: JSON.stringify(state),
//       });
//       const url = `${API_ENDPOINT}/oauth2/authorize?${params}`;
//       console.log("REDIRECTING TO DISCORD");
//       return res.redirect(url);
//     }
//     const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       //@ts-ignore
//       body: new URLSearchParams({
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         grant_type: "authorization_code",
//         code: req.query.code,
//         redirect_uri: process.env.CALLBACK_URL,
//         state: JSON.stringify(state),
//       }),
//     });
//     console.log("GETTING TOKEN");
//     const data: AuthResponse = await response.json();

//     const userResponse = await fetch(`${API_ENDPOINT}/users/@me`, {
//       headers: {
//         Authorization: `Bearer ${data.access_token}`,
//       },
//     });
//     const user: UserResponse = await userResponse.json();

//     if (user) {
//       const studentnummer = state.email.split("@")[0];
//       const nickname = `${state.firstname} ${state.lastname} (${studentnummer})`;

//       const newUser = await User.findOneAndUpdate(
//         {
//           discordId: user.id,
//         },
//         {
//           discordId: user.id,
//           username: `${user.username}#${user.discriminator}`,
//           avatar: user.avatar,
//           email: state.email,
//           opleiding: state.opleiding,
//           studentnummer,
//           nickname,
//           firstname: state.firstname,
//           lastname: state.lastname,
//           verified: false,
//         },
//         {
//           upsert: true,
//         }
//       );
//       console.log("CREATING USER");

//       await fetch(`${API_ENDPOINT}/guilds/850653163379884033/members/${user.id}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bot ${process.env.BOT_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           access_token: data.access_token,
//           roles: ["851392898317418527"],
//           nick: nickname,
//         }),
//       }).then(res => res.json());

//       console.log("ADDING USER");
//       return res.json({ ...data, user: newUser });
//     }
//     return res.status(500).json({ message: "Error" });
//   } catch (error) {
//     console.error(error);
//   }
// };
//#endregion

export default connect(handler);
