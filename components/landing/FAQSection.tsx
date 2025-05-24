"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "What documents do I need to rent a car?",
    a: "You need a valid driver's license and a credit card in your name.",
  },
  {
    q: "Can I modify or cancel my booking?",
    a: "Yes, you can modify or cancel your booking up to 24 hours before pickup.",
  },
  {
    q: "Is insurance included?",
    a: "Basic insurance is included. Additional coverage is available at checkout.",
  },
  {
    q: "Are there any mileage limits?",
    a: "Most rentals include unlimited mileage. Check your booking for details.",
  },
]

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="py-16 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
              >
                {faq.q}
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div id={`faq-${i}`} className="px-6 pb-4 text-gray-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection 