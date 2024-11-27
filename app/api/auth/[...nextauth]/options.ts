import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("Credentials received:", credentials);
        const user = await db.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        // console.log("User", user);

        if (user) {
          // console.log(credentials.password);
          const passwordValidation = await bcrypt.compare(
            credentials!.password,
            user.password as string
          );
          // console.log(passwordValidation);

          if (passwordValidation) {
            return {
              ...user,
              username: user.username ?? undefined,
              password: user.password ?? undefined,
              image: user.image ?? undefined,
            };
          }
        }
        return null;
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // console.log("Token", token);
      // console.log("user", user); //undefined
      // console.log("account", account); //undefined
      // console.log("profile", profile); //undefined

      if (account?.provider === "google") {
        const googleuser = await db.user.findUnique({
          where: {
            email: profile?.email,
          },
          select: {
            id: true,
          },
        });
        token.provider = "google";
        token.sub = googleuser?.id.toString();
        token.email = profile?.email;
        token.name = profile?.name;
        token.picture = user?.image as string;
        return token;
      } else if (user) {
        token.id = user.id as string;
        token.provider = user.provider as string;
        token.name = user.name;
        token.username = user.username as string;
        token.email = user.email as string;
        // console.log("Token", token);
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Token", token);
      // console.log("session", session);
      // console.log("User", user); //undefined

      if (token.provider === "google" && token.picture) {
        session.user = {
          id: token.sub as string,
          username: token.name as string,
          email: token.email as string,
          provider: token.provider,
          image: token.picture,
        };
        return session;
      } else {
        session.user = {
          id: token.sub as string,
          name: token.name,
          username: token.username as string,
          email: token.email as string,
          provider: token.provider as string,
        };
        return session;
      }
    },
    async signIn({ user, profile }) {
      console.log("Profile", profile);

      const existingUser = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });

      // console.log("User", user);
      // console.log("account", account);
      // console.log("profile", profile);

      if (existingUser) {
        return true;
      }
      try {
        await db.user.create({
          data: {
            name: profile?.name as string,
            username: profile?.name as string,
            email: profile?.email as string,
            image: profile?.picture as string,
            provider: "google",
          },
        });
        revalidatePath("/explore/people");
        redirect("/");
      } catch (err) {
        console.log("Couldn't authenticate the user", err);
        toast.error("Error Creating the user! Please try again");
      }
      return true;
    },
  },

  pages: {
    signIn: "/signin",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-snapRealm-app",
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      },
    },
  },
};
