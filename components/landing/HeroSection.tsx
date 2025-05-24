import Image from "next/image"

const HeroSection = () => (
  <section className="relative w-full h-[520px] flex flex-col items-center justify-center overflow-hidden rounded-2xl mt-8">
    {/* Background image */}
    <Image
      src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1200&q=80"
      alt="Hero Cars"
      fill
      className="object-cover w-full h-full absolute inset-0 z-0"
      priority
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/30 z-10" />
    {/* Headline and CTA */}
    <div className="relative z-20 flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg text-center">Premium car rental</h1>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors mb-10">Booking Now</button>
    </div>
    {/* Booking Bar */}
    <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 w-[90%] max-w-4xl z-30">
      <form className="flex bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
        <div className="flex-1 px-6 py-4 flex flex-col justify-center border-r border-gray-200">
          <label className="text-xs text-gray-500 mb-1">Pick Up Address</label>
          <input className="bg-transparent text-gray-900 font-medium outline-none" placeholder="From: address, airport, hotel..." />
        </div>
        <div className="flex-1 px-6 py-4 flex flex-col justify-center border-r border-gray-200">
          <label className="text-xs text-gray-500 mb-1">Pick Up Date</label>
          <input className="bg-transparent text-gray-900 font-medium outline-none" placeholder="24 Jan, 2024" />
        </div>
        <div className="flex-1 px-6 py-4 flex flex-col justify-center border-r border-gray-200">
          <label className="text-xs text-gray-500 mb-1">Drop Off Address</label>
          <input className="bg-transparent text-gray-900 font-medium outline-none" placeholder="Distance, Hourly, Flat Rate" />
        </div>
        <div className="flex-1 px-6 py-4 flex flex-col justify-center">
          <label className="text-xs text-gray-500 mb-1">Drop Off Date</label>
          <input className="bg-transparent text-gray-900 font-medium outline-none" placeholder="24 Jan, 2024" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-8 py-4 font-semibold text-lg flex items-center gap-2 rounded-none rounded-r-2xl hover:bg-blue-700 transition-colors">
          <span>Book Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
          </svg>
        </button>
      </form>
    </div>
  </section>
)

export default HeroSection 