import NextAuth, {User} from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Discord from "@auth/core/providers/discord";
import LinkedIn from "@auth/core/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

export const {auth, handlers, signIn, signOut} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub,
    Facebook,
    Discord,
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "r_dma_portability_self_serve",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      authorize: async function (credentials): Promise<User | null> {
        if (!credentials) return null;

        const {email, password} = credentials;

        if (typeof email !== "string" || typeof password !== "string")
          throw new Error("Invalid credentials format");

        if (!email || !password) throw new Error("Invalid credentials");

        const user = await prisma.user.findUnique({where: {email: email}});

        if (!user)
          throw new Error("User not found");
        if (!user.passwordHash)
          throw new Error("Wrong authentication method, try with social login");

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw new Error("Incorrect email or password, check your credentials");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});