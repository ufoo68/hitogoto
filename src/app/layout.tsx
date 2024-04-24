import '~/styles/globals.css'

import { Inter } from 'next/font/google'

import { UIProvider } from '@yamada-ui/react'
import { TRPCReactProvider } from '~/trpc/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'hitogoto',
  description: 'memo app for your life',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`font-sans ${inter.variable}`}>
        <UIProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </UIProvider>
      </body>
    </html>
  )
}
