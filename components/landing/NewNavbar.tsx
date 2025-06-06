"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NewNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.className = 'light';
    return () => {};
  }, [pathname]);

  // Force light mode for Navbar elements specifically for landing page
  const isLandingPage = pathname === '/';
  const headerClasses = cn(
    "fixed left-0 right-0 top-0 z-50 backdrop-blur-md bg-white/80"
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image 
            src="/SVG/Asset 1.svg" 
            alt="Saifauto Logo" 
            width={30}
            height={30}
            className="h-auto"
          />
          <span className="font-bold text-xl hidden md:inline">Saifauto</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/fleet" className="text-sm font-medium hover:text-primary transition-colors">
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
          <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Log In
          </Link> */}
          {/* Assuming /signup is the route for signing up */}
          <Link href="/login">
            <Button size="sm">Staff login</Button>
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
          "fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white p-6 transition-transform duration-300 ease-in-out",
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
          <Link href="#contact" className="text-lg font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </Link>
          <div className="mt-6 flex flex-col gap-4">
            {/* <Link
              href="/login"
              className="w-full rounded-md border border-input px-4 py-2 text-center text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In
            </Link> */}
            {/* Assuming /signup is the route for signing up */}
            <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Staff login</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 