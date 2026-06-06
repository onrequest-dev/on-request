// components/ui/team-card-stack.tsx
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, Transition } from "framer-motion";
import {
  Globe,
  Code2,
  FileText,
  Mail,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { JoinRequestModal } from "./join-request-modal";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// ==================== Types ====================
export type TeamCardItem = {
  id: number;
  nameAr: string;
  roleAr: string;
  bio: string;
  image: string;
  linkedin?: string;
  github?: string;
  cv?: string;
  email?: string;
  location?: string;
  experience?: string;
  specialties: string[];
  category: string;
};

export type TeamCardStackProps = {
  items: TeamCardItem[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: TeamCardItem) => void;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

// ==================== Optimised Wave Background ====================
function WaveBackground({ isMobile }: { isMobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const waveCount = isMobile ? 3 : 5;
    const waveData = Array.from({ length: waveCount }).map(() => ({
      value: Math.random() * 0.3 + 0.05,
      targetValue: Math.random() * 0.3 + 0.05,
      speed: Math.random() * 0.012 + 0.004,
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < 0.006) data.targetValue = Math.random() * 0.4 + 0.05;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const step = isMobile ? 4 : 2; // lower resolution on mobile
      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += step) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.025 + freq * 0.018;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 1.3) *
            freq *
            0.07 *
            ((i + 1) / waveCount);
          const y = ((py + 1) * canvas.height) / 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const r = 110 + i * 20;
        const g = 85 + i * 25;
        const b = 210 + i * 8;
        ctx.lineWidth = 0.7 + i * 0.15;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
        ctx.shadowBlur = isMobile ? 0 : 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += isMobile ? 0.008 : 0.012;
      updateWaveData();
      draw();
      frameRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ==================== Member Card ====================
function MemberFanCard({ item, active }: { item: TeamCardItem; active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl card-border">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
      </div>

      <div
        className={cn(
          "h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500 transition-opacity duration-500",
          active ? "opacity-100" : "opacity-40"
        )}
      />

      <div className="flex h-full">
        <div className="w-[45%] relative flex-shrink-0">
          <div className="absolute inset-2 rounded-xl overflow-hidden gradient-border inner-glow">
            <img
              src={item.image}
              alt={item.nameAr}
              className="w-full h-full object-cover"
              draggable={false}
              loading="lazy"
            />
          </div>
          {active && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 flex items-center gap-1.5 glass px-2 py-0.5 rounded-full border border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-[10px]">متاح</span>
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center p-4 pr-5">
          <div className="mb-3">
            <span className="inline-block px-2.5 py-0.5 glass text-purple-300 rounded-full text-[10px] font-medium border border-purple-400/20 mb-2">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-white mb-0.5">{item.nameAr}</h3>
            <p className="text-purple-400/70 text-xs font-medium">{item.roleAr}</p>
          </div>
          <p className="text-white/50 text-[11px] leading-relaxed line-clamp-6 mb-3">
            {item.bio}
          </p>
          <div
            className={cn(
              "flex items-center gap-1.5 transition-all duration-500",
              active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            )}
          >
            {item.linkedin && (
              <a href={item.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg glass text-blue-400 hover:text-blue-300 border border-blue-400/20 transition-all">
                <Globe size={12} />
              </a>
            )}
            {item.github && (
              <a href={item.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg glass text-gray-400 hover:text-white border border-white/10 transition-all">
                <Code2 size={12} />
              </a>
            )}
            {item.cv && (
              <a href={item.cv} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg glass text-purple-400 hover:text-purple-300 border border-purple-400/20 transition-all">
                <FileText size={12} />
              </a>
            )}
            {item.email && (
              <a href={`mailto:${item.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg glass text-green-400 hover:text-green-300 border border-green-400/20 transition-all">
                <Mail size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

// ==================== Main TeamCardStack ====================
export function TeamCardStack({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 520,
  cardHeight = 300,
  overlap = 0.5,
  spreadDeg = 55,
  perspectivePx = 1200,
  depthPx = 150,
  tiltXDeg = 10,
  activeLiftPx = 25,
  activeScale = 1.04,
  inactiveScale = 0.92,
  springStiffness = 260,
  springDamping = 26,
  loop = true,
  autoAdvance = true,
  intervalMs = 3000,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
}: TeamCardStackProps) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mobile detection + responsive card size
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const actualCardWidth = isMobile ? Math.min(340, window.innerWidth - 32) : cardWidth;
  const actualCardHeight = isMobile ? 380 : cardHeight;
  const actualMaxVisible = isMobile ? Math.min(3, maxVisible) : maxVisible;
  const maxOffset = Math.max(0, Math.floor(actualMaxVisible / 2));
  const cardSpacing = Math.max(8, Math.round(actualCardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  // Update active on items change
  useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active, items, onChangeIndex, len]);

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setAutoPlayEnabled(false);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Start auto-play after 5 seconds of visibility
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setAutoPlayEnabled(true), 5000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  // Autoplay interval
  useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || !autoPlayEnabled) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(800, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next, autoPlayEnabled]);

  if (!len) return null;

  // Mobile spring tuning: smoother, less bounce
const springConfig: Transition = isMobile
  ? { type: "spring", stiffness: 180, damping: 28, mass: 0.6 }
  : { type: "spring", stiffness: springStiffness, damping: springDamping, mass: 1 };

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-16 md:py-24 overflow-hidden" dir="rtl">
      <WaveBackground isMobile={isMobile} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-purple-300 border border-purple-400/20 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">فريق OnRequest</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
            نخبة
            <span className="bg-clip-text text-transparent bg-gradient-to-r font-extrabold text-white mb-4 tracking-tight">
              {" "}
              الخبراء
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            فريق يجمع بين الخبرة المالية العميقة والتميز التقني
          </p>
        </motion.div>

        {/* Card Stack */}
        <div
          className={cn("w-full", className)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            className="relative w-full"
            style={{ height: Math.max(420, actualCardHeight + 100) }}
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-40 w-[70%] rounded-full bg-purple-500/5 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-36 w-[76%] rounded-full bg-purple-500/5 blur-3xl" aria-hidden="true" />

            <div className="absolute inset-0 flex items-end justify-center" style={{ perspective: `${perspectivePx}px` }}>
              <AnimatePresence initial={false}>
                {items.map((item, i) => {
                  const off = signedOffset(i, active, len, loop);
                  const abs = Math.abs(off);
                  if (abs > maxOffset) return null;

                  const rotateZ = off * stepDeg;
                  const x = off * cardSpacing;
                  const y = abs * 8;
                  const z = -abs * depthPx;
                  const isActive = off === 0;
                  const scale = isActive ? activeScale : inactiveScale;
                  const lift = isActive ? -activeLiftPx : 0;
                  const rotateX = isActive ? 0 : tiltXDeg;
                  const zIndex = 100 - abs;

                  const dragProps = isActive
                    ? {
                        drag: "x" as const,
                        dragConstraints: { left: 0, right: 0 },
                        dragElastic: 0.15,
                        dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
                        onDragEnd: (_e: any, info: { offset: { x: number }; velocity: { x: number } }) => {
                          if (reduceMotion) return;
                          const travel = info.offset.x;
                          const v = info.velocity.x;
                          const threshold = Math.min(120, actualCardWidth * 0.2);
                          if (travel > threshold || v > 500) prev();
                          else if (travel < -threshold || v < -500) next();
                        },
                      }
                    : {};

                  return (
                    <motion.div
                      key={item.id}
                      className={cn(
                        "absolute bottom-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5",
                        "will-change-transform select-none touch-none",
                        isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                      )}
                      style={{
                        width: actualCardWidth,
                        height: actualCardHeight,
                        zIndex,
                        transformStyle: "preserve-3d",
                      }}
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, y: y + 30, x, rotateZ, rotateX, scale }
                      }
                      animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale }}
                      transition={springConfig}
                      onClick={() => setActive(i)}
                      {...dragProps}
                    >
                      <div className="h-full w-full" style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
                        <MemberFanCard item={item} active={isActive} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows & Dots */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prev}
              className="p-2.5 rounded-full glass text-white border border-white/10 hover:border-purple-400/40 hover:text-purple-300 transition-all disabled:opacity-30"
              disabled={!canGoPrev}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {showDots && (
              <div className="flex items-center gap-2">
                {items.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setActive(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      idx === active ? "w-8 bg-purple-500 shadow-lg shadow-purple-500/30" : "w-2 bg-white/20 hover:bg-white/40"
                    )}
                    aria-label={`${it.nameAr}`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={next}
              className="p-2.5 rounded-full glass text-white border border-white/10 hover:border-purple-400/40 hover:text-purple-300 transition-all rotate-180 disabled:opacity-30"
              disabled={!canGoNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Join Button - Styled as a prominent CTA */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowJoinModal(true)}
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass 
                        bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                        border border-purple-500/30 hover:border-purple-400/60
                        text-purple-300 hover:text-white
                        transition-all duration-300 ease-out
                        hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
                        active:scale-95
                        backdrop-blur-sm
                        font-medium text-sm md:text-base
                        cursor-pointer"
            >
              <span>هل تريد الانضمام لـ OnRequest ؟</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal with fast, smooth animation */}
      <AnimatePresence>
        {showJoinModal && (

              <JoinRequestModal onClose={() => setShowJoinModal(false)} />

        )}
      </AnimatePresence>
    </section>
  );
}

// ==================== TeamSection with data ====================
export function TeamSection() {
  const teamItems: TeamCardItem[] = [
    {
      id: 2,
      nameAr: "هادي قدور",
      roleAr: "Co-Founder & Head of Engineering",
      bio: "3 سنوات في بناء الحلول التقنية المعقدة. يقود تطوير الباك إند وهندسة الحلول المعقدة ،  صارم في الجودة، لا يرضى بالنتائج الأولية حتى تصل إلى أقصى كفاءة.",
      image: "/img/team/hadi.webp",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "ahmed@onrequest.com",
      location: "الرياض، السعودية",
      experience: "١٥+ سنة",
      specialties: ["الاستثمار", "التخطيط المالي", "الذكاء الاصطناعي"],
      category: "Co-Founder",
    },
    {
      id: 1,
      nameAr: "عبد القادر زكرة",
      roleAr: "Co-Founder & Head of Product",
      bio: "يركز على بناء منتجات تحل مشاكل حقيقية. يشرف على إخراج المنتج النهائي وتجربة المستخدم، ويربط بين الجدوى التقنية واحتياج السوق. يصفه فريقه بالمبدع والعملي معاً.",
      image: "/img/services/img1.png", // fixed path
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "sara@onrequest.com",
      location: "دبي، الإمارات",
      experience: "١٢+ سنة",
      specialties: ["بلوكتشين", "الأمن السيبراني", "هندسة البرمجيات"],
      category: "Co-Founder",
    },
    {
      id: 3,
      nameAr: "عبد الله كوراني",
      roleAr: "مسؤول التسويق",
      bio: "يدرس السوق والمنافسين بعمق. يزود الفريق برؤى استراتيجية عن احتياجات القطاعات المستهدفة، ويساهم في وضع المنتج في موقع تنافسي صحيح منذ البداية.",
      image: "/img/team/abdullahkorani.webp",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      cv: "https://example.com/cv",
      email: "mohammed@onrequest.com",
      location: "لندن، المملكة المتحدة",
      experience: "١٠+ سنة",
      specialties: ["تعلم الآلة", "تحليل البيانات", "الخوارزميات"],
      category: "Markting",
    },
    {
      id: 4,
      nameAr: "يوسف حيش",
      roleAr: "مسؤول المبيعات",
      bio: "مسؤول عن بناء العلاقات مع الشركات وإغلاق الصفقات. يفهم احتياجات العملاء ويصمم العروض المناسبة. يمثل الصوت الأول الذي يسمعه شركاؤنا ويمهد الطريق لتعاون طويل الأمد.",
      image: "/img/team/yusuf.webp",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "nora@onrequest.com",
      location: "عمّان، الأردن",
      experience: "٨+ سنة",
      specialties: ["تصميم الواجهات", "تجربة المستخدم", "التطبيقات المالية"],
      category: "Business Development",
    },
    {
      id: 5,
      nameAr: "محمد خليل رمضان",
      roleAr: "مدير المشاريع والتنسيق",
      bio: "حلقة الوصل بين العميل وفريق التطوير. يتأكد من وضوح المتطلبات منذ البداية، ويلتزم بالاتفاقات والمواعيد. يضمن سير العمل بسلاسة ويحافظ على توافق المخرجات مع توقعات العميل.",
      image: "/img/team/mohamedkhalel.webp",
      linkedin: "https://linkedin.com",
      email: "khalid@onrequest.com",
      location: "نيويورك، الولايات المتحدة",
      experience: "١٨+ سنة",
      specialties: ["تحليل مالي", "إدارة المخاطر", "تنويع المحافظ"],
      category: "Client Relations",
    },
{
  id: 6,
  nameAr: "راما الأصفر",
  roleAr: "مصممة تجربة مستخدم وواجهات",
  bio: "مصممة UI/UX بخبرة سنتين في تصميم تطبيقات الويب والموبايل. تحول الأفكار المعقدة إلى واجهات بسيطة وجذابة. تتقن Figma, Adobe XD, و Sketch، وتهتم بدراسة سلوك المستخدم لتحقيق أفضل تجربة.",
  image: "/img/team/rama.webp",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  cv: "https://example.com/cv",
  email: "rama@onrequest.com",
  location: "دبي، الإمارات",
  experience: "٤+ سنة",
  specialties: ["UI/UX Design", "Figma", "تجربة المستخدم", "اختبارات usability"],
  category: "Design",
},
{
  id: 7,
  nameAr: "فاطمة عبدالكريم",
  roleAr: "كاتبة محتوى تقني",
  bio: "كاتبة محتوى تقني بخبرة 3 سنوات في كتابة المقالات التقنية والوثائق والمحتوى التسويقي. تبسط المفاهيم التقنية المعقدة بأسلوب جذاب وسهل الفهم. تجيد تحسين محركات البحث (SEO) وبناء استراتيجيات المحتوى.",
  image: "/img/team/fatema.webp",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  cv: "https://example.com/cv",
  email: "fatema@onrequest.com",
  location: "الرياض، السعودية",
  experience: "٣+ سنة",
  specialties: ["كتابة تقنية", "SEO", "استراتيجية المحتوى", "التسويق الرقمي"],
  category: "Content",
},
  ];

  return (
    <TeamCardStack
      items={teamItems}
      autoAdvance={true}
      intervalMs={3500}
      pauseOnHover={true}
      showDots={true}
      loop={true}
      maxVisible={5}
      spreadDeg={60}
    />
  );
}

export default TeamSection;