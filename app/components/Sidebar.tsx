'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, BarChart2, Settings } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Trades', href: '/trades', icon: DollarSign },
  { name: 'Portfolio', href: '/portfolio', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#fbfbfa] border-r border-[#e9e9e8] p-4 hidden md:block 
      dark:bg-gray-800 dark:border-gray-700">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-[#e9e9e8] text-[#37352f] dark:bg-gray-700 dark:text-white'
                  : 'text-[#787774] hover:bg-[#e9e9e8] hover:text-[#37352f] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 dark:text-gray-300" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
