import NextAuth, { Account, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
/* eslint-disable @typescript-eslint/no-explicit-any */
console.log("--- NextAuth configuration file loaded ---");

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("1. [authorize] callback triggered");
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Invalid credentials');
        }

        const responseData = await res.json();
        console.log("1a. [authorize] Response from backend:", responseData);
        
        const user = responseData.data;


        if (user && user.accessToken) {
          console.log("1b. [authorize] Returning user object to NextAuth:", user);
          return user; 
        } else {
          console.log("1c. [authorize] No user or token from backend, returning null.");
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      console.log("2. [signIn] callback triggered", { provider: account?.provider });

      return true;
    },

    async jwt({ token, user }) {
      console.log("3. [jwt] callback triggered");
      console.log("3a. [jwt] `user` object received:", user);
      console.log("3b. [jwt] `token` object received:", token);

      if (user) {
        token.id = (user as any).id;
        token.accessToken = (user as any).accessToken;
        console.log("3c. [jwt] `user` exists. Token updated:", token);
      }
      
      console.log("3d. [jwt] Returning token:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("4. [session] callback triggered");
      console.log("4a. [session] `token` object received from jwt callback:", token);
      console.log("4b. [session] Initial `session` object:", session);

      if (token && token.accessToken) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
        console.log("4c. [session] Token exists. Session updated:", session);
      } else {
        console.log("4d. [session] No token found. Session not updated.");
      }
      
      console.log("4e. [session] Returning final session object to client:", session);
      return session;
    }
  },

  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };
