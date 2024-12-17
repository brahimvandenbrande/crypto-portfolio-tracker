import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'
import ThemeProvider from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crypto Portfolio Tracker',
  description: 'A simple crypto portfolio tracker with a Notion-inspired interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-grow p-4">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
