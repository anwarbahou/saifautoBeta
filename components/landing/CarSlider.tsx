import Image from "next/image"

const cars = [
  {
    name: "Lamborghini Urus",
    price: "250 MAD/day",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    mileage: "12,485 miles",
    fuel: "Petrol",
    transmission: "Automatic",
    active: true,
  },
  {
    name: "Mercedes G-Class",
    price: "220 MAD/day",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80",
    mileage: "42,670 miles",
    fuel: "Petrol",
    transmission: "Automatic",
    active: false,
  },
]

const CarSlider = () => (
  <section className="w-full flex justify-center py-8 bg-transparent">
    <div className="flex gap-6 w-full max-w-2xl">
      {cars.map((car, i) => (
        <div
          key={i}
          className={`flex-1 rounded-2xl p-6 flex flex-col items-center shadow-lg border transition-all duration-200 ${car.active ? 'bg-white border-blue-600' : 'bg-gray-100 border-gray-200 opacity-60'}`}
        >
          <div className="w-40 h-24 relative mb-4">
            <Image src={car.image} alt={car.name} fill className="object-contain" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg text-gray-900">{car.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 mb-4">
            <span>{car.mileage}</span>
            <span>{car.fuel}</span>
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-blue-700 font-bold text-xl">{car.price}</span>
            <button
              className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${car.active ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              disabled={!car.active}
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default CarSlider 