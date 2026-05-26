// components/ui/services-carousel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import {
  Smartphone,
  Monitor,
  Globe,
  Cpu,
  CircuitBoard,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Cog,
  Rocket,
  Briefcase,
  PenTool,
} from "lucide-react";

// خدمات OnRequest للاستثمارات الرقمية
const SERVICES = [
  {
    id: "strategy-consulting",
    label: "استراتيجية واطلاق المنتج",
    icon: Rocket, // أو Target أو Compass
    image: "img/services/strategy.webp",
    description:
      "نحول فكرتك إلى خارطة طريق تنفيذية، من دراسة الجدوى التقنية وحتى خطة الذهاب إلى السوق.",
  },
  {
    id: "ui-ux-design",
    label: "تصميم تجربة المستخدم",
    icon: PenTool, // أو PenTool أو Layout
    image: "img/services/uiux.webp",
    description:
      "نصمم واجهات احترافية. نبني رحلة مستخدم تزيد من التحويلات وتعكس هويتك.",
  },
  {
    id: "mobile-apps",
    label: "تطبيقات موبايل ",
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
    label: " تحليل البيانات",
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
    label: "استشارات تقنية ",
    icon: Briefcase, // أو Users أو Lightbulb
    image: "img/services/consulting.webp",
    description:
      "شريك تقني استراتيجي بجانبك. نوفر جلسات استشارية ودراسات تقنية شاملة لحل أصعب التحديات.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function ServicesCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % SERVICES.length) + SERVICES.length) % SERVICES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + SERVICES.length) % SERVICES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

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

  return (
    <section className="w-full bg-black py-16 md:py-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">
              خدماتنا المتكاملة
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            حلول رقمية
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
              {" "}
              متطورة
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات التقنية لتمكين استثماراتك الرقمية
            بأحدث التقنيات
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-[16/9] border border-purple-500/20 bg-gray-900/50 backdrop-blur-sm">
          {/* Left Side - Services List */}
          <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 md:px-12 lg:pl-12 bg-gradient-to-br from-gray-900 via-purple-950/20 to-black">
            {/* Gradient Overlays */}
            <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent z-40" />
            <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-40" />

            {/* Services List */}
            <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
              {SERVICES.map((service, index) => {
                const isActive = index === currentIndex;
                const distance = index - currentIndex;
                const wrappedDistance = wrap(
                  -(SERVICES.length / 2),
                  SERVICES.length / 2,
                  distance,
                );

                return (
                  <motion.div
                    key={service.id}
                    style={{
                      height: ITEM_HEIGHT,
                      width: "fit-content",
                    }}
                    animate={{
                      y: wrappedDistance * ITEM_HEIGHT,
                      opacity: 1 - Math.abs(wrappedDistance) * 0.2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 22,
                      mass: 1,
                    }}
                    className="absolute flex items-center justify-start"
                  >
                    <button
                      onClick={() => handleChipClick(index)}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-5 md:px-8 lg:px-6 py-3 md:py-4 lg:py-3 rounded-full transition-all duration-700 text-right group border",
                        isActive
                          ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/25 z-10"
                          : "bg-transparent text-gray-400 border-gray-700 hover:border-purple-500/50 hover:text-gray-200",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center transition-colors duration-500",
                          isActive ? "text-white" : "text-gray-500",
                        )}
                      >
                        <service.icon size={18} strokeWidth={2} />
                      </div>
                      <span className="font-medium text-sm md:text-[15px] whitespace-nowrap">
                        {service.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Preview Cards */}
          <div className="flex-1 min-h-[400px] md:min-h-[500px] lg:h-full relative bg-black/50 flex items-center justify-center py-12 md:py-16 lg:py-12 px-6 md:px-10 lg:px-8 overflow-hidden border-t lg:border-t-0 lg:border-l border-purple-500/20">
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative w-full max-w-[380px] aspect-[4/5] flex items-center justify-center">
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
                      x: isActive ? 0 : isPrev ? -120 : isNext ? 120 : 0,
                      scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.3 : 0,
                      rotate: isPrev ? -5 : isNext ? 5 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      mass: 0.8,
                    }}
                    className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 border-purple-500/30 bg-gray-900 origin-center shadow-2xl"
                  >
                    <img
                      src={service.image}
                      alt={service.label}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isActive
                          ? "grayscale-0 blur-0 scale-100"
                          : "grayscale blur-[1px] brightness-50 scale-110",
                      )}
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-x-0 bottom-0 p-6 md:p-8 pt-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end"
                        >
                          <div className="bg-purple-500/20 backdrop-blur-md text-purple-200 px-4 py-1.5 rounded-full text-xs font-medium w-fit mb-3 border border-purple-500/30">
                            {service.label}
                          </div>
                          <p className="text-white font-medium text-lg md:text-xl leading-relaxed drop-shadow-md">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                        <span className="text-purple-300/80 text-xs font-medium">
                          OnRequest
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {SERVICES.map((service, index) => (
            <button
              key={service.id}
              onClick={() => handleChipClick(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === currentIndex
                  ? "w-8 bg-purple-500"
                  : "w-1.5 bg-gray-700 hover:bg-gray-600",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesCarousel;
