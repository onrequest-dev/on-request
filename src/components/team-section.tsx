// components/ui/team-card-stack.tsx
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Globe, 
  Code2, 
  FileText, 
  Mail,
  MapPin,
  Briefcase,
  Award,
  Quote,
  Sparkles,
  ChevronRight,
  ExternalLink
} from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// ==================== أنواع البيانات ====================
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

// ==================== خلفية الموجات ====================
function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    let animationId: number;
    
    const waveData = Array.from({ length: 5 }).map(() => ({
      value: Math.random() * 0.3 + 0.05,
      targetValue: Math.random() * 0.3 + 0.05,
      speed: Math.random() * 0.012 + 0.004
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function updateWaveData() {
      waveData.forEach(data => {
        if (Math.random() < 0.006) data.targetValue = Math.random() * 0.4 + 0.05;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.025 + freq * 0.018;
          const py = Math.sin(px * 10 + time) * Math.cos(px * 1.3) * freq * 0.07 * ((i + 1) / 5);
          const y = (py + 1) * canvas.height / 2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const r = 110 + i * 20;
        const g = 85 + i * 25;
        const b = 210 + i * 8;
        ctx.lineWidth = 0.7 + i * 0.15;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.1)`;
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.012;
      updateWaveData();
      draw();
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ==================== كرت العضو ====================
function MemberFanCard({ item, active }: { item: TeamCardItem; active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl card-border">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', 
            backgroundSize: '14px 14px' 
          }} 
        />
      </div>

      {/* Top Gradient Bar */}
      <div className={cn(
        "h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-40"
      )} />

      <div className="flex h-full">
        {/* Left: Image */}
        <div className="w-[45%] relative flex-shrink-0">
          <div className="absolute inset-2 rounded-xl overflow-hidden gradient-border inner-glow">
            <img
              src={item.image}
              alt={item.nameAr}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          
          {/* Status Badge */}
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

        {/* Right: Info */}
        <div className="flex-1 flex flex-col justify-center p-4 pr-5">
          <div className="mb-3">
            <span className="inline-block px-2.5 py-0.5 glass text-purple-300 rounded-full text-[10px] font-medium border border-purple-400/20 mb-2">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-white mb-0.5">
              {item.nameAr}
            </h3>
            <p className="text-purple-400/70 text-xs font-medium">
              {item.roleAr}
            </p>
          </div>

          <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 mb-3">
            {item.bio}
          </p>

          {/* Quick Links */}
          <div className={cn(
            "flex items-center gap-1.5 transition-all duration-500",
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          )}>
            {item.linkedin && (
              <a href={item.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg glass text-blue-400 hover:text-blue-300 border border-blue-400/20 transition-all">
                <Globe size={12} />
              </a>
            )}
            {item.github && (
              <a href={item.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg glass text-gray-400 hover:text-white border border-white/10 transition-all">
                <Code2 size={12} />
              </a>
            )}
            {item.cv && (
              <a href={item.cv} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg glass text-purple-400 hover:text-purple-300 border border-purple-400/20 transition-all">
                <FileText size={12} />
              </a>
            )}
            {item.email && (
              <a href={`mailto:${item.email}`} onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg glass text-green-400 hover:text-green-300 border border-green-400/20 transition-all">
                <Mail size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

// ==================== Card Stack الرئيسي ====================
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // تعديل الأحجام للجوال
  const actualCardWidth = isMobile ? Math.min(340, window.innerWidth - 32) : cardWidth;
  const actualCardHeight = isMobile ? 380 : cardHeight;

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(8, Math.round(actualCardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

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

  // Autoplay
  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(800, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  return (
    <section className="relative w-full bg-black py-16 md:py-24 overflow-hidden" dir="rtl">
      {/* Wave Background */}
      <WaveBackground />

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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400"> الخبراء</span>
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
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-40 w-[70%] rounded-full bg-purple-500/5 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-36 w-[76%] rounded-full bg-purple-500/5 blur-3xl" aria-hidden="true" />

            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{ perspective: `${perspectivePx}px` }}
            >
              <AnimatePresence initial={false}>
                {items.map((item, i) => {
                  const off = signedOffset(i, active, len, loop);
                  const abs = Math.abs(off);
                  const visible = abs <= maxOffset;
                  if (!visible) return null;

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
                        "will-change-transform select-none",
                        isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                      )}
                      style={{
                        width: actualCardWidth,
                        height: actualCardHeight,
                        zIndex,
                        transformStyle: "preserve-3d",
                      }}
                      initial={reduceMotion ? false : { opacity: 0, y: y + 30, x, rotateZ, rotateX, scale }}
                      animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale }}
                      transition={{ type: "spring", stiffness: springStiffness, damping: springDamping }}
                      onClick={() => setActive(i)}
                      {...dragProps}
                    >
                      <div
                        className="h-full w-full"
                        style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
                      >
                        <MemberFanCard item={item} active={isActive} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prev}
              className="p-2.5 rounded-full glass text-white border border-white/10 hover:border-purple-400/40 hover:text-purple-300 transition-all"
              disabled={!canGoPrev}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            {showDots && (
              <div className="flex items-center gap-2">
                {items.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setActive(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      idx === active
                        ? "w-8 bg-purple-500 shadow-lg shadow-purple-500/30"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    )}
                    aria-label={`${it.nameAr}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={next}
              className="p-2.5 rounded-full glass text-white border border-white/10 hover:border-purple-400/40 hover:text-purple-300 transition-all rotate-180"
              disabled={!canGoNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== المكون النهائي مع البيانات ====================
export function TeamSection() {
  const teamItems: TeamCardItem[] = [
    {
      id: 1,
      nameAr: "أحمد الرشيد",
      roleAr: "المدير التنفيذي والمؤسس",
      bio: "خبرة تزيد عن ١٥ عاماً في الأسواق المالية والاستثمارات الرقمية. أسس OnRequest لتكون رائدة في مجال الاستثمارات الرقمية الذكية.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "ahmed@onrequest.com",
      location: "الرياض، السعودية",
      experience: "١٥+ سنة",
      specialties: ["الاستثمار", "التخطيط المالي", "الذكاء الاصطناعي"],
      category: "القيادة",
    },
    {
      id: 2,
      nameAr: "سارة القحطاني",
      roleAr: "المدير التقني",
      bio: "مهندسة برمجيات بخبرة ١٢ عاماً في تطوير المنصات المالية. متخصصة في تقنيات البلوكتشين والأمن السيبراني.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=500&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "sara@onrequest.com",
      location: "دبي، الإمارات",
      experience: "١٢+ سنة",
      specialties: ["بلوكتشين", "الأمن السيبراني", "هندسة البرمجيات"],
      category: "التقنية",
    },
    {
      id: 3,
      nameAr: "محمد العتيبي",
      roleAr: "رئيس الذكاء الاصطناعي",
      bio: "دكتوراه في تعلم الآلة من جامعة ستانفورد. طور نماذج ذكاء اصطناعي للتنبؤ بالأسواق المالية بدقة ٩٤٪.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      cv: "https://example.com/cv",
      email: "mohammed@onrequest.com",
      location: "لندن، المملكة المتحدة",
      experience: "١٠+ سنة",
      specialties: ["تعلم الآلة", "تحليل البيانات", "الخوارزميات"],
      category: "التقنية",
    },
    {
      id: 4,
      nameAr: "نورة الشمري",
      roleAr: "رئيسة تجربة المستخدم",
      bio: "مصممة رائدة في تجربة المستخدم للتطبيقات المالية. صممت واجهات حازت على جوائز عالمية في التصميم.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=500&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "nora@onrequest.com",
      location: "عمّان، الأردن",
      experience: "٨+ سنة",
      specialties: ["تصميم الواجهات", "تجربة المستخدم", "التطبيقات المالية"],
      category: "التصميم",
    },
    {
      id: 5,
      nameAr: "خالد المنصور",
      roleAr: "استراتيجي استثماري",
      bio: "محلل مالي معتمد (CFA) بخبرة ١٨ عاماً. يدير محافظ استثمارية تتجاوز قيمتها ٥٠٠ مليون دولار.",
      image: "img/services/img1.png",
      linkedin: "https://linkedin.com",
      email: "khalid@onrequest.com",
      location: "نيويورك، الولايات المتحدة",
      experience: "١٨+ سنة",
      specialties: ["تحليل مالي", "إدارة المخاطر", "تنويع المحافظ"],
      category: "الاستثمار",
    },
    {
      id: 6,
      nameAr: "ليلى الحربي",
      roleAr: "مديرة الأمن السيبراني",
      bio: "خبيرة أمن معلومات مع ١٤ عاماً من الخبرة. حاصلة على CISSP و CEH. أشرفت على تأمين ١٠٠+ منصة مالية.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=500&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      cv: "https://example.com/cv",
      email: "layla@onrequest.com",
      location: "الرياض، السعودية",
      experience: "١٤+ سنة",
      specialties: ["أمن المعلومات", "اختبار الاختراق", "حماية البيانات"],
      category: "الأمن",
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