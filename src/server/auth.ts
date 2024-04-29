import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import DiscordProvider from 'next-auth/providers/discord'

import CredentialsProvider from 'next-auth/providers/credentials'
import { env } from '~/env'
import { db } from '~/server/db'
import { createTable } from '~/server/db/schema'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: (params) => {
      const { session, token, user } = params
      return {
        ...session,
        user: {
          ...session.user,
          id: user ? user.id : token.id,
        },
      }
    },
    jwt: (params) => {
      const { token, user } = params
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'quest',
      credentials: {},
      async authorize() {
        return {
          id: 'guest',
          email: 'guest@example.com',
          name: 'guest',
          image: '',
          provider: 'anonymous',
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
