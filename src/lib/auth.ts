import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock user verification - replace with actual database lookup
        const mockUsers = [
          {
            id: "1",
            email: "admin@valtintellodoc.com",
            name: "Admin User",
            role: "admin",
            department: "IT",
            permissions: ["all"],
            password: await bcrypt.hash("admin123", 10)
          },
          {
            id: "2",
            email: "legal@valtintellodoc.com",
            name: "Legal User",
            role: "legal",
            department: "Legal",
            permissions: ["read", "search", "analyze"],
            password: await bcrypt.hash("legal123", 10)
          }
        ]

        const user = mockUsers.find(u => u.email === credentials.email)
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            permissions: user.permissions,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.department = user.department
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || ""
        session.user.role = token.role as string
        session.user.department = token.department as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}