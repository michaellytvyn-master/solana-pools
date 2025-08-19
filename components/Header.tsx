"use client"

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function Header() {
  const navigationLinks = [
    { label: "All Pools", href: "/" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur flex justify-center items-center px-6">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Solana Pools
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
