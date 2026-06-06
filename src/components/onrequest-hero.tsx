// components/ui/onrequest-hero.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const OnRequestHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobileWidth = window.innerWidth < 768;
      const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileWidth || userAgent);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Particle animation with performance optimizations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId: number;
    let particles: Particle[] = [];
    let staticBgCanvas: HTMLCanvasElement | null = null;

    // Throttled mouse position
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let pendingMouseUpdate = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (pendingMouseUpdate) return;
      pendingMouseUpdate = true;
      requestAnimationFrame(() => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        pendingMouseUpdate = false;
      });
    };
    const handleMouseOut = () => {
      mouseX = null;
      mouseY = null;
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
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

      update(canvasWidth: number, canvasHeight: number) {
        if (this.x > canvasWidth || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvasHeight || this.y < 0) this.directionY = -this.directionY;

        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const mouseRadius = isMobile ? 180 : 250;
          if (distance < mouseRadius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseRadius - distance) / mouseRadius;
            this.x -= forceDirectionX * force * 4;
            this.y -= forceDirectionY * force * 4;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particles
    function initParticles(width: number, height: number) {
      particles = [];
      let numberOfParticles = isMobile
        ? Math.min((height * width) / 25000, 80)
        : Math.min((height * width) / 12000, 240);
      numberOfParticles = Math.max(40, numberOfParticles);

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x = Math.random() * (width - size * 2) + size;
        const y = Math.random() * (height - size * 2) + size;
        const directionX = (Math.random() - 0.5) * 0.4;
        const directionY = (Math.random() - 0.5) * 0.4;
        const color =
          Math.random() > 0.7
            ? `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})`
            : `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Draw static background (gradient + grid) to offscreen canvas
    function drawStaticBackground(width: number, height: number) {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return null;

      // Gradient background
      const gradient = offCtx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0a0a0f");
      gradient.addColorStop(1, "#050508");
      offCtx.fillStyle = gradient;
      offCtx.fillRect(0, 0, width, height);

      // Main grid
      offCtx.save();
      offCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      offCtx.lineWidth = 0.5;
      const step = isMobile ? 120 : 80;
      for (let x = 0; x < width; x += step) {
        offCtx.beginPath();
        offCtx.moveTo(x, 0);
        offCtx.lineTo(x, height);
        offCtx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        offCtx.beginPath();
        offCtx.moveTo(0, y);
        offCtx.lineTo(width, y);
        offCtx.stroke();
      }

      // Diagonal lines – skip on mobile for performance
      if (!isMobile) {
        offCtx.strokeStyle = "rgba(168, 85, 247, 0.02)";
        for (let i = -height; i < width + height; i += 120) {
          offCtx.beginPath();
          offCtx.moveTo(i, 0);
          offCtx.lineTo(i + height, height);
          offCtx.stroke();
        }
      }
      offCtx.restore();
      return offCanvas;
    }

    // Connect particles with lines
    function drawConnections(width: number, height: number) {
      if (!ctx) return;
      const maxDistance = isMobile
        ? (width / 8) * (height / 8)
        : (width / 6) * (height / 6);
      const mouseRadius = isMobile ? 180 : 250;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          if (distance < maxDistance) {
            const opacityValue = 1 - distance / maxDistance;
            let strokeColor;
            if (mouseX !== null && mouseY !== null) {
              const dxMouse = particles[a].x - mouseX;
              const dyMouse = particles[a].y - mouseY;
              const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
              if (distToMouse < mouseRadius) {
                strokeColor = `rgba(168, 85, 247, ${opacityValue * 0.8})`;
              } else {
                strokeColor = `rgba(255, 255, 255, ${opacityValue * 0.3})`;
              }
            } else {
              strokeColor = `rgba(255, 255, 255, ${opacityValue * 0.3})`;
            }
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Resize handler
    function resizeAndInit() {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      staticBgCanvas = drawStaticBackground(width, height);
      initParticles(width, height);
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);

      // Draw static background from cached canvas
      if (staticBgCanvas) {
        ctx.drawImage(staticBgCanvas, 0, 0);
      } else {
        // fallback (should never happen)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#0a0a0f");
        gradient.addColorStop(1, "#050508");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
      }
      drawConnections(canvas.width, canvas.height);
    }

    window.addEventListener("resize", resizeAndInit);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    resizeAndInit();
    animate();

    return () => {
      window.removeEventListener("resize", resizeAndInit);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // Animation variants (unchanged)
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
    hidden: { opacity: 0, y: 20, rotateX: -90 },
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

  const mainTitle = "OnRequest";
  const subtitleText = `نصمم الحلول الرقمية التي تلبي احتياجتك وتمنحك راحة البال والتركيز على النجاح.`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden" dir="rtl">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ willChange: "transform" }}
      />

      {/* Main Content Container - Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full py-12 lg:py-0">
          {/* Left Side - Typography */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm w-fit"
              whileHover={{ scale: 1.05 }}
              style={{ willChange: "transform" }}
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
                    willChange: "transform, opacity",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtitle */}
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
                  style={{ willChange: "transform, opacity" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* CTA Button - Telegram link */}
            <motion.a
              href="https://t.me/OnRequest_dev"
              target="_blank"
              rel="noopener noreferrer"
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
                clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 90% 100%, 0% 100%)",
                willChange: "transform",
              }}
            >
              {/* Decorative purple plus signs */}
              <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15" stroke="#B700FF" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute -top-2 -left-2 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15" stroke="#B700FF" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15" stroke="#B700FF" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15" stroke="#B700FF" strokeWidth="5" strokeLinecap="round" />
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
            </motion.a>
          </div>

          {/* Right Side - 3D Character */}
          <motion.div
            custom={0}
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center lg:justify-end items-center order-1 lg:order-2"
          >
            <div className="relative">
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
              >
                {/* Purple glow */}
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
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Main Image */}
                <motion.img
                  src="/img/onrequestavatar.webp"
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
                    willChange: "transform",
                  }}
                />

                {/* Floating tech particles – reduced count on mobile */}
                {[...Array(isMobile ? 4 : 8)].map((_, i) => (
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
                      willChange: "transform, opacity",
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