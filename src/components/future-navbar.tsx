"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ArrowRight } from "lucide-react";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// ==================== SVG Frame Components ====================
function LeftFrame() {
  return (
    <svg
      className="absolute inset-0 size-full drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 64"
      preserveAspectRatio="none"
    >
      <path
        d="M0 0 L194 0 L189 0 L200 29 L0 11 L0 0"
        stroke="#a855f7"
        strokeWidth="1"
        fill="rgba(168,85,247,0.08)"
      />
      <path
        d="M0 14 L193 33"
        stroke="rgba(168,85,247,0.22)"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );
}

function MainFrame() {
  return (
    <svg
      className="absolute inset-0 size-full drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 64"
      preserveAspectRatio="none"
    >
      {/* Main shape */}
      <path
        d="M6 0 L693.5 0 L700 9 L672 49 L162 49 L164 34 L153 49 L27 49 L0 8 L6 0"
        stroke="#a855f7"
        strokeWidth="1"
        fill="rgba(168,85,247,0.2)"
      />
      {/* Inner detail */}
      <path
        d="M32 49 L152.5 49 L163.5 35 L161.5 49 L667.5 49 L663.5 57 L163.5 57 L165.5 41 L152.5 57 L37 57 L32 49"
        stroke="rgba(168,85,247,0.57)"
        strokeWidth="1"
        fill="transparent"
      />
      {/* Diagonal lines */}
      <path
        d="M0 33 M4 33 L18.5 52 L23.5 52 L29 64 L155 64 L160 56 L161 64 L672 64 L677 53 L683 53 L686 50 L700 50"
        stroke="rgba(168,85,247,0.23)"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );
}

function RightFrame() {
  return (
    <svg
      className="absolute inset-0 size-full drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 64"
      preserveAspectRatio="none"
    >
      <path
        d="M19 0 L255 0 L260 7 L224 44 L0 44 L25 9 L19 1"
        stroke="rgba(168,85,247,0.5)"
        strokeWidth="1"
        fill="rgba(168,85,247,0.1)"
      />
      <path
        d="M25 50 L228 51 L245 36"
        stroke="rgba(168,85,247,0.23)"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );
}

function RightEndFrame() {
  return (
    <svg
      className="absolute inset-0 size-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 64"
      preserveAspectRatio="none"
    >
      <path
        d="M12 0 L100 0 L100 16 L0 22 L18 7 L12 0"
        stroke="rgba(168,85,247,0.9)"
        strokeWidth="1"
        fill="rgba(168,85,247,0.08)"
      />
      <path
        d="M3 28 L100 20"
        stroke="rgba(168,85,247,0.23)"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );
}

// ==================== Future Button ====================
function FutureButton({
  children,
  className,
  onClick,
  variant = "purple",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "purple" | "default";
}) {
  const colors = {
    purple: {
      stroke: "#a855f7",
      fill: "rgba(168,85,247,0.15)",
      fill2: "rgba(168,85,247,0.08)",
    },
    default: {
      stroke: "#4f46e5",
      fill: "rgba(79,70,229,0.15)",
      fill2: "rgba(79,70,229,0.08)",
    },
  };

  const c = colors[variant] || colors.purple;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative px-6 py-2 font-bold text-white cursor-pointer transition-all hover:scale-105",
        className
      )}
    >
      <div className="absolute inset-0 -mb-2">
        <svg
          className="absolute inset-0 size-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 160 48"
          preserveAspectRatio="none"
        >
          <path
            d="M17 0 L153 0 L160 9.5 L142 42 L4 42 L0 33 L17 0"
            stroke={c.stroke}
            strokeWidth="1"
            fill={c.fill}
          />
          <path
            d="M9 42 L138 42 L135 48 L12 48 L9 42"
            stroke={c.stroke}
            strokeWidth="1"
            fill={c.fill2}
          />
        </svg>
      </div>
      <span className="relative flex items-center justify-center gap-1.5 text-sm">
        {children}
      </span>
    </button>
  );
}

