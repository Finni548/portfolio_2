import type {Metadata} from 'next'
import {Inter, Space_Grotesk} from 'next/font/google'
import '../styles.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Finnja Krämer — Portfolio',
  description:
    'Finnja Krämer — Editorial Portfolio mit interaktiven Projekten, 3D Arbeiten und Creative Systems.',
}

export const viewport = {
  themeColor: '#111111',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
