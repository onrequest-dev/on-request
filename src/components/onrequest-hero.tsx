// components/ui/onrequest-hero.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { ArrowRight, Zap, Menu, X } from "lucide-react";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// Dynamic navigation links
const navLinks = [
  { name: "الرئيسية", href: "#home" },
  { name: "المنتجات", href: "#products" },
  { name: "الحلول", href: "#solutions" },
  { name: "المميزات", href: "#features" },
  { name: "التواصل", href: "#contact" },
];

const OnRequestHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Particle animation with futuristic purple/white theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 250,
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
        size: number,
        color: string,
      ) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 4;
            this.y -= forceDirectionY * force * 4;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      const numberOfParticles = Math.min(
        (canvas.height * canvas.width) / 12000,
        300,
      );
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x =
          Math.random() * (window.innerWidth - size * 2 - size * 2) + size * 2;
        const y =
          Math.random() * (window.innerHeight - size * 2 - size * 2) + size * 2;
        const directionX = Math.random() * 0.3 - 0.15;
        const directionY = Math.random() * 0.3 - 0.15;
        const color =
          Math.random() > 0.7
            ? `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})`
            : `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const connect = () => {
      if (!ctx || !canvas) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          const maxDistance = (canvas.width / 6) * (canvas.height / 6);

          if (distance < maxDistance) {
            const opacityValue = 1 - distance / maxDistance;

            const dxMouseA = particles[a].x - (mouse.x || 0);
            const dyMouseA = particles[a].y - (mouse.y || 0);
            const distanceMouseA = Math.sqrt(
              dxMouseA * dxMouseA + dyMouseA * dyMouseA,
            );

            if (mouse.x && distanceMouseA < mouse.radius) {
              ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.8})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.3})`;
            }

            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawGrid = () => {
      if (!ctx || !canvas) return;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;

      const step = 80;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(168, 85, 247, 0.02)";
      for (let i = -canvas.height; i < canvas.width + canvas.height; i += 120) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0a0f");
      gradient.addColorStop(1, "#050508");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      drawGrid();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

  // Text animation variants - characters appear with stagger
  const textRevealVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.3,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.2,
      },
    },
  };

  // Split text for animation
  const mainTitle = "OnRequest";
  const subtitleText =
  `
  نصمم الحلول الرقمية التي تلبي احتياجتك وتمنحك راحة البال والتركيز على النجاح.
  `
  return (
    <div className="relative min-h-screen w-full overflow-hidden" dir="rtl">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-20 w-full px-6 sm:px-8 lg:px-12 py-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center"
          >
            <img
              src="/img/onrequs.png"
              alt="OnRequest Logo"
              className="h-10 w-auto object-contain"
            />
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                custom={idx}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 relative group"
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Connect Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:cursor-pointer hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white text-sm font-medium hover:bg-purple-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            تواصل معنا
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
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
            className="absolute top-20 left-0 right-0 mx-4 bg-black/90 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 md:hidden z-30 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 text-gray-300 hover:text-white text-center transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full mt-2 py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white text-sm font-medium hover:bg-purple-600/30 transition-all">
              تواصل معنا
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content Container - Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full py-12 lg:py-0">
          {/* Left Side - Typography */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Badge with animation */}
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm w-fit"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap className="h-3.5 w-3.5 text-purple-400" />
              </motion.div>
              <span className="text-xs font-medium tracking-wider text-gray-300 uppercase">
                استثمارات رقمية ذكية
              </span>
            </motion.div>

            {/* Main Headline with character animation */}
            <motion.div
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              className="text-6xl sm:text-7xl md:text-7xl lg:text-7xl font-black mb-6 tracking-tighter leading-[1.1]"
              style={{
                fontFamily: "Somar Medium, 'Segoe UI', system-ui, sans-serif",
              }}
            >
              {mainTitle.split("").reverse().map((char, index) => (
                <motion.span
                  key={index}
                  variants={charVariants}
                  className="inline-block text-white"
                  style={{
                    textShadow: "0 0 40px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtitle with staggered animation */}
            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-lg"
            >
              {subtitleText.split(" ").map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1 + idx * 0.1,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="inline-block ml-2"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

{/* CTA Button with enhanced animation */}
<motion.button
  custom={2}
  variants={fadeUpVariants}
  initial="hidden"
  animate="visible"
  whileHover={{
    scale: 1.05,
    boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
  }}
  whileTap={{ scale: 0.95 }}
  className="hover:cursor-pointer group relative w-fit flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg overflow-visible"
  style={{
    clipPath:
      "polygon(0% 0%, 100% 0%, 100% 70%, 90% 100%, 0% 100%)",
  }}
>
  {/* Decorative purple plus signs on outer corners */}
  <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1V15M1 8H15" stroke="#6800ca" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  </div>
  <div className="absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1V15M1 8H15" stroke="#6800ca" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  </div>
  <div className="absolute -bottom-2 -right-2 w-4 h-4 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1V15M1 8H15" stroke="#6800ca" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  </div>
  <div className="absolute -bottom-2 -left-2 w-4 h-4 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1V15M1 8H15" stroke="#6800ca" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  </div>

  <motion.span
    initial={{ x: 0 }}
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    ابدأ مشروعك 
  </motion.span>
  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
</motion.button>
          </div>

          {/* Right Side - 3D Character with minimal decoration */}
          <motion.div
            custom={0}
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center lg:justify-end items-center order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main 3D Character Image */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Purple glow effect */}
                <motion.div
                  className="absolute inset-0 bg-purple-500/15 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Image with floating animation */}
                <motion.img
                  src="/img/onrequestavatar.png"
                  alt="OnRequest - مستكشف رقمي"
                  className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[600px] lg:h-[600px] object-contain mx-auto drop-shadow-2xl"
                  animate={{
                    scale: [1, 1.03, 1],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 0,
                    transition: { duration: 0.3 },
                  }}
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.3))",
                  }}
                />

                {/* Floating tech particles around image */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 45) * 30, 0],
                      y: [0, Math.sin(i * 45) * 30, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2.5 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default OnRequestHero;
