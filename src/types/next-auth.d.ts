import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      department: string
      permissions: string[]
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    department: string
    permissions: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    department: string
    permissions: string[]
  }
}