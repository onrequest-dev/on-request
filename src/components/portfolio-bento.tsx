// components/ui/portfolio-bento.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Tag,
  ArrowLeft,
  ZoomIn,
  Maximize2
} from "lucide-react";

interface ProjectImage {
  src: string;
  alt: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  images: ProjectImage[];
  date: string;
  tags: string[];
  size: "large" | "medium" | "small" | "wide" | "tall";
  gradient: string;
}

const PROJECTS: Project[] = [
  {
    id: "trading-platform",
    title: "منصة التداول الذكي",
    category: "تطبيق موبايل",
    description: "منصة متكاملة للتداول الآلي في الأسواق المالية العالمية باستخدام الذكاء الاصطناعي. تدعم أكثر من ١٠٠ أصل مالي مع تحليلات فورية وتنبيهات ذكية على مدار الساعة.",
    images: [
      { src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200", alt: "لوحة تحكم التداول" },
      { src: "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200", alt: "تحليل الأسواق" },
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", alt: "تقارير الأداء" },
    ],
    date: "٢٠٢٤",
    tags: ["تداول", "ذكاء اصطناعي", "أسواق مالية"],
    size: "large",
    gradient: "from-purple-600 via-purple-500 to-blue-600",
  },
  {
    id: "wallet-app",
    title: "محفظة رقمية آمنة",
    category: "تطبيق موبايل",
    description: "محفظة رقمية مشفرة لإدارة الأصول الرقمية مع أعلى معايير الأمان. تدعم العملات الرقمية والعملات التقليدية مع حماية متعددة الطبقات.",
    images: [
      { src: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200", alt: "واجهة المحفظة" },
      { src: "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200", alt: "تحويلات مالية" },
    ],
    date: "٢٠٢٤",
    tags: ["محفظة رقمية", "أمان", "عملات رقمية"],
    size: "tall",
    gradient: "from-pink-600 to-purple-600",
  },
  {
    id: "analytics-dashboard",
    title: "لوحة تحليلات استثمارية",
    category: "موقع ويب",
    description: "لوحة تحكم احترافية لعرض وتحليل أداء المحافظ الاستثمارية مع رسوم بيانية تفاعلية وتقارير قابلة للتصدير بتنسيقات متعددة.",
    images: [
      { src: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200", alt: "لوحة التحليلات" },
      { src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200", alt: "الرسوم البيانية" },
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", alt: "تقارير مفصلة" },
    ],
    date: "٢٠٢٣",
    tags: ["تحليلات", "لوحة تحكم", "تقارير"],
    size: "wide",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    id: "iot-system",
    title: "نظام إنترنت الأشياء",
    category: "إنترنت الأشياء",
    description: "نظام متكامل لربط الأجهزة الذكية بمنصات الاستثمار لجمع وتحليل البيانات في الوقت الفعلي مع لوحة تحكم مركزية.",
    images: [
      { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200", alt: "أجهزة ذكية" },
      { src: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1200", alt: "لوحة إلكترونية" },
    ],
    date: "٢٠٢٣",
    tags: ["إنترنت الأشياء", "أجهزة ذكية", "بيانات"],
    size: "small",
    gradient: "from-green-600 to-emerald-600",
  },
  {
    id: "security-system",
    title: "نظام أمن سيبراني",
    category: "أمن المعلومات",
    description: "نظام حماية متطور للمعاملات المالية والبيانات الاستثمارية باستخدام أحدث تقنيات التشفير والمراقبة المستمرة.",
    images: [
      { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200", alt: "مركز أمني" },
      { src: "https://images.unsplash.com/photo-1563986768609-322da13575f2?q=80&w=1200", alt: "تشفير البيانات" },
    ],
    date: "٢٠٢٤",
    tags: ["أمن سيبراني", "تشفير", "حماية"],
    size: "small",
    gradient: "from-red-600 to-orange-600",
  },
  {
    id: "cloud-platform",
    title: "منصة سحابية",
    category: "حوسبة سحابية",
    description: "بنية تحتية سحابية متكاملة لتشغيل التطبيقات الاستثمارية على نطاق واسع مع قابلية توسع غير محدودة وأداء عالي.",
    images: [
      { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200", alt: "خوادم سحابية" },
      { src: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200", alt: "مركز بيانات" },
      { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200", alt: "بنية تحتية" },
    ],
    date: "٢٠٢٤",
    tags: ["سحابة", "توسع", "خوادم"],
    size: "medium",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    id: "ai-advisor",
    title: "مستشار استثماري ذكي",
    category: "ذكاء اصطناعي",
    description: "مساعد استثماري يعمل بالذكاء الاصطناعي يقدم توصيات مخصصة بناءً على تحليل شامل للأسواق وملف المخاطر الشخصي.",
    images: [
      { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200", alt: "واجهة المستشار" },
      { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200", alt: "تحليل ذكي" },
    ],
    date: "٢٠٢٤",
    tags: ["ذكاء اصطناعي", "استشارات", "تحليل"],
    size: "wide",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
  },
];

export function PortfolioBento() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setIsFullscreen(false);
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setIsFullscreen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => 
      prev === selectedProject.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-black py-20 md:py-32" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm">
            <Maximize2 className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200 tracking-wide">
              معرض الأعمال
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight">
            مشاريع
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200"> مميزة</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            مجموعة من أبرز المشاريع التقنية التي طورناها لعملائنا في مجال الاستثمارات الرقمية والأسواق المالية
          </p>
        </motion.div>

        {/* Bento Grid - Optimized for Large Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className={cn(
                "relative group cursor-pointer overflow-hidden rounded-3xl border border-gray-800/50 hover:border-purple-500/40 transition-all duration-700",
                // Large screens
                project.size === "large" && "md:col-span-2 md:row-span-2",
                project.size === "wide" && "lg:col-span-2",
                project.size === "tall" && "lg:row-span-2",
                project.size === "medium" && "xl:row-span-2",
                // Mobile fallback
                "col-span-1 row-span-1"
              )}
              onClick={() => openProject(project)}
            >
              {/* Background Image with Parallax */}
              <motion.img
                src={project.images[0].src}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-700",
                project.gradient
              )} />

              {/* Top Color Bar */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700",
                project.gradient
              )} />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 md:p-8 xl:p-10">
                <motion.div 
                  className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700"
                >
                  {/* Category Badge */}
                  <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                      {project.category}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                      {project.images.length} صور
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-500">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-2 group-hover:translate-y-0 max-w-lg">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-sm text-gray-300 text-xs border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Bottom Gradient Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal - Full Screen on Large Screens */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={closeProject}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative bg-gray-900/80 backdrop-blur-2xl border border-gray-800/50 shadow-2xl overflow-hidden",
                // Responsive sizing
                "w-full h-full md:h-auto md:max-h-[90vh] md:rounded-3xl md:w-[95%] lg:w-[90%] xl:w-[85%] max-w-7xl",
                isFullscreen && "!w-full !h-full !max-w-none !max-h-none !rounded-none"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeProject}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm hidden sm:inline">رجوع للمعرض</span>
                  </button>
                  
                  {/* Thumbnail Navigation */}
                  <div className="hidden md:flex items-center gap-2 ml-6">
                    {selectedProject.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "w-12 h-8 rounded-lg overflow-hidden border-2 transition-all duration-300",
                          idx === currentImageIndex
                            ? "border-purple-500 shadow-lg shadow-purple-500/30"
                            : "border-white/20 opacity-50 hover:opacity-80"
                        )}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm hidden sm:block">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </span>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Image Viewer */}
              <div className={cn(
                "relative bg-black flex items-center justify-center",
                isFullscreen ? "h-screen" : "aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/6]"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-full h-full"
                  >
                    <img
                      src={selectedProject.images[currentImageIndex].src}
                      alt={selectedProject.images[currentImageIndex].alt}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={nextImage}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-purple-500/30 transition-all duration-300 border border-white/20 group"
                    >
                      <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={prevImage}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-purple-500/30 transition-all duration-300 border border-white/20 group"
                    >
                      <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                  {currentImageIndex + 1} / {selectedProject.images.length}
                </div>
              </div>

              {/* Project Details Panel */}
              <div className={cn(
                "p-6 md:p-8 lg:p-10",
                isFullscreen && "hidden"
              )}>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                        {selectedProject.category}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        {selectedProject.date}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                      {selectedProject.title}
                    </h3>

                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Tags & Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">التقنيات المستخدمة</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:border-purple-500/50 transition-colors"
                          >
                            <Tag className="h-3 w-3 text-purple-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Thumbnails */}
                    <div className="md:hidden">
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">الصور</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProject.images.map((image, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                              "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300",
                              idx === currentImageIndex
                                ? "border-purple-500 shadow-lg shadow-purple-500/25"
                                : "border-transparent opacity-50 hover:opacity-75"
                            )}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default PortfolioBento;