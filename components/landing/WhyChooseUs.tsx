import { CheckCircle, DollarSign, Headset, Clock } from "lucide-react"

const features = [
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />, 
    title: "Affordable Rates",
    desc: "Get the best prices with no hidden fees or surprises.",
  },
  {
    icon: <Headset className="h-8 w-8 text-primary" />, 
    title: "24/7 Support",
    desc: "Our team is always available to help you, day or night.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />, 
    title: "Wide Selection",
    desc: "Choose from economy, luxury, SUVs, and more.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />, 
    title: "Flexible Booking",
    desc: "Easy changes and cancellations for your convenience.",
  },
]

const WhyChooseUs = () => (
  <section className="py-16 bg-white" id="why-choose-us">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
            <p className="text-gray-700">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyChooseUs 