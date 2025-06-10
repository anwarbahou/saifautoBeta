import Image from "next/image"

const cars = [
  {
    name: "BMW Série 5",
    price: "120 MAD/jour",
    image: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Audi Q7",
    price: "140 MAD/jour",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mercedes Classe C",
    price: "110 MAD/jour",
    image: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Toyota Corolla",
    price: "60 MAD/jour",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Range Rover Evoque",
    price: "160 MAD/jour",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Honda Civic",
    price: "55 MAD/jour",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
  },
]

const PopularCars = () => (
  <section className="py-16 bg-gray-50" id="popular-cars">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Voitures Populaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cars.map((car, i) => (
          <div key={i} className="bg-gray-100 rounded-xl shadow p-4 flex flex-col items-center">
            <div className="w-full h-40 relative mb-4 rounded-lg overflow-hidden">
              <Image src={car.image} alt={car.name} fill className="object-cover" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
            <p className="text-primary font-bold text-xl mt-2">{car.price}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default PopularCars 