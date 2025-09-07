import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      educationLevel: string
      location: {
        state: string
        district: string
        pincode?: string
      }
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    educationLevel: string
    location: {
      state: string
      district: string
      pincode?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    educationLevel: string
    location: {
      state: string
      district: string
      pincode?: string
    }
  }
}
