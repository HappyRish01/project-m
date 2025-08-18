'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Plus, LogOut, Settings, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useAuth } from './AuthProvider'
// Mock AuthProvider for demonstration. Replace with your actual AuthProvider.

interface SidebarProps {
  onLinkClick?: () => void; // Prop to close sheet on link click for mobile
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const isMobile = useIsMobile()

  const navItems = [
    {
      href: '/employee/bill',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    }
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="relative flex flex-col h-full bg-gray-50 border-r border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onLinkClick} className="-mr-2">
            <X className="h-6 w-6" />
            <span className="sr-only">Close navigation</span>
          </Button>
        )}
      </div>
      <Badge variant="secondary" className="text-xs mb-6 self-start">
        Management System
      </Badge>

      {/* Navigation Items */}
      <Card className="mb-6">
        <CardContent className="p-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href, item.exact)
              
              return (
                <Link key={item.href} href={item.href} onClick={onLinkClick}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-10 ${
                      active 
                        ? 'bg-gray-900 text-white hover:bg-gray-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* User Actions */}
      <Card>
        <CardContent className="p-2">
          <Button
            onClick={() => {
              logout()
              onLinkClick?.() // Close sheet after logout
            }}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <div className="text-xs text-gray-500 text-center">
          <p>Made with 💝 Ayush & Rish</p>
        </div>
      </div>
    </div>
  )
}
