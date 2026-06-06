// components/ui/services-carousel.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, Transition } from "motion/react";
import { cn } from "../../lib/utils";
import {
  Smartphone,
  Monitor,
  Globe,
  Cpu,
  Database,
  Shield,
  BarChart3,
  Cog,
  Rocket,
  Briefcase,
  PenTool,
} from "lucide-react";

const SERVICES = [
  {
    id: "strategy-consulting",
    label: "استراتيجية واطلاق المنتج",
    icon: Rocket,
    image: "img/services/strategy.webp",
    description:
      "نحول فكرتك إلى خارطة طريق تنفيذية، من دراسة الجدوى التقنية وحتى خطة الذهاب إلى السوق.",
  },
  {
    id: "ui-ux-design",
    label: "تصميم تجربة المستخدم",
    icon: PenTool,
    image: "img/services/uiux.webp",
    description:
      "نصمم واجهات احترافية. نبني رحلة مستخدم تزيد من التحويلات وتعكس هويتك.",
  },
  {
    id: "mobile-apps",
    label: "تطبيقات موبايل",
    icon: Smartphone,
    image: "img/services/appfon.webp",
    description:
      "نبني تطبيقات iOS و Android بأداء سلس وتجربة مستخدم لا تُنسى، مصممة لتدوم وتتوسع.",
  },
  {
    id: "fullstack-web",
    label: "تطبيقات ويب متكاملة",
    icon: Globe,
    image: "img/services/webapp.webp",
    description:
      "نطور منصات ويب قوية وسريعة وآمنة. من لوحات التحكم المعقدة إلى منصات الخدمات، نصنع الحل الكامل.",
  },
  {
    id: "desktop-apps",
    label: "برمجيات سطح المكتب",
    icon: Monitor,
    image: "img/services/appdisck.webp",
    description:
      "حلول برمجية مخصصة لأنظمة التشغيل المختلفة، نضمن استقراراً وأداءً عالياً لأعمالك الحيوية.",
  },
  {
    id: "databases",
    label: "هندسة قواعد البيانات",
    icon: Database,
    image: "img/services/databases.webp",
    description:
      "نصمم بنية بيانات عالية الأداء والأمان، تضمن استمرارية عملك حتى أعلى معدلات النمو والاستخدام.",
  },
  {
    id: "security",
    label: "تحصين الأمن السيبراني",
    icon: Shield,
    image: "img/services/security.webp",
    description:
      "لا ننتظر الهجوم. نحمي منتجك الرقمي بشكل استباقي ونضمن سلامة بياناتك وبيانات عملائك.",
  },
  {
    id: "analytics",
    label: "تحليل البيانات",
    icon: BarChart3,
    image: "img/services/data.webp",
    description:
      "نحول بياناتك الخام إلى رؤى استراتيجية ومخططات تفاعلية، تمنحك وضوحاً كاملاً لاتخاذ القرار.",
  },
  {
    id: "automation",
    label: "أتمتة العمليات الذكية",
    icon: Cog,
    image: "img/services/otom.webp",
    description:
      "نحرر وقت فريقك من المهام المتكررة بأتمتة ذكية، ليتفرغوا للإبداع والنمو.",
  },
  {
    id: "technical-consulting",
    label: "استشارات تقنية",
    icon: Briefcase,
    image: "img/services/consulting.webp",
    description:
      "شريك تقني استراتيجي بجانبك. نوفر جلسات استشارية ودراسات تقنية شاملة لحل أصعب التحديات.",
  },
];

