import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "faq1",
    question: "What documents do I need to rent a car?",
    answer:
      "To rent a car, you'll need a valid driver's license, a credit card in your name, and a form of identification (such as a passport for international rentals). Some locations may require additional documentation.",
  },
  {
    id: "faq2",
    question: "Is there a minimum age requirement to rent a car?",
    answer:
      "Yes, the standard minimum age is 21, but it may vary by location and car category. Drivers under 25 may be subject to a young driver surcharge.",
  },
  {
    id: "faq3",
    question: "Can I pick up the car at one location and return it to another?",
    answer:
      "Yes, we offer one-way rentals at many of our locations. Additional fees may apply for one-way rentals, especially for long distances.",
  },
  {
    id: "faq4",
    question: "What is your fuel policy?",
    answer:
      "Our standard policy is 'full-to-full'. This means you'll receive the car with a full tank and are expected to return it with a full tank. If you return the car with less fuel, you'll be charged for the missing fuel plus a refueling service fee.",
  },
  {
    id: "faq5",
    question: "Do you offer unlimited mileage?",
    answer:
      "Yes, most of our rentals come with unlimited mileage. However, some specialty vehicles or promotional rates may have mileage restrictions. The mileage policy will be clearly stated during the booking process.",
  },
  {
    id: "faq6",
    question: "What happens if I return the car late?",
    answer:
      "If you return the car later than the agreed time, you may be charged for an additional day. We typically provide a grace period of 29 minutes, but this can vary by location.",
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