// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// Extend the default User and Session types
declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
    image?: string;
    username?: string;
    email?: string;
    password?: string;
    provider?: string; // Adding provider field
    notification?: boolean;
  }

  interface Session {
    user?: {
      id?: string;
      image?: string;
      username?: string;
      email?: string;
      provider?: string;
    } & DefaultSession["user"];
  }
  interface Profile {
    picture?: string;
  }
}
