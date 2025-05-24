"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsMenuOpen((prev) => !prev)
    }
  }

  const handleOverlayClick = () => setIsMenuOpen(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Drive</span>Easy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#fleet" className="text-sm font-medium hover:text-primary transition-colors">
            Our Fleet
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#locations" className="text-sm font-medium hover:text-primary transition-colors">
            Locations
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Log In
          </Link>
          <Button size="sm">Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          tabIndex={0}
          onKeyDown={handleMenuKeyDown}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={handleOverlayClick}
        />
      )}

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white p-6 transition-transform duration-300 ease-in-out dark:bg-gray-950 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="menu"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-6">
          <Link href="#fleet" className="text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
            Our Fleet
          </Link>
          <Link
            href="#how-it-works"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#locations"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Locations
          </Link>
          <Link
            href="#testimonials"
            className="text-lg font-medium hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link href="#faq" className="text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
            FAQ
          </Link>
          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full rounded-md border border-input px-4 py-2 text-center text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In
            </Link>
            <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
