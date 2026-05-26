// components/ui/trusted-by.tsx
"use client";

import React from "react";
import { motion } from "motion/react";

interface Logo {
  src: string;
  alt: string;
  name: string; // الاسم الذي يظهر تحت الشعار
}

interface TrustedByProps {
  logos: Logo[];
  title?: string;
}

export function TrustedBy({ logos, title }: TrustedByProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full py-8"
      dir="rtl"
    >
      {/* Title */}
      {title && (
        <p className="text-gray-500 text-sm text-center mb-6">{title}</p>
      )}

      {/* Logos Row */}
      <div className="flex flex-wrap items-start justify-center gap-x-6 md:gap-x-8 gap-y-5">
        {logos.map((logo, index) => (
          <React.Fragment key={index}>
            {/* Logo + Name */}
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-7 md:h-8 w-auto object-contain filter grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-gray-600 text-[11px] leading-tight text-center group-hover:text-gray-400 transition-colors duration-300">
                {logo.name}
              </span>
            </div>

            {/* Separator - لا يظهر بعد العنصر الأخير */}
            {index < logos.length - 1 && (
              <div className="hidden sm:block w-px h-8 bg-gray-700/50 self-center" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

export default TrustedBy;
