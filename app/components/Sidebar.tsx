'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, BarChart2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Trades', href: '/trades', icon: DollarSign },
  { name: 'Portfolio', href: '/portfolio', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background border-r p-4 hidden md:block">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant={pathname === item.href ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              pathname === item.href && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
