"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { name: "الرئيسية", href: "#home" },
  { name: "الخدمات", href: "#services" },
  { name: "الأعمال", href: "#portfolio" },
  { name: "المميزات", href: "#features" },
  { name: "الفريق", href: "#team" },
  { name: "الأسئلة", href: "#qa" },
  { name: "التواصل", href: "#contact" },
];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
    },
  }),
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0); // ✅ استخدم useRef لتجنب إعادة التصيير

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      setMobileMenuOpen(false);
      window.history.pushState(null, "", href);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // ✅ تحسين المنطق لتجنب الوميض
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // نزول للأسفل - اخفاء
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        // صعود للأعلى - اظهار
        setHidden(false);
      }
      
      // ✅ إظهار الناف بار عند العودة لأعلى الصفحة
      if (currentScrollY < 10) {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-8 lg:px-12 py-5 bg-transparent"
    >
      {/* ... باقي الكود كما هو ... */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "#home");
            setMobileMenuOpen(false);
          }}
        >
          <img
            src="/img/onrequs.png"
            alt="OnRequest Logo"
            className="h-10 w-auto object-contain"
          />
        </motion.div>

{/* Desktop Navigation Links */}
<div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-600/10 border border-purple-500/20 backdrop-blur-md hover:border-purple-400/40 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.3)] transition-all duration-500">
  {navLinks.map((link, idx) => (
    <motion.a
      key={link.name}
      href={link.href}
      onClick={(e) => scrollToSection(e, link.href)}
      custom={idx}
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="relative px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 cursor-pointer rounded-full hover:bg-purple-500/20 group"
      whileHover={{ y: -2 }}
    >
      {link.name}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-purple-400 group-hover:w-1/2 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
    </motion.a>
  ))}
</div>

        {/* Connect Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => scrollToSection(e, "#contact")}
          className="hover:cursor-pointer hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white text-sm font-medium hover:bg-purple-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          تواصل معنا
          <ArrowRight className="h-4 w-4" />
        </motion.button>

        {/* Mobile menu button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white relative z-[100]"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-20 left-0 right-0 mx-4 bg-black/90 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 md:hidden shadow-2xl"
          style={{ zIndex: 9999 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block py-3 text-gray-300 hover:text-white text-center transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={(e) => scrollToSection(e, "#contact")}
            className="w-full mt-2 py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white text-sm font-medium hover:bg-purple-600/30 transition-all"
          >
            تواصل معنا
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;