"use client"
import { useState } from 'react'

const carTypes = [
  'Economy',
  'SUV',
  'Luxury',
  'Convertible',
  'Van',
]

const BookingForm = () => {
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend logic, just a placeholder
    alert('Booking submitted!')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 w-full">
      <div>
        <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
        <input id="pickup" name="pickup" type="text" required value={form.pickup} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter city or airport" />
      </div>
      <div>
        <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
        <input id="dropoff" name="dropoff" type="text" required value={form.dropoff} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter city or airport" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
          <input id="pickupDate" name="pickupDate" type="date" required value={form.pickupDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex-1">
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <input id="returnDate" name="returnDate" type="date" required value={form.returnDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div>
        <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
        <select id="carType" name="carType" required value={form.carType} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="" disabled>Select car type</option>
          {carTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <button type="submit" className="mt-2 bg-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
        Book Now
      </button>
    </form>
  )
}

export default BookingForm 