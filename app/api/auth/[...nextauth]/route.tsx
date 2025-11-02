import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import pool from "@/lib/postgresDb";

export const authOptions = {
  providers: [
    // 🟢 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔵 Facebook Login
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // ⚪ Apple Login
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),

    // 🟣 Email + Password Login (Your old /api/login logic)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials ?? {};

          if (!email || !password) {
            throw new Error("All fields are required");
          }

          // Check user in your database
          const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
          const user = result.rows[0];

          if (!user) throw new Error("User not found");

          const match = await bcrypt.compare(password, user.password);
          if (!match) throw new Error("Invalid password");

          if (!user.verified) {
            // You can choose to prevent login if not verified
            // throw new Error("Please verify your email first");
            console.warn("User not verified, proceeding with limited access");
          }

          // ✅ Return user object (this becomes session.user)
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split("@")[0],
          };
        } catch (err: any) {
          console.error("Authorize error:", err);
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],

  // ⚙️ Use JWT sessions instead of database sessions
  session: {
    strategy: "jwt",
  },

  // 🔐 Encryption secret
  secret: process.env.NEXTAUTH_SECRET,

  // 🧠 Customize token and session content
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token info in session
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },

  // Optional: redirect after sign in/out
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
