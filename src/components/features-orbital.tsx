// components/ui/features-orbital.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Users, 
  Globe, 
  Lock, 
  BarChart3, 
  HeadphonesIcon,
  Star,
  Sparkles,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface Feature {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "core" | "advanced" | "premium";
  energy: number;
  color: string;
  bgColor: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    title: "أمان متقدم",
    subtitle: "حماية فائقة",
    content: "نستخدم أحدث تقنيات التشفير والأمان لحماية استثماراتك وبياناتك المالية على مدار الساعة.",
    icon: Shield,
    relatedIds: [2, 6],
    status: "core",
    energy: 95,
    color: "from-purple-500 to-purple-700",
    bgColor: "rgba(168, 85, 247, 0.08)",
  },
  {
    id: 2,
    title: "عوائد تنافسية",
    subtitle: "أرباح مستدامة",
    content: "نوفر فرص استثمارية مدروسة بعناية لتحقيق أعلى عوائد ممكنة مع إدارة متوازنة للمخاطر.",
    icon: TrendingUp,
    relatedIds: [1, 3, 7],
    status: "core",
    energy: 90,
    color: "from-green-500 to-emerald-700",
    bgColor: "rgba(34, 197, 94, 0.08)",
  },
  {
    id: 3,
    title: "تقنية متطورة",
    subtitle: "ذكاء اصطناعي",
    content: "نعتمد على أحدث تقنيات الذكاء الاصطناعي وتحليل البيانات لاتخاذ قرارات استثمارية ذكية.",
    icon: Zap,
    relatedIds: [2, 4, 8],
    status: "core",
    energy: 88,
    color: "from-blue-500 to-cyan-700",
    bgColor: "rgba(59, 130, 246, 0.08)",
  },
  {
    id: 4,
    title: "فريق احترافي",
    subtitle: "خبراء متخصصون",
    content: "فريقنا يتكون من نخبة من الخبراء الماليين والتقنيين ذوي الخبرة الواسعة في الأسواق العالمية.",
    icon: Users,
    relatedIds: [3, 5],
    status: "core",
    energy: 92,
    color: "from-orange-500 to-red-700",
    bgColor: "rgba(249, 115, 22, 0.08)",
  },
  {
    id: 5,
    title: "انتشار عالمي",
    subtitle: "أسواق متنوعة",
    content: "نستثمر في أسواق مالية متعددة حول العالم لتوفير تنوع استثماري حقيقي وتقليل المخاطر.",
    icon: Globe,
    relatedIds: [4, 6],
    status: "advanced",
    energy: 75,
    color: "from-indigo-500 to-purple-700",
    bgColor: "rgba(99, 102, 241, 0.08)",
  },
  {
    id: 6,
    title: "خصوصية تامة",
    subtitle: "سرية مطلقة",
    content: "نلتزم بأعلى معايير الخصوصية والسرية في التعامل مع بيانات عملائنا ومعلوماتهم المالية.",
    icon: Lock,
    relatedIds: [1, 5, 7],
    status: "advanced",
    energy: 85,
    color: "from-pink-500 to-rose-700",
    bgColor: "rgba(236, 72, 153, 0.08)",
  },
  {
    id: 7,
    title: "تحليلات فورية",
    subtitle: "بيانات لحظية",
    content: "نوفر لوحات تحكم تفاعلية وتقارير فورية لمتابعة أداء استثماراتك في أي وقت ومن أي مكان.",
    icon: BarChart3,
    relatedIds: [2, 6, 8],
    status: "advanced",
    energy: 82,
    color: "from-teal-500 to-green-700",
    bgColor: "rgba(20, 184, 166, 0.08)",
  },
  {
    id: 8,
    title: "دعم مستمر",
    subtitle: "خدمة 24/7",
    content: "فريق دعم متخصص متاح على مدار الساعة للإجابة عن استفساراتك وتقديم المساعدة الفورية.",
    icon: HeadphonesIcon,
    relatedIds: [3, 7],
    status: "premium",
    energy: 70,
    color: "from-yellow-500 to-amber-700",
    bgColor: "rgba(234, 179, 8, 0.08)",
  },
];

