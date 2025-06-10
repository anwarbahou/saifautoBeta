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
              DriveEasy est un service de location de voitures premium dédié à fournir des véhicules et un service client exceptionnels
              pour tous vos besoins de voyage.
            </p>
            <div className="flex gap-4">
              <Link href="#" aria-label="Page Facebook" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Profil Twitter" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Profil Instagram" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Profil LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Liens Rapides</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <Link href="/fleet" className="hover:text-primary transition-colors">Notre Flotte</Link>
              <Link href="#how-it-works" className="hover:text-primary transition-colors">Comment ça Marche</Link>
              <Link href="#testimonials" className="hover:text-primary transition-colors">Témoignages</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Aide & Support</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
              <Link href="#contact" className="hover:text-primary transition-colors">Contactez-nous</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Conditions d'Utilisation</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Rue Mohammed V, Casablanca</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>+212 522 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@saifauto.ma</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-8 text-sm text-center text-gray-400">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Saifauto Car Rentals. All rights reserved. Designed with passion.</p>
        </div>
      </div>
      <style jsx global>{``}</style>
    </footer>
  )
} 