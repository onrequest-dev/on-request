"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { MapPin, Phone, Mail, Sparkles, ExternalLink } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp, FaYoutube, FaInstagram } from "react-icons/fa";

// ==================== TextHoverEffect محسن ====================
export const TextHoverEffect = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none cursor-default", className)}
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="0%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="30%" stopColor="#7c3aed" />
              <stop offset="60%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="18%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Base outline */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-gray-800 font-bold"
        style={{ fontSize: 'clamp(40px, 10vw, 90px)' }}
      >
        {text}
      </text>

      {/* Animated stroke */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-purple-500/30 font-bold"
        style={{ fontSize: 'clamp(40px, 10vw, 90px)' }}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
      >
        {text}
      </motion.text>

      {/* Gradient text on hover */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.5"
        mask="url(#textMask)"
        className="fill-transparent font-bold"
        style={{ fontSize: 'clamp(40px, 10vw, 90px)' }}
      >
        {text}
      </text>
    </svg>
  );
};

// ==================== FooterBackgroundGradient ====================
export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(100% 100% at 50% 100%, rgba(124,58,237,0.08) 0%, transparent 60%)",
      }}
    />
  );
};

// ==================== الفوتر ====================
export function OnRequestFooter() {
  // روابط التواصل الاجتماعي
  const socialLinks = [
    { 
      icon: FaTelegramPlane, 
      href: "https://t.me/OnRequest_dev", 
      label: "تلغرام",
    },
    { 
      icon: FaWhatsapp, 
      href: "https://wa.me/79610195064", 
      label: "واتساب",
    },
    { 
      icon: FaYoutube, 
      href: "https://youtube.com/@OnRequest_dev", 
      label: "يوتيوب",
    },
    { 
      icon: FaInstagram, 
      href: "https://www.instagram.com/onrequest.dev", 
      label: "انستغرام",
    },
  ];

  // روابط سريعة
  const navLinks = [
    { name: "الرئيسية", href: "#home" },
    { name: "الخدمات", href: "#services" },
    { name: "الأعمال", href: "#portfolio" },
    { name: "المميزات", href: "#features" },
    { name: "الفريق", href: "#team" },
    { name: "الأسئلة", href: "#qa" },
    { name: "التواصل", href: "#contact" },
  ];

  // روابط الخدمات
  const servicesLinks = [
    { name: "تطبيقات الموبايل", href: "#" },
    { name: "مواقع الويب", href: "#" },
    { name: "أنظمة متكاملة", href: "#" },
    { name: "تصميم UI/UX", href: "#" },
  ];

  // معلومات التواصل
  const contactInfo = [
    { 
      icon: Mail, 
      text: "commerce.onrequest@gmail.com", 
      href: "mailto:commerce.onrequest@gmail.com",
    },
    { 
      icon: Phone, 
      text: "+7 961 019 5064", 
      href: "https://wa.me/79610195064",
    },
    { 
      icon: MapPin, 
      text: "سوريا، إدلب",
    },
  ];

  return (
    <footer className="relative w-full bg-[#060608] overflow-hidden border-t border-purple-500/10">
      {/* Background Gradient */}
      <FooterBackgroundGradient />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 md:py-20">
        
        {/* ==================== Grid الرئيسي ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand - 4 cols */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-purple-400">
                <Sparkles size={22} />
              </span>
              <span className="text-white text-2xl font-extrabold tracking-tight">
                OnRequest
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              حلول برمجية متكاملة تجمع بين التكنولوجيا المتطورة والتصميم الاحترافي.
            </p>
            
            {/* Social Links - بنفسجي موحد */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((link, i) => {
                const IconComponent = link.icon;
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-400/40 text-purple-400 hover:text-purple-300"
                  >
                    <IconComponent size={15} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* روابط سريعة - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* خدماتنا - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">
              خدماتنا
            </h4>
            <ul className="space-y-2.5">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا - 4 cols */}
          <div className="lg:col-span-4">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500 group">
                  <span className="flex-shrink-0 mt-0.5 text-purple-400">
                    <item.icon size={16} />
                  </span>
                  {item.href ? (
                    <a 
                      href={item.href} 
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-1"
                    >
                      {item.text}
                      {item.href.startsWith('http') && (
                        <ExternalLink size={12} className="opacity-50" />
                      )}
                    </a>
                  ) : (
                    <span className="text-sm">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/10 my-10" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} OnRequest. جميع الحقوق محفوظة. تطوير حلول برمجية احترافية.
          </p>
        </div>
      </div>

      {/* ==================== TextHoverEffect ==================== */}
      <div className="w-full h-40 sm:h-52 md:h-64 lg:h-72 relative -mt-4 overflow-hidden">
        <TextHoverEffect text="OnRequest" className="z-20" />
      </div>
    </footer>
  );
}

export default OnRequestFooter;