// components/ui/partners-glow-stack.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { 
  Building2, 
  Globe, 
  Shield, 
  TrendingUp, 
  Cpu,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ArrowUpRight,
  Hexagon
} from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// ==================== CardCanvas - خلفية SVG ====================
const CardCanvas = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq-glow">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"></feColorMatrix>
        </filter>
      </svg>
      {children}
    </div>
  );
};

// ==================== Glow Card ====================
const GlowCard = ({ children, className = "", gradientFrom, gradientTo }: { 
  children: React.ReactNode; 
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Border elements with glow */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom || '#7c3aed'}10, ${gradientTo || '#3b82f6'}10)`,
          filter: 'blur(20px)',
        }}
      />
      
      {/* Top border glow */}
      <div 
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{
          background: `linear-gradient(to right, transparent, ${gradientFrom || '#7c3aed'}60, ${gradientTo || '#3b82f6'}60, transparent)`,
        }}
      />
      
      {/* Bottom border glow */}
      <div 
        className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{
          background: `linear-gradient(to right, transparent, ${gradientTo || '#3b82f6'}60, ${gradientFrom || '#7c3aed'}60, transparent)`,
        }}
      />
      
      {/* Left border glow */}
      <div 
        className="absolute left-0 top-8 bottom-8 w-px opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{
          background: `linear-gradient(to bottom, transparent, ${gradientFrom || '#7c3aed'}40, transparent)`,
        }}
      />
      
      {/* Right border glow */}
      <div 
        className="absolute right-0 top-8 bottom-8 w-px opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{
          background: `linear-gradient(to bottom, transparent, ${gradientTo || '#3b82f6'}40, transparent)`,
        }}
      />

      {/* Corner glows */}
      <div 
        className="absolute top-3 left-3 w-4 h-4 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 blur-sm"
        style={{ backgroundColor: gradientFrom || '#7c3aed' }}
      />
      <div 
        className="absolute top-3 right-3 w-4 h-4 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 blur-sm"
        style={{ backgroundColor: gradientTo || '#3b82f6' }}
      />
      <div 
        className="absolute bottom-3 left-3 w-4 h-4 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 blur-sm"
        style={{ backgroundColor: gradientTo || '#3b82f6' }}
      />
      <div 
        className="absolute bottom-3 right-3 w-4 h-4 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 blur-sm"
        style={{ backgroundColor: gradientFrom || '#7c3aed' }}
      />

      {/* Card Content */}
      <div className="relative rounded-3xl bg-[#0a0a0f] border border-gray-800/30 overflow-hidden backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
};

// ==================== خلفية هندسية ====================
function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    const hexagons: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    
    for (let i = 0; i < 15; i++) {
      hexagons.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 35 + 15,
        speed: Math.random() * 0.25 + 0.08,
        opacity: Math.random() * 0.06 + 0.02,
      });
    }

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawHexagon(x: number, y: number, size: number) {
      if (!ctx) return;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hexagons.forEach(hex => {
        hex.y -= hex.speed;
        if (hex.y < -hex.size * 2) {
          hex.y = canvas.height + hex.size * 2;
          hex.x = Math.random() * canvas.width;
        }
        drawHexagon(hex.x, hex.y, hex.size);
        ctx.strokeStyle = `rgba(139, 92, 246, ${hex.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });
    }

    function animate() {
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

// ==================== بيانات الشركاء ====================
interface Partner {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  typeAr: string;
  description: string;
  location: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ElementType;
}

const PARTNERS: Partner[] = [
  {
    id: "partner-1",
    name: "TechVault Systems",
    nameAr: "أنظمة تك فولت",
    type: "Cloud Infrastructure",
    typeAr: "بنية تحتية سحابية",
    description: "مزود رائد لحلول البنية التحتية السحابية وأمن البيانات للمؤسسات المالية العالمية. ندير أكثر من ٥٠٠ خادم في ١٥ دولة مع ضمان وقت تشغيل 99.99%.",
    location: "وادي السيليكون، الولايات المتحدة",
    gradientFrom: "#7c3aed",
    gradientTo: "#3b82f6",
    icon: Cpu,
  },
  {
    id: "partner-2",
    name: "Global Finance Corp",
    nameAr: "المؤسسة المالية العالمية",
    type: "Financial Services",
    typeAr: "خدمات مالية",
    description: "شريك استراتيجي في الأسواق المالية العالمية مع خبرة تتجاوز ٢٥ عاماً في إدارة الأصول والاستثمارات عبر ٣٠ سوقاً عالمياً.",
    location: "لندن، المملكة المتحدة",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    icon: TrendingUp,
  },
  {
    id: "partner-3",
    name: "CyberShield Pro",
    nameAr: "سايبر شيلد برو",
    type: "Cybersecurity",
    typeAr: "أمن سيبراني",
    description: "شركة رائدة في مجال الأمن السيبراني وحماية المعاملات المالية الرقمية. نوفر حماية متطورة لأكثر من ١٠٠٠ مؤسسة مالية حول العالم على مدار الساعة.",
    location: "تل أبيب، إسرائيل",
    gradientFrom: "#059669",
    gradientTo: "#06b6d4",
    icon: Shield,
  },
  {
    id: "partner-4",
    name: "Alpha Investments",
    nameAr: "ألفا للاستثمارات",
    type: "Investment Management",
    typeAr: "إدارة استثمارية",
    description: "شركة استثمارية عالمية تدير محافظ متنوعة في الأسواق الناشئة والمتقدمة مع تركيز على الاستثمارات المستدامة والمسؤولة.",
    location: "نيويورك، الولايات المتحدة",
    gradientFrom: "#8b5cf6",
    gradientTo: "#ec4899",
    icon: Building2,
  },
  {
    id: "partner-5",
    name: "CloudStack MENA",
    nameAr: "كلاود ستاك الشرق الأوسط",
    type: "Regional Cloud",
    typeAr: "سحابة إقليمية",
    description: "مزود خدمات سحابية إقليمي بمراكز بيانات متطورة في ٧ دول عربية مع زمن استجابة أقل من ١٠ مللي ثانية للشرق الأوسط.",
    location: "دبي، الإمارات العربية المتحدة",
    gradientFrom: "#06b6d4",
    gradientTo: "#7c3aed",
    icon: Globe,
  },
  {
    id: "partner-6",
    name: "Riyadh FinTech Hub",
    nameAr: "مركز الرياض للتقنية المالية",
    type: "Innovation Lab",
    typeAr: "مختبر ابتكار",
    description: "مركز ابتكار رائد في التكنولوجيا المالية بالمملكة. ندعم أكثر من ٢٠٠ شركة ناشئة في مجالات الدفع الرقمي والاستثمار والبلوكتشين.",
    location: "الرياض، المملكة العربية السعودية",
    gradientFrom: "#ef4444",
    gradientTo: "#f59e0b",
    icon: Star,
  },
];

const SWIPE_THRESHOLD = 60;

// ==================== المكون الرئيسي ====================
export function PartnersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();
  const manualTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const totalCards = PARTNERS.length;

  // ✅ تقليب تلقائي كل 4 ثواني
  useEffect(() => {
    if (isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, totalCards]);

  // ✅ إيقاف مؤقت عند التفاعل اليدوي
  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -800) {
      pauseAutoPlay();
      setActiveIndex((prev) => (prev + 1) % totalCards);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 800) {
      pauseAutoPlay();
      setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
    }
    setIsDragging(false);
  };

  const goToCard = (index: number) => {
    pauseAutoPlay();
    setActiveIndex(index);
  };

  const goNext = () => {
    pauseAutoPlay();
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  const goPrev = () => {
    pauseAutoPlay();
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  // ترتيب الكروت للتكديس
  const getStackOrder = () => {
    const reordered = [];
    for (let i = 0; i < totalCards; i++) {
      const index = (activeIndex + i) % totalCards;
      reordered.push({ ...PARTNERS[index], stackPosition: i });
    }
    return reordered.reverse();
  };

  const stackedCards = getStackOrder();
  const activePartner = PARTNERS[activeIndex];

  return (
    <section className="relative w-full bg-black py-16 md:py-24 overflow-hidden" dir="rtl">
      <GeometricBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm text-purple-300 border border-purple-400/20 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">شركاء النجاح</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
            شركاؤنا
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400"> الموثوقون</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            نتعاون مع نخبة من الشركات العالمية لتقديم أفضل الحلول الاستثمارية
          </p>
        </motion.div>

        {/* Cards Stack Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-8 lg:gap-12">
          {/* Stack */}
          <div className="relative w-full max-w-[400px] md:max-w-[450px] h-[450px] md:h-[500px] flex-shrink-0">
            <CardCanvas>
              {stackedCards.map((card, i) => {
                const isTopCard = card.stackPosition === 0;
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      top: card.stackPosition * 10,
                      left: card.stackPosition * 10,
                      zIndex: totalCards - card.stackPosition,
                      rotate: (card.stackPosition - 1) * 1.5,
                    }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    drag={isTopCard ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                    onClick={() => {
                      if (isDragging) return;
                      if (!isTopCard) goToCard(PARTNERS.findIndex(p => p.id === card.id));
                    }}
                    className={cn(
                      "absolute w-full",
                      isTopCard && "cursor-grab active:cursor-grabbing",
                    )}
                  >
                    <GlowCard gradientFrom={card.gradientFrom} gradientTo={card.gradientTo}>
                      <div className="p-6 md:p-8">
                        {/* Top accent line */}
                        <div 
                          className="h-1 rounded-full mb-6"
                          style={{ 
                            background: `linear-gradient(to right, ${card.gradientFrom}, ${card.gradientTo})` 
                          }}
                        />

                        {/* Header */}
                        <div className="flex items-start gap-4 mb-5">
                          {/* Icon */}
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                            style={{ 
                              backgroundColor: `${card.gradientFrom}10`,
                              borderColor: `${card.gradientFrom}30`,
                            }}
                          >
                            <Icon size={26} strokeWidth={1.5} style={{ color: card.gradientFrom }} />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                              {card.nameAr}
                            </h3>
                            <p className="text-gray-500 text-xs font-mono">
                              {card.name}
                            </p>
                          </div>
                        </div>

                        {/* Type + Location */}
                        <div className="flex items-center gap-3 mb-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium border"
                            style={{ 
                              backgroundColor: `${card.gradientFrom}10`,
                              borderColor: `${card.gradientFrom}25`,
                              color: card.gradientFrom,
                            }}
                          >
                            {card.typeAr}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <MapPin size={11} />
                            {card.location}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                          {card.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/30">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: card.gradientFrom }} />
                              <div className="w-3 h-1.5 rounded-full opacity-60" style={{ backgroundColor: card.gradientTo }} />
                              <div className="w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: card.gradientTo }} />
                            </div>
                            <span className="text-gray-600 text-xs">شريك معتمد</span>
                          </div>
                          <ArrowUpRight size={15} className="text-gray-600" />
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </CardCanvas>
          </div>

          {/* Info Panel - Desktop */}
          <div className="hidden lg:flex flex-col justify-center flex-1 max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePartner.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Hexagon className="w-8 h-8 text-purple-500/30" strokeWidth={1} />
                  <span className="text-gray-500 text-sm uppercase tracking-wider">
                    {activePartner.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {activePartner.nameAr}
                  </h3>
                  <p className="text-gray-500 font-mono text-sm">
                    {activePartner.name}
                  </p>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  {activePartner.description}
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>{activePartner.location}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={goPrev}
            className="p-3 rounded-full bg-white/[0.03] border border-white/10 text-white hover:border-purple-400/40 hover:text-purple-300 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {PARTNERS.map((partner, index) => (
              <button
                key={partner.id}
                onClick={() => goToCard(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  index === activeIndex
                    ? "w-10 shadow-lg"
                    : "w-2 bg-gray-700 hover:bg-gray-600",
                )}
                style={{
                  backgroundColor: index === activeIndex ? partner.gradientFrom : undefined,
                  boxShadow: index === activeIndex ? `0 0 12px ${partner.gradientFrom}60` : undefined,
                }}
                aria-label={`الشريك ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="p-3 rounded-full bg-white/[0.03] border border-white/10 text-white hover:border-purple-400/40 hover:text-purple-300 transition-all duration-300 rotate-180"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">
            {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;