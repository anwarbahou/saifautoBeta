import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "faq1",
    question: "Quels documents dois-je fournir pour louer une voiture ?",
    answer:
      "Pour louer une voiture, vous aurez besoin d'un permis de conduire valide, d'une carte de crédit à votre nom et d'une pièce d'identité (comme un passeport pour les locations internationales). Certains endroits peuvent exiger des documents supplémentaires.",
  },
  {
    id: "faq2",
    question: "Y a-t-il un âge minimum pour louer une voiture ?",
    answer:
      "Oui, l'âge minimum standard est de 21 ans, mais cela peut varier selon l'emplacement et la catégorie de voiture. Les conducteurs de moins de 25 ans peuvent être soumis à des frais supplémentaires.",
  },
  {
    id: "faq3",
    question: "Puis-je prendre la voiture à un endroit et la rendre à un autre ?",
    answer:
      "Oui, nous proposons des locations aller simple dans plusieurs de nos agences. Des frais supplémentaires peuvent s'appliquer pour les locations aller simple, en particulier pour les longues distances.",
  },
  {
    id: "faq4",
    question: "Quelle est votre politique de carburant ?",
    answer:
      "Notre politique standard est 'plein-plein'. Cela signifie que vous recevrez la voiture avec le plein et devrez la rendre avec le plein. Si vous rendez la voiture avec moins de carburant, vous serez facturé pour le carburant manquant plus des frais de service.",
  },
  {
    id: "faq5",
    question: "Proposez-vous un kilométrage illimité ?",
    answer:
      "Oui, la plupart de nos locations incluent un kilométrage illimité. Cependant, certains véhicules spéciaux ou tarifs promotionnels peuvent avoir des restrictions de kilométrage. La politique de kilométrage sera clairement indiquée lors de la réservation.",
  },
  {
    id: "faq6",
    question: "Que se passe-t-il si je rends la voiture en retard ?",
    answer:
      "Si vous rendez la voiture après l'heure convenue, vous pourrez être facturé pour une journée supplémentaire. Nous accordons généralement un délai de grâce de 29 minutes, mais cela peut varier selon l'emplacement.",
  },
]

export default function NewFAQSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about renting with DriveEasy. If you can't find what you're looking for,
            feel free to contact our customer support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-5 text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 