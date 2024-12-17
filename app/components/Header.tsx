import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link href="/api-key" className="hover:text-gray-300">API Key</Link></li>
          <li><Link href="/trades" className="hover:text-gray-300">Trades</Link></li>
          <li><Link href="/favorites" className="hover:text-gray-300">Favorites</Link></li>
        </ul>
      </nav>
    </header>
  )
}

