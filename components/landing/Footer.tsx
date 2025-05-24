import { Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-lg font-bold">DriveNow</div>
      <div className="flex gap-6">
        <Link href="#" className="hover:text-white">Home</Link>
        <Link href="#why-choose-us" className="hover:text-white">Why Choose Us</Link>
        <Link href="#popular-cars" className="hover:text-white">Popular Cars</Link>
        <Link href="#faq" className="hover:text-white">FAQ</Link>
      </div>
      <div className="flex gap-4">
        <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook /></a>
        <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter /></a>
        <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram /></a>
      </div>
      <div className="text-sm text-gray-400 mt-4 md:mt-0">&copy; {new Date().getFullYear()} DriveNow. All rights reserved.</div>
    </div>
  </footer>
)

export default Footer 