import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                phone: { label: "Phone", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ phone: z.string().min(10), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { phone, password } = parsedCredentials.data
                    console.log("Authorize: Attempting login for", phone)
                    const user = await prisma.user.findUnique({ where: { phone } })
                    if (!user) {
                        console.log("Authorize: User not found")
                        return null
                    }
                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (passwordsMatch) {
                        console.log("Authorize: Password match")
                        return user
                    }
                    console.log("Authorize: Password mismatch")
                } else {
                    console.log("Authorize: Invalid credentials format")
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                (session.user as any).role = token.role as string
            }
            return session
        },
    },
})
