'use client';
import { motion } from 'framer-motion';

const FleetHero = () => {
  return (
    <section
      className="relative flex items-center justify-center h-56 md:h-72 w-full bg-black overflow-hidden"
      aria-label="Fleet Hero Section"
    >
      {/* Car background image */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover"
        style={{ backgroundImage: "url('/heroimage.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-white text-4xl md:text-6xl font-extrabold tracking-widest uppercase text-center drop-shadow-2xl"
        tabIndex={0}
        aria-label="Our Entire Fleet"
      >
        OUR ENTIRE FLEET
      </motion.h1>
    </section>
  );
};

export default FleetHero; 