const AUTO_PLAY_INTERVAL = 4000;
const RESUME_DELAY = 3000;
const VISIBLE_CHIP_RADIUS = 2; // عرض ±2 chips حول المؤشر الحالي (إجمالي 5)

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function ServicesCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = ((step % SERVICES.length) + SERVICES.length) % SERVICES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = useCallback(
    (index: number) => {
      const diff = (index - currentIndex + SERVICES.length) % SERVICES.length;
      if (diff > 0) {
        setStep((s) => s + diff);
      }

      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }

      resumeTimeoutRef.current = setTimeout(() => {
        if (autoPlayEnabled && !isPaused) {
          autoPlayIntervalRef.current = setInterval(nextStep, AUTO_PLAY_INTERVAL);
        }
      }, RESUME_DELAY);
    },
    [currentIndex, autoPlayEnabled, isPaused, nextStep]
  );

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || !autoPlayEnabled) {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      return;
    }
    autoPlayIntervalRef.current = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [isPaused, autoPlayEnabled, nextStep]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setAutoPlayEnabled(false);
          if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
          if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Start auto-play after 5s of visibility
  useEffect(() => {
    if (!isVisible) {
      if (initialStartTimeoutRef.current) clearTimeout(initialStartTimeoutRef.current);
      return;
    }
    initialStartTimeoutRef.current = setTimeout(() => {
      setAutoPlayEnabled(true);
    }, 5000);
    return () => {
      if (initialStartTimeoutRef.current) clearTimeout(initialStartTimeoutRef.current);
    };
  }, [isVisible]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (initialStartTimeoutRef.current) clearTimeout(initialStartTimeoutRef.current);
    };
  }, []);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = SERVICES.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  // Mobile chip style calculation (memoized per index)
  const getMobileChipStyle = useCallback(
    (index: number) => {
      const diff = index - currentIndex;
      const len = SERVICES.length;
      let normalizedDiff = diff;
      if (diff > len / 2) normalizedDiff -= len;
      if (diff < -len / 2) normalizedDiff += len;

      const absDist = Math.abs(normalizedDiff);
      const direction = normalizedDiff > 0 ? 1 : -1;

      const xOffset = normalizedDiff * 160;
      const scale = Math.max(0.5, 1 - absDist * 0.2);
      const opacity = Math.max(0.1, 1 - absDist * 0.35);
      const zIndex = 100 - absDist * 10;
      const yOffset = absDist * 20;
      const rotateY = direction * absDist * 15;

      return { x: xOffset, scale, opacity, zIndex, y: yOffset, rotateY };
    },
    [currentIndex]
  );

  // Determine which chips to render on mobile (only current ± radius)
  const visibleChipIndices = useMemo(() => {
    if (!isMobile) return SERVICES.map((_, i) => i);
    const indices: number[] = [];
    for (let i = -VISIBLE_CHIP_RADIUS; i <= VISIBLE_CHIP_RADIUS; i++) {
      const idx = (currentIndex + i + SERVICES.length) % SERVICES.length;
      indices.push(idx);
    }
    return indices;
  }, [isMobile, currentIndex]);

const chipTransition: Transition = isMobile
  ? { type: "tween", duration: 0.35, ease: "easeOut" }
  : { type: "spring", stiffness: 100, damping: 20, mass: 0.8 };

