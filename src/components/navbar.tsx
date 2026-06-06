"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

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

  // منع تمرير الخلفية عند فتح القائمة الجانبية على الموبايل
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false);
      }
      
      if (currentScrollY < 10) {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
  {/* شريط التنقل العلوي للموبايل فقط */}
  <motion.nav
    initial={{ y: 0 }}
    animate={{ y: hidden ? -120 : 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-8 py-4 bg-transparent md:hidden"
  >
    <div className="flex items-center justify-between">
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
          src="/img/onrequs.webp"
          alt="OnRequest Logo"
          className="h-10 w-auto object-contain"
        />
      </motion.div>

      {/* Mobile menu button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 text-white relative z-[100]"
      >
        <Menu className="h-6 w-6" />
      </motion.button>
    </div>
  </motion.nav>

  {/* القائمة الجانبية للديسكتوب - تبدأ من الزاوية العليا اليمنى */}
  <motion.aside
    initial={{ x: 100 }}
    animate={{ x: hidden ? 150 : 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="fixed right-0 top-0 z-50 hidden md:block"
  >
    {/* حاوية القائمة - بدون padding أو margins لتبدأ من الحافة مباشرة */}
    <div className="flex flex-col items-end">
      
      {/* اللوجو في الأعلى - ملتصق بالحافة اليمنى */}
      <div 
        className="cursor-pointer group w-fit"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "#home");
        }}
      >
        <img
          src="/img/onrequs.webp"
          alt="OnRequest Logo"
          className="h-18 w-auto object-contain pl-6 pr-4 py-2"
        />
      </div>

      {/* التبويبات المائلة والملتصقة بالحافة */}
      <div className="flex flex-col items-end gap-3 mt-6">
        {navLinks.map((link, idx) => (
          <motion.a
            key={link.name}
            href={link.href}
            onClick={(e) => scrollToSection(e, link.href)}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.3 }}
            className="group relative block cursor-pointer"
            whileHover={{ x: -8, y: -2 }}
            style={{ 
              zIndex: navLinks.length - idx,
              marginTop: idx === 0 ? 0 : "-10px"
            }}
          >
            {/* طبقة شفافة لتوسيع منطقة التفاعل */}
            <div 
              className="absolute inset-0 -left-8 -top-2 -bottom-2 rounded-l-lg"
              style={{ 
                zIndex: 5,
                transform: "rotate(-30deg)",
                transformOrigin: "top right"
              }}
            />
            
            <div 
              className="relative px-12 py-4 text-base font-medium transition-all duration-200 cursor-pointer bg-gradient-to-l from-purple-700/40 via-purple-600/20 to-transparent rounded-l-lg shadow-lg"
              style={{
                transform: "rotate(-30deg)",
                transformOrigin: "top right",
                boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
                marginRight: "-20px",
                width: "150px"
              }}
            >
              <span className="relative z-10 block text-white font-semibold drop-shadow-sm text-right pr-2">
                {link.name}
              </span>
              <div className="absolute inset-0 bg-gradient-to-l from-purple-600/40 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-lg" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/80 to-purple-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-right" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </motion.aside>

  {/* القائمة الجانبية المنزلقة للموبايل - فائقة السرعة */}
  <AnimatePresence mode="wait">
    {mobileMenuOpen && (
      <>
        {/* خلفية معتمة سريعة جداً */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] md:hidden"
        />
        
        {/* القائمة الجانبية - انزلاق سريع */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ 
            duration: 0.2,
            ease: [0.2, 0.9, 0.4, 1]
          }}
          className="fixed top-0 right-0 bottom-0 w-72 bg-gradient-to-b from-black/95 via-purple-950/90 to-black/95 backdrop-blur-xl border-l border-purple-500/30 shadow-2xl p-6 md:hidden z-[201] overflow-y-auto"
          style={{ 
            boxShadow: "-5px 0 30px rgba(168,85,247,0.2)",
          }}
        >
          {/* زر الإغلاق */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 left-4 p-2 text-white hover:bg-purple-500/20 rounded-lg transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Logo */}
          <div className="flex justify-center mb-8 pt-4">
            <img
              src="/img/onrequs.webp"
              alt="OnRequest Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          
          {/* الروابط - لا حركة عند الفتح */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="block py-3.5 px-5 text-gray-300 hover:text-white text-center rounded-xl hover:bg-purple-500/20 active:bg-purple-500/30 transition-colors duration-150 text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</>
  );
};

export default Navbar;