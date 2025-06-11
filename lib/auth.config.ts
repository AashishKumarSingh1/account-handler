import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Profile {
    picture?: string | null;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID!,
      clientSecret: process.env.NEXT_GOOGLE_SECRET!,
    }),
  ],
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        return false;
      }

      const allowedEmails = ["munnimanoj1973@gmail.com","manojsinghacss@gmail.com"]; 
      if (allowedEmails.includes(profile.email)) {
        return true;
      }
      return false;
    },

    async jwt({ token, trigger, profile }) {
      if (trigger === "signIn" && profile) {
        return {
          ...token,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          // role: "SUPER_ADMIN",
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
          name: token.name,
          image: token.picture,
          // role: token.role,
        }
      };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/api/auth/error",
    signOut: "/auth/signout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
};