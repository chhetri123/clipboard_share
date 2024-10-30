import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Configuration object for NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Ensure database connection
          await dbConnect();

          // Validate credentials existence
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide both email and password");
          }

          const { email, password } = credentials;

          // Find user and handle potential errors
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Verify password
          const isValid = await bcrypt.compare(password, user.pin);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // Return user object without sensitive data
          return {
            id: user._id,
            email: user.email,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.email = token.email;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Wrapper function for NextAuth handler
const authHandler = async (req, res) => {
  // Await NextAuth to ensure async operations complete
  return await NextAuth(req, res, authOptions);
};

// Export both methods for Next.js routing
export default authHandler;
