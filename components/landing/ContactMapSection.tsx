"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactMapSection() {
  // Updated Google Maps embed URL with the provided coordinates
  const mapEmbedUrl = "https://maps.google.com/maps?q=33.580000,-7.541250&z=15&output=embed";

  // Updated contact information
  const contactInfo = {
    address: "123 Main Street, Anytown, Morocco", // Address still a placeholder, user to update if needed
    phone: "+212 660-513878",
    email: "contact@saifauto.ma",
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Find Us & Get In Touch
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Visit our office or contact us for any inquiries. We're here to help you with your car rental needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Map Section */}
          <div className="rounded-lg overflow-hidden shadow-xl order-last md:order-first">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">Our Office</h4>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">Call Us</h4>
                    <p className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                      <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">Email Us</h4>
                    <p className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                      <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Optional: Add a simple contact form here if needed in the future */}
            {/* For now, focusing on displaying information */}
          </div>
        </div>
      </div>
    </section>
  );
} 