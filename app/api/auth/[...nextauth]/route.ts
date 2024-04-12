import NextAuth from 'next-auth'
import SteamProvider from 'next-auth-steam'

import type { NextRequest } from 'next/server'

async function handler(
  req: NextRequest,
  ctx: { params: { nextauth: string[] } }
) {
  return NextAuth(req, ctx, {
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET!,
        callbackUrl: 'http://localhost:3000/api/auth/callback'
      })
    ],
    callbacks: {
      jwt({ token, account, profile }) {
        // if (account?.provider === PROVIDER_ID) {
        //   token.steam = profile
        // }
        // TODO: validar
        if (account?.provider === 'steam') {
          token.steam = profile
        }
  
        return token
      },
      session({ session, token }) {
        if ('steam' in token) {
          // @ts-expect-error
          session.user.steam = token.steam
        }
  
        return session
      }
    }
  })
}

export {
  handler as GET,
  handler as POST
}