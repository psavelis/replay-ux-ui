import NextAuth from 'next-auth'
import SteamProvider from 'next-auth-steam'
import crypto from 'crypto'

import type { NextRequest } from 'next/server'

const mockSalt = process.env.STEAM_VHASH_SOURCE!

// const accountsApiRoute = 'https://accounts-api.dev.dash.net.br/v1';
const steamOnboardingApiRoute = 'http://localhost:4991/onboarding/steam';

async function handler(
  req: NextRequest,
  ctx: { params: { nextauth: string[] } }
) {
  return NextAuth(req, ctx, {
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET!,
        callbackUrl: 'http://localhost:3000/api/auth/callback/'
      })
    ],
    callbacks: {
      async jwt(param) {
        if (param?.account?.provider === 'steam') {
          param.token.steam = param.profile

          const steamId = (param.profile as any).steamid!

          if (!steamId) { 
            const p = JSON.stringify(param)
            throw new Error(`No steam_id found in profile ${p}`)
          }

          const verificationHash = crypto
            .createHash('sha256')
            .update(`${steamId}${mockSalt}`)
            .digest('hex')


          const ctoken = await fetch(steamOnboardingApiRoute, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              v_hash: verificationHash,
              steam: {
                id: steamId,
              },
            }),
          });

          if (!ctoken.ok) {
            throw new Error(await ctoken.text())
          }

          const { uid, rid } = await ctoken.json()

          param.token.rid = rid
          param.token.uid = uid
        }

        return param.token
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