// ==================== Mobile Menu Button ====================
function MobileMenuButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-5 py-2 font-bold text-white cursor-pointer",
        className
      )}
    >
      <div className="absolute inset-0 -mb-2">
        <svg
          className="absolute inset-0 size-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 110 48"
          preserveAspectRatio="none"
        >
          <path
            d="M17 0 L103 0 L110 9.5 L92 42 L4 42 L0 33 L17 0"
            stroke="#a855f7"
            strokeWidth="1"
            fill="rgba(168,85,247,0.15)"
          />
          <path
            d="M9 42 L88 42 L85 48 L12 48 L9 42"
            stroke="#a855f7"
            strokeWidth="1"
            fill="rgba(168,85,247,0.08)"
          />
        </svg>
      </div>
      <span className="relative flex items-center gap-1.5 text-xs">
        <Zap className="size-3.5 text-purple-400" />
        القائمة
      </span>
    </button>
  );
}

// ==================== FutureNavbar ====================
interface NavLink {
  name: string;
  href: string;
}

interface FutureNavbarProps {
  logo?: string;
  logoText?: string;
  links?: NavLink[];
  ctaText?: string;
  onCtaClick?: () => void;
}

function FutureNavbar({
  logo = "/img/onrequs.png",
  logoText = "OnRequest",
  links = [
    { name: "الرئيسية", href: "#home" },
    { name: "المنتجات", href: "#products" },
    { name: "الحلول", href: "#solutions" },
    { name: "المميزات", href: "#features" },
    { name: "التواصل", href: "#contact" },
  ],
  ctaText = "تواصل معنا",
  onCtaClick,
}: FutureNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // إخفاء الناف بار عند النزول للأسفل، إظهاره عند الصعود للأعلى
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // إظهار الناف بار في الأعلى دائماً
      if (currentScrollY < 100) {
        setVisible(true);
      } 
      // إخفاء عند النزول، إظهار عند الصعود
      else if (currentScrollY > lastScrollY + 10) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 10) {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: visible ? 0 : -100, 
          opacity: visible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        dir="rtl"
      >
        <div className="h-16 mt-2 mx-2 lg:-mt-px lg:-mx-px flex w-full">
          {/* Left Decorative Frame (Desktop) */}
          <div className="size-full relative -mr-[11px] hidden lg:block">
            <LeftFrame />
          </div>

          {/* Main Navbar */}
          <div className="flex lg:container h-full relative flex-none w-full">
            <div className="flex-none h-full px-4 sm:px-8 lg:px-14 relative w-full lg:w-auto">
              <div className="absolute inset-0 hidden lg:block">
                <MainFrame />
              </div>
              {/* Mobile background */}
              <div className="absolute inset-0 lg:hidden rounded-2xl border border-purple-500/20 bg-black/60 backdrop-blur-xl" />

              <div className="flex items-center h-full relative z-10">
                {/* Logo */}
                <motion.a
                  href="/"
                  className="flex items-center gap-2.5 shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={logo}
                    alt={`${logoText} Logo`}
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                  <span className="font-bold text-white text-sm sm:text-base">
                    {logoText}
                  </span>
                </motion.a>

                {/* Desktop Links - مع مسافة مناسبة للغة العربية */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6 mr-8 xl:mr-12 font-medium">
                  {links.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm relative group whitespace-nowrap"
                      whileHover={{ y: -2 }}
                    >
                      {link.name}
                      <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden mr-auto">
                  <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
                </div>
              </div>
            </div>

            {/* Right Side - CTA (Desktop) */}
            <div className="w-full relative -ml-[25px] lg:flex justify-end pe-6 hidden">
              <div className="absolute inset-0">
                <RightFrame />
              </div>
              <div className="flex items-center relative z-10 -mt-3.5">
                <FutureButton onClick={onCtaClick} variant="purple">
                  <Zap className="size-3 text-purple-400" />
                  <span className="whitespace-nowrap">{ctaText}</span>
                </FutureButton>
              </div>
            </div>
          </div>

          {/* Right End Decorative Frame (Desktop) */}
          <div className="size-full relative -ml-[18px] hidden lg:block">
            <RightEndFrame />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-black/95 border-l border-purple-500/20 shadow-2xl overflow-y-auto"
              dir="rtl"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/10">
                <img src={logo} alt="Logo" className="h-7 w-auto" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-500/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="p-4 space-y-1">
                {links.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="block px-4 py-3.5 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all text-right text-base font-medium"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="p-4 mt-4">
                <button
                  onClick={() => {
                    onCtaClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-white font-medium hover:bg-purple-600/30 transition-all"
                >
                  <Zap className="size-4 text-purple-400" />
                  {ctaText}
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-500/10">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Zap className="size-3 text-purple-500" />
                  <span>استثمارات رقمية ذكية</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { FutureButton };
export default FutureNavbar;