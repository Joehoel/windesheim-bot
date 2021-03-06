import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  pages: {
    signIn: "/",
    error: "/error",
    newUser: "/",
  },
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  database: {
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
  },
});
