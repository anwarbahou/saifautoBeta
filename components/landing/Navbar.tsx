import Link from 'next/link'

const Navbar = () => (
  <nav className="w-full bg-white rounded-b-2xl shadow-md py-3 px-6 flex items-center justify-between max-w-6xl mx-auto mt-6">
    <div className="flex items-center gap-8">
      <Link href="/" className="text-gray-700 font-medium hover:text-blue-700 transition">Home</Link>
      <Link href="#about" className="text-gray-700 font-medium hover:text-blue-700 transition">About Us</Link>
      <Link href="#fleet" className="text-gray-700 font-medium hover:text-blue-700 transition">Our Fleet</Link>
      <Link href="#contact" className="text-gray-700 font-medium hover:text-blue-700 transition">Contacts</Link>
    </div>
    <div className="flex-1 flex justify-center">
      <span className="text-2xl font-extrabold tracking-widest text-gray-900">FNT</span>
    </div>
    <div className="flex items-center gap-4">
      <Link href="/login">
        <button className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
          Sign in
        </button>
      </Link>
    </div>
  </nav>
)

export default Navbar 