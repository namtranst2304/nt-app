import './globals.css'
import { Inter } from 'next/font/google'
import { AppProviders } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NTSync',
  description: 'A modern app with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
