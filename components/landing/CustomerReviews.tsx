const reviews = [
  {
    name: "Sarah M.",
    text: "Le processus de réservation était simple et la voiture était impeccable. Je recommande vivement !",
  },
  {
    name: "James L.",
    text: "Excellents tarifs et service client exceptionnel. Je reviendrai !",
  },
  {
    name: "Priya S.",
    text: "Large sélection de voitures et très flexible avec les changements. 5 étoiles !",
  },
]

const CustomerReviews = () => (
  <section className="py-16 bg-white" id="reviews">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Avis Clients</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {reviews.map((review, i) => (
          <div key={i} className="bg-blue-50 rounded-xl shadow p-6 flex-1 max-w-md mx-auto">
            <p className="text-gray-700 text-lg mb-4 italic">{review.text}</p>
            <div className="text-blue-700 font-semibold">{review.name}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default CustomerReviews 