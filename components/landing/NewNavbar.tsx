"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NewNavbar() { // Renamed function for clarity
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Drive</span>Easy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/fleet" className="text-lg font-medium hover:text-primary">
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
          {/* Assuming /signup is the route for signing up */}
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white p-6 transition-transform duration-300 ease-in-out dark:bg-gray-950 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex flex-col gap-6">
          <Link href="/fleet" className="text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
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
            {/* Assuming /signup is the route for signing up */}
            <Link href="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 