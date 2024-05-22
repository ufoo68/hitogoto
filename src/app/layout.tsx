import { unstable_noStore as noStore } from 'next/cache'
import '~/styles/globals.css'

import { Inter } from 'next/font/google'

import { UIProvider } from '@yamada-ui/react'
import { redirect } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'
import { TRPCReactProvider } from '~/trpc/react'
import { MainHeader } from './_component/main-header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'hitogoto',
  description: 'memo app for your life',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }
  return (
    <html lang="ja">
      <body className={`font-sans ${inter.variable}`}>
        <MainHeader />
        <UIProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </UIProvider>
      </body>
    </html>
  )
}