const cardTransition: Transition = isMobile
  ? { type: "tween", duration: 0.4, ease: "easeOut" }
  : { type: "spring", stiffness: 260, damping: 25, mass: 0.8 };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black py-12 md:py-16 lg:py-24"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 md:mb-6 backdrop-blur-sm">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">
              خدماتنا المتكاملة
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 md:mb-4">
            حلول رقمية
            <span className="bg-clip-text text-transparent bg-gradient-to-r font-extrabold text-white mb-3 md:mb-4">
              {" "}
              متطورة
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            نقدم مجموعة متكاملة من الخدمات التقنية لتمكين استثماراتك الرقمية
            بأحدث التقنيات
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[500px] md:min-h-[550px] lg:min-h-[600px] lg:aspect-[16/9] border border-purple-500/20 bg-gray-900/50 backdrop-blur-sm">
          {/* Left Side - Services List */}
          <div className="w-full lg:w-[40%] h-[160px] md:h-[320px] lg:h-full relative z-30 flex items-center justify-center lg:justify-start overflow-hidden px-4 md:px-8 lg:px-12 bg-gradient-to-br from-gray-900 via-purple-950/20 to-black">
            <div className="absolute inset-x-0 top-0 h-16 md:h-20 lg:h-16 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent z-40 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 md:h-20 lg:h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-40 pointer-events-none" />

            {/* Desktop List */}
            <div className="hidden lg:flex relative w-full h-full items-center justify-start z-20">
              {SERVICES.map((service, index) => {
                const distance = index - currentIndex;
                const wrappedDistance = wrap(
                  -(SERVICES.length / 2),
                  SERVICES.length / 2,
                  distance
                );
                return (
                  <motion.div
                    key={service.id}
                    style={{ height: 65, width: "fit-content", willChange: "transform" }}
                    animate={{ y: wrappedDistance * 65, opacity: 1 - Math.abs(wrappedDistance) * 0.2 }}
                    transition={chipTransition}
                    className="absolute flex items-center justify-start"
                  >
                    <button
                      onClick={() => handleChipClick(index)}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-700 text-right group border",
                        index === currentIndex
                          ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/25 z-10"
                          : "bg-transparent text-gray-400 border-gray-700 hover:border-purple-500/50 hover:text-gray-200"
                      )}
                    >
                      <div className={cn("flex items-center justify-center transition-colors duration-500", index === currentIndex ? "text-white" : "text-gray-500")}>
                        <service.icon size={18} strokeWidth={2} />
                      </div>
                      <span className="font-medium text-sm whitespace-nowrap">{service.label}</span>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile List - only visible chips rendered */}
            <div className="lg:hidden relative w-full h-full flex items-center justify-center perspective-1000 z-20">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[500px] h-20 flex items-center justify-center">
                {SERVICES.map((service, index) => {
                  if (!visibleChipIndices.includes(index)) return null;
                  const style = getMobileChipStyle(index);
                  const isActive = index === currentIndex;
                  return (
                    <motion.div
                      key={service.id}
                      animate={{
                        x: style.x,
                        scale: style.scale,
                        opacity: style.opacity,
                        zIndex: style.zIndex,
                        y: style.y,
                        rotateY: style.rotateY,
                      }}
                      transition={chipTransition}
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ perspective: "1000px", willChange: "transform, opacity" }}
                    >
                      <button
                        onClick={() => handleChipClick(index)}
                        onTouchStart={() => setIsPaused(true)} // mobile touch pause
                        onTouchEnd={() => setIsPaused(false)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className={cn(
                          "relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-500 text-right group border whitespace-nowrap touch-manipulation",
                          isActive
                            ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/30 z-10"
                            : "bg-gray-800/80 text-gray-400 border-gray-700 hover:border-purple-500/50 backdrop-blur-sm"
                        )}
                      >
                        <div className={cn("flex items-center justify-center transition-colors duration-500", isActive ? "text-white" : "text-gray-500")}>
                          <service.icon size={16} strokeWidth={2} />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{service.label}</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Preview Cards */}
          <div className="flex-1 min-h-[350px] md:min-h-[400px] lg:h-full relative bg-black/50 flex items-center justify-center py-8 md:py-12 lg:py-12 px-4 md:px-8 lg:px-8 overflow-hidden border-t lg:border-t-0 lg:border-l border-purple-500/20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] aspect-[4/5] flex items-center justify-center">
              {SERVICES.map((service, index) => {
                const status = getCardStatus(index);
                const isActive = status === "active";
                const isPrev = status === "prev";
                const isNext = status === "next";

                return (
                  <motion.div
                    key={service.id}
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                      scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.3 : 0,
                      rotate: isPrev ? -5 : isNext ? 5 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    transition={cardTransition}
                    className="absolute inset-0 rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-2 border-purple-500/30 bg-gray-900 origin-center shadow-2xl"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <img
                      src={service.image}
                      alt={service.label}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isActive ? "grayscale-0 blur-0 scale-100" : "grayscale blur-[1px] brightness-50 scale-110"
                      )}
                      loading="lazy"
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 pt-16 md:pt-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end"
                        >
                          <div className="bg-purple-500/20 backdrop-blur-md text-purple-200 px-3 py-1 rounded-full text-xs font-medium w-fit mb-2 md:mb-3 border border-purple-500/30">
                            {service.label}
                          </div>
                          <p className="text-white font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed drop-shadow-md">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isActive && (
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                        <span className="text-purple-300/80 text-xs font-medium">OnRequest</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8">
          {SERVICES.map((service, index) => (
            <button
              key={service.id}
              onClick={() => handleChipClick(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === currentIndex ? "w-6 md:w-8 bg-purple-500" : "w-1.5 bg-gray-700 hover:bg-gray-600"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesCarousel;