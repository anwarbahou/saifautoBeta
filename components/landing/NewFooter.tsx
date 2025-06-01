"use client";

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Car } from "lucide-react"

export default function NewFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Image 
                src="/SVG/Asset 1.svg" 
                alt="Saifauto Logo" 
                width={30} 
                height={30} 
                className="h-auto footer-logo"
              />
              <span className="text-lg font-semibold ml-2">Saifauto</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed">
              DriveEasy is a premium car rental service dedicated to providing exceptional vehicles and customer service
              for all your travel needs.
            </p>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook page" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter profile" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram profile" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="LinkedIn profile" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/fleet" className="hover:text-primary transition-colors">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="/#locations" className="hover:text-primary transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-5">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>123 Rental Street, Car City, CC 12345, United States</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+212660513878" className="hover:text-primary transition-colors">+212 660-513878</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contact@saifauto.ma" className="hover:text-primary transition-colors">contact@saifauto.ma</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white mb-5">Business Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="text-gray-400">7:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-gray-400">8:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gray-400">9:00 AM - 8:00 PM</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Holiday hours may vary. Please check with your local branch.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Saifauto Car Rentals. All rights reserved. Designed with passion.</p>
        </div>
      </div>
      <style jsx global>{`
        .footer-logo {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </footer>
  )
} 