export function FeaturesOrbital() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(270); // يبدأ من الأعلى
  const [targetAngle, setTargetAngle] = useState<number>(270);
  const [isMobile, setIsMobile] = useState(false);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const animationRef = useRef<number>();
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();
  const manualModeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const totalNodes = FEATURES.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ حساب الزاوية لجعل العنصر في الأعلى (أقصر مسافة)
  const getTargetAngleForIndex = useCallback((index: number, currentAngle: number) => {
    const nodeAngle = (index / totalNodes) * 360;
    let desiredAngle = 270 - nodeAngle;
    desiredAngle = ((desiredAngle % 360) + 360) % 360;
    
    // ✅ إيجاد أقصر مسافة للدوران
    let diff = desiredAngle - currentAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    return currentAngle + diff;
  }, [totalNodes]);

  // ✅ التقليب التلقائي كل 4 ثواني مع دوران سلس
  useEffect(() => {
    if (isManualMode) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalNodes;
        setTargetAngle((currentAngle) => getTargetAngleForIndex(next, currentAngle));
        return next;
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isManualMode, totalNodes, getTargetAngleForIndex]);

  // ✅ أنيميشن دوران فائق السلاسة باستخدام lerp مع easing
  useEffect(() => {
    const animate = () => {
      setRotationAngle((prev) => {
        let diff = targetAngle - prev;
        
        // تطبيع المسافة
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        // ✅ easing محسّن: يبدأ سريعاً ثم يتباطأ بسلاسة
        const speed = Math.abs(diff) > 10 ? 0.12 : 0.06;
        const step = diff * speed;
        
        // ✅ عتبة دقيقة للتوقف بدون اهتزاز
        if (Math.abs(diff) < 0.01) {
          return targetAngle;
        }
        
        return prev + step;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetAngle]);

  // ✅ التنقل اليدوي مع عودة تلقائية بعد 8 ثواني
  const goToFeature = useCallback((index: number) => {
    setIsManualMode(true);
    setActiveIndex(index);
    setTargetAngle((currentAngle) => getTargetAngleForIndex(index, currentAngle));
    
    // ✅ العودة للتقليب التلقائي بعد 8 ثواني من آخر تفاعل
    if (manualModeTimerRef.current) clearTimeout(manualModeTimerRef.current);
    manualModeTimerRef.current = setTimeout(() => {
      setIsManualMode(false);
    }, 8000);
  }, [getTargetAngleForIndex]);

  const calculateNodePosition = (index: number) => {
    const angle = ((index / totalNodes) * 360 + rotationAngle) % 360;
    const radius = isMobile ? 130 : 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getStatusColor = (status: Feature["status"]) => {
    switch (status) {
      case "core": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "advanced": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "premium": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }
  };

  const getStatusLabel = (status: Feature["status"]) => {
    switch (status) {
      case "core": return "أساسي";
      case "advanced": return "متقدم";
      case "premium": return "مميز";
    }
  };

  const activeFeature = FEATURES[activeIndex];
  if (!activeFeature) return null;

  return (
    <section className="w-full bg-black py-16 md:py-24 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">
              لماذا OnRequest؟
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4">
            ما
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200"> يميزنا</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            اكتشف المميزات التي تجعلنا الخيار الأمثل لاستثماراتك الرقمية
          </p>
        </motion.div>

        {/* Main Content - ارتفاع ثابت */}
        <div className="relative">
          <div className={cn(
            "flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-8 xl:gap-16",
            isMobile ? "min-h-[750px]" : "lg:min-h-[650px] xl:min-h-[700px]"
          )}>
            {/* Orbital Container */}
            <div className={cn(
              "relative flex items-center justify-center flex-shrink-0",
              "w-full h-[380px] md:h-[500px]",
              "lg:w-[50%] lg:h-[550px] xl:h-[600px]",
            )}>
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Center Core */}
                <motion.div 
                  className="absolute z-20 flex flex-col items-center justify-center"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-20 h-20 md:w-28 md:h-28 rounded-full bg-purple-500/20 blur-xl" />
                    <div className="absolute inset-0 w-28 h-28 md:w-36 md:h-36 rounded-full border border-purple-500/20 animate-ping opacity-70" />
                    
                    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                      
                    </div>
                  </div>
                  <span className="mt-3 text-white font-bold text-xs md:text-base tracking-wider">
                    OnRequest
                  </span>
                </motion.div>

                {/* Orbit Rings */}
                <div className="absolute w-64 h-64 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full border border-purple-500/10" />
                <div className="absolute w-[360px] h-[360px] md:w-[520px] md:h-[520px] lg:w-[580px] lg:h-[580px] rounded-full border border-purple-500/5" />

                {/* Feature Nodes */}
                {FEATURES.map((feature, index) => {
                  const position = calculateNodePosition(index);
                  const isActive = activeIndex === index;
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.id}
                      className="absolute transition-all duration-500 ease-out"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        zIndex: isActive ? 200 : position.zIndex,
                        opacity: isActive ? 1 : position.opacity,
                      }}
                    >
                      <motion.button
                        onClick={() => goToFeature(index)}
                        className={cn(
                          "w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                          isActive
                            ? "bg-white text-purple-600 border-white shadow-2xl shadow-purple-500/50 scale-125"
                            : "bg-gray-900 text-gray-400 border-gray-700 hover:border-purple-500/50 hover:text-white"
                        )}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={isMobile ? 16 : 20} strokeWidth={2} />
                      </motion.button>

                      <div
                        className={cn(
                          "absolute top-12 md:top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs md:text-sm font-semibold transition-all duration-500",
                          isActive ? "text-white scale-110" : "text-gray-600"
                        )}
                      >
                        {feature.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card - دائماً مرئي */}
            <div className={cn(
              "w-full lg:flex-1 lg:max-w-[450px] xl:max-w-[500px]",
              isMobile ? "mt-4" : "lg:pt-8"
            )}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative overflow-hidden rounded-3xl border border-gray-800/50"
                  style={{
                    background: `linear-gradient(135deg, ${activeFeature.bgColor} 0%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.98) 100%)`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* أيقونة شفافة */}
                  <div 
                    className="absolute -left-6 -top-6 md:-left-10 md:-top-10 select-none pointer-events-none"
                    style={{ opacity: 0.04 }}
                  >
                    <activeFeature.icon 
                      size={isMobile ? 140 : 220} 
                      strokeWidth={1.5}
                      className="text-white"
                    />
                  </div>

                  {/* تأثير إضاءة */}
                  <div 
                    className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                    style={{ 
                      background: `radial-gradient(circle, ${activeFeature.bgColor.replace('0.08', '0.12')} 0%, transparent 70%)` 
                    }}
                  />

                  <div className="relative p-6 md:p-8 lg:p-10">
                    <div className="flex items-start gap-3 md:gap-4 mb-5">
                      <div className={cn(
                        "w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0",
                        activeFeature.color
                      )}>
                        <activeFeature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            getStatusColor(activeFeature.status)
                          )}>
                            {getStatusLabel(activeFeature.status)}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                          {activeFeature.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                      {activeFeature.content}
                    </p>

                    <div className="mb-6">
                      <div className="flex justify-between items-center text-xs md:text-sm mb-2">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Zap size={13} className="text-purple-400" />
                          مستوى التميز
                        </span>
                        <span className="text-white font-mono font-bold text-sm">
                          {activeFeature.energy}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          className={cn("h-full rounded-full bg-gradient-to-r", activeFeature.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${activeFeature.energy}%` }}
                          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                    </div>

                    {activeFeature.relatedIds.length > 0 && (
                      <div className="pt-5 border-t border-gray-800/50">
                        <h4 className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                          <Award size={13} className="text-purple-400" />
                          مميزات مرتبطة
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeFeature.relatedIds.map((relatedId) => {
                            const relatedFeature = FEATURES.find(f => f.id === relatedId);
                            if (!relatedFeature) return null;
                            const relatedIndex = FEATURES.findIndex(f => f.id === relatedId);
                            const RelatedIcon = relatedFeature.icon;
                            return (
                              <button
                                key={relatedId}
                                onClick={() => goToFeature(relatedIndex)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border",
                                  activeIndex === relatedIndex
                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                    : "bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600 hover:text-gray-200"
                                )}
                              >
                                <RelatedIcon size={13} />
                                <span className="hidden sm:inline">{relatedFeature.title}</span>
                                <span className="sm:hidden">{relatedFeature.subtitle}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* مؤشرات التقدم */}
        <div className="flex justify-center gap-2 mt-8">
          {FEATURES.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => goToFeature(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === activeIndex
                  ? "w-8 bg-purple-500 shadow-lg shadow-purple-500/30"
                  : "w-2 bg-gray-700 hover:bg-gray-600 hover:w-3"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesOrbital;