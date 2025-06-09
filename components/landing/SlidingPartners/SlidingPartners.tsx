"use client";

import React from "react";
import Image from "next/image";

const partners = [
  { name: "Airports", src: require("./Assets/Airports.svg") },
  { name: "CMI", src: require("./Assets/CMI.svg") },
  { name: "Banque Populaire", src: require("./Assets/banqePopulaire.svg") },
  { name: "We Love Casablanca", src: require("./Assets/welovecasablana.svg") },
  { name: "Attijari", src: require("./Assets/Attijari.svg") },
];

const SlidingPartners = () => (
  <section className="w-full py-10 bg-white">
    <div className="overflow-hidden w-full">
      <div className="relative flex items-center w-full">
        <div className="sliding-row flex gap-12 w-max">
          {[...partners, ...partners].map((partner, idx) => {
            const scaleClass =
              partner.name === "Airports" || partner.name === "We Love Casablanca"
                ? "scale-150"
                : "";
            return (
              <div key={idx} className={`flex items-center justify-center px-6 py-4 flex-shrink-0`}>
                <div className={`w-[120px] h-[60px] flex items-center justify-center overflow-hidden relative flex-shrink-0 ${scaleClass}`}>
                  <Image
                    src={partner.src.default}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes slide-infinite {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .sliding-row {
        animation: slide-infinite 18s linear infinite;
      }
    `}</style>
  </section>
);

export default SlidingPartners;
