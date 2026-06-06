// components/ui/faq-accordion.tsx
"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, Variants, Easing, AnimatePresence, Transition } from "framer-motion";
import { ChevronDown, HelpCircle, Zap } from "lucide-react";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// FAQ Data (same as before)
const faqs = [
  {
    question: "لماذا تعتبر OnRequest أفضل شركة برمجة في سوريا لتنفيذ مشروعي؟",
    answer:
      "لأننا لا نكتفي بكتابة الكود. نحن شريك تقني نفهم مجالك قبل أن نبدأ، نتفق معك على كل التفاصيل والمخرجات قبل أول سطر برمجة، ونقدم لك دعماً فنياً مجانياً دائماً بعد الإطلاق. نملك خبرة 12 مشروعاً منطلقاً في السوق السوري، ونعمل بثلاثة نماذج مرنة تناسبك: بناء، استشارة، أو شراكة تنفيذية.",
  },
  {
    question: "ما هي خدمات شركة برمجة مواقع وتطبيقات التي تقدمونها؟",
    answer:
      "نقدم حزمة متكاملة تشمل: استراتيجية إطلاق المنتج، تصميم UI/UX، تطوير تطبيقات موبايل وويب وسطح مكتب، هندسة قواعد البيانات، الأمن السيبراني، تحليل البيانات، أتمتة العمليات، واستشارات تقنية عليا. كل ذلك بنماذج عمل مرنة تناسب احتياجك: بناء، استشارة، أو شراكة تنفيذية.",
  },
  {
    question: "كم تكلفة تطبيق موبايل في سوريا لدى OnRequest؟",
    answer:
      "التكلفة تختلف حسب حجم التطبيق، تعقيد المميزات، والمنصة المستهدفة. لكن نعدك بشيء واحد: أسعارنا في OnRequest تنافسية جداً وتناسب كافة المشاريع، سواء كنت شركة كبيرة أو مشروعاً ناشئاً. تواصل معنا وشاركنا فكرتك، نرسل لك عرضاً تفصيلياً شفافاً دون رسوم خفية.",
  },
  {
    question: "ما هي أسعار برمجة تطبيقات في دمشق تحديداً؟",
    answer:
      "كما هو الحال في أي مكان، أسعار برمجة التطبيقات في دمشق تعتمد على حجم المشروع وعدد مميزاته والمنصات المستهدفة. ما يميز OnRequest أننا نقدم لك جودة تنافس أفضل شركات البرمجة في دمشق، بأسعار مدروسة ومناسبة لجميع أنواع المشاريع. أرسل لنا فكرتك، وسنعطيك عرضاً تقديرياً شفافاً يوضح كل شيء بالتفصيل.",
  },
  {
    question: "كم يستغرق وقت برمجة تطبيق موبايل أو موقع ويب عندكم؟",
    answer:
      "الوقت يعتمد على حجم المشروع وتعقيده. في OnRequest، يبدأ تسليم التطبيقات الصغيرة والمتوسطة من 3 أسابيع فقط، وقد يصل إلى 6 أشهر للمشاريع الكبيرة والمعقدة. نحن نعمل بمنهجية مضغوطة دون إضاعة الوقت، لكن دون المساس بجودة المنتج النهائي. قبل أن نبدأ، تتفق معنا على المدة الزمنية بالضبط ونلتزم بها.",
  },
  {
    question: "ماذا يعني 'شريك تقني' وما الفرق بينه وبين شركة البرمجة العادية؟",
    answer:
      "شركة البرمجة العادية تنفذ ما يُطلب منها وتسلم الكود وتنتهي العلاقة. أما الشريك التقني كما نفعل في OnRequest، فيدخل معك في عمق المشكلة قبل أن يكتب أول سطر كود. ندرس قطاعك، نقترح حلولاً مبتكرة، نتفق معك على المخرجات والمدة بالضبط، ونسلمك منتجاً جاهزاً للمنافسة في السوق. بعد الإطلاق، نبقى معك بدعم فني دائم ومجاني. نحن لا نكتفي بالتنفيذ، بل نكمل معك الرحلة.",
  },
  {
    question: "هل أحصل على كود التطبيق بعد البرمجة؟ ومن يملك الحقوق؟",
    answer:
      "هذا الأمر يعتمد على الاتفاق المبرم بيننا. في OnRequest، نمنحك خيارين: إما أن تمتلك كود التطبيق بالكامل وتصبح الحقوق لك، وإما أن تحصل على ترخيص استخدام مع احتفاظنا بالكود. يختلف السعر بين الخيارين، ونتفق على ذلك بوضوح قبل بدء المشروع.",
  },
  {
    question: "هل تقدمون دعم فني مجاني مدى الحياة فعلاً؟ وماذا يشمل؟",
    answer:
      "نعم، هذا حقيقي وليس شعاراً تسويقياً. في OnRequest، نقدم دعماً فنياً مجانياً دائماً بعد إطلاق منتجك، يشمل حل جميع المشاكل التقنية التي قد تظهر لاحقاً، وإصلاح أي خلل ناتج عن البرمجة التي قمنا بها. نحن مسؤولون عن كل شيء اتفقنا عليه وبنيناه، ولا نتركك وحدك بعد التسليم.",
  },
  {
    question:
      "هل تقدمون خدمة تصميم مواقع في سوريا وتطوير مواقع تجارة إلكترونية؟",
    answer:
      "نعم، تصميم وتطوير المواقع والمتاجر الإلكترونية من صميم خدماتنا في OnRequest. نبني مواقع شركات احترافية، منصات ويب تفاعلية، ومتاجر إلكترونية متكاملة مع بوابات دفع محلية. نملك خبرة واسعة في هذا القطاع، وكل مشروع يُبنى حسب طلبك بالضبط.",
  },
  {
    question: "ماذا عن الأمن السيبراني للتطبيقات؟ كيف تحمون بيانات المستخدمين؟",
    answer:
      "الأمن السيبراني ليس خدمة إضافية عندنا، بل جزء أساسي من بناء أي تطبيق أو موقع. في OnRequest، نحمي بيانات المستخدمين باتباع أفضل ممارسات الأمان: تشفير البيانات، حماية ضد اختراقات الويب الشائعة، وتأمين قواعد البيانات. لا ننتظر حصول مشكلة لنتحرك، بل نحمي منتجك بشكل استباقي منذ أول سطر كود.",
  },
  {
    question: "هل تقدمون استشارات تقنية للمشاريع الناشئة قبل البدء بالتنفيذ؟",
    answer:
      "نعم، الاستشارات التقنية من أهم خدماتنا في OnRequest، خاصة للمشاريع الناشئة. قبل أن تنفق أي مبلغ على البرمجة، نجلس معك لدراسة فكرتك، تقييم جدواها التقنية، وتحديد أفضل مسار للتنفيذ بأقل تكلفة وأسرع وقت. الاستشارة متاحة كخدمة مستقلة أو كمرحلة أولى قبل بدء التطوير.",
  },
  {
    question:
      "هل لديكم نماذج أعمال مرنة؟ مثل البناء مقابل أجر أو الشراكة التنفيذية؟",
    answer:
      "نعم، وهذه إحدى أهم مميزات OnRequest. نوفر ثلاثة نماذج عمل تناسبك: البناء مقابل أجر، الاستشارات التقنية المتخصصة، والشراكة التنفيذية مع أصحاب الأفكار. إن آمنّا بفكرتك، قد ندخل معك كشريك تقني ونساهم في إطلاق المنتج ونموه في السوق. أنت تختار الطريقة التي تناسبك.",
  },
  {
    question:
      "كيف يمكنني الحصول على استشارة برمجية قبل البدء لدراسة جدوى تقنية لمشروعي؟",
    answer:
      "الأمر بسيط جداً. تواصل معنا عبر وسائل الاتصال في الموقع، واشرح لنا فكرة مشروعك باختصار. سنحدد جلسة استشارية ندرس فيها جدوى فكرتك تقنياً، نحدد التحديات، ونقدم لك تصوراً واضحاً عن التكلفة والمدة الزمنية. كل ذلك دون أي التزام منك بالتنفيذ معنا.",
  },
  {
    question:
      "هل تقدمون خدمات البرمجة في حلب ودمشق وكيف تعملون مع عملاء من خارج هذه المدن؟",
    answer:
      "نعم، نخدم عملاءنا في حلب، دمشق، إدلب، وكافة المحافظات السورية. لا تقيدنا المسافة، فنحن نعمل عن بُعد بكفاءة عالية، ونتواصل معك أينما كنت. إن احتجت لقاءات دورية، نرتبها حسب موقعك.",
  },
];

// Single FAQ Item - Using Framer Motion height animation
const FAQItem = React.memo(({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  // Measure content when open state changes or answer changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      // Small delay to ensure DOM updates
      const timer = setTimeout(() => setContentHeight(undefined), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, faq.answer]);

  // Mobile‑optimized transition
  const heightTransition: Transition = {
    type: "tween",
    duration: 0.25,
    ease: "easeInOut",
  };

  return (
    <div
      className={cn(
        "border-b border-purple-500/20 transition-colors duration-150",
        isOpen
          ? "bg-purple-500/[0.03] rounded-2xl border-b-0"
          : "hover:bg-purple-500/[0.02]"
      )}
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 sm:py-5 flex items-center justify-between gap-3 text-right group touch-manipulation"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "flex-shrink-0 transition-transform duration-200",
              isOpen ? "rotate-90" : "rotate-0"
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-150",
                isOpen ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400"
              )}
            />
          </div>
          <span
            className={cn(
              "text-sm sm:text-base font-medium transition-colors duration-150 text-right leading-relaxed",
              isOpen ? "text-white" : "text-gray-300 group-hover:text-white"
            )}
          >
            {faq.question}
          </span>
        </div>
        <div
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150",
            isOpen
              ? "bg-purple-500/20 text-purple-400"
              : "bg-purple-500/10 text-gray-500 group-hover:text-purple-400"
          )}
        >
          <HelpCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </div>
      </button>

      {/* Smooth height animation with Framer Motion */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen && contentHeight !== undefined ? contentHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={heightTransition}
        className="overflow-hidden"
        style={{ willChange: "height, opacity" }}
      >
        <div
          ref={contentRef}
          className="pb-4 sm:pb-5 pr-6 sm:pr-9 text-gray-400 leading-relaxed border-r border-purple-500/20 mr-2 text-sm sm:text-base"
        >
          {faq.answer}
        </div>
      </motion.div>
    </div>
  );
});

FAQItem.displayName = "FAQItem";

// Main FAQ Component
const FAQAccordion = () => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance tweaks
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = useCallback((index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const openAll = useCallback(() => {
    setOpenIndexes(new Set(faqs.map((_, i) => i)));
  }, []);

  const closeAll = useCallback(() => {
    setOpenIndexes(new Set());
  }, []);

  const allOpen = openIndexes.size === faqs.length;

  // Simplified variants for mobile – smaller movement, faster timing
  const fadeUpVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 15 },
      visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.4,
          ease: "easeOut" as Easing,
        },
      }),
    }),
    [],
  );

  const titleVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" as Easing },
      },
    }),
    [],
  );

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#050508] py-12 sm:py-24"
    >
      {/* Decorative background – lighter on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 sm:-left-48 w-48 sm:w-96 h-48 sm:h-96 bg-purple-600/5 sm:bg-purple-600/10 rounded-full blur-[60px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 sm:-right-48 w-48 sm:w-96 h-48 sm:h-96 bg-purple-800/5 sm:bg-purple-800/10 rounded-full blur-[60px] sm:blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-8 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 sm:mb-6 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "tween", duration: 0.2 }}
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
              <Zap className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-purple-400" />
            </motion.div>
            <span className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-300 uppercase">
              المعرفة المفتوحة
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={titleVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-6 text-white"
            style={{
              fontFamily: "Somar Medium, 'Segoe UI', system-ui, sans-serif",
              textShadow: isMobile ? "none" : "0 0 40px rgba(168, 85, 247, 0.2)",
            }}
          >
            الأسئلة الشائعة
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            custom={1}
            className="text-sm sm:text-xl text-gray-400 max-w-2xl mx-auto px-2"
          >
            كل ما تريد معرفته عن خدماتنا ونماذج العمل والتكاليف في مكان واحد
          </motion.p>
        </motion.div>

        {/* FAQ Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-2 sm:px-6">
            <button
              onClick={allOpen ? closeAll : openAll}
              className="text-[11px] sm:text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 touch-manipulation"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {allOpen ? "إغلاق الكل" : "فتح الكل"}
              <motion.span
                animate={{ rotate: allOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </motion.span>
            </button>
          </div>

          <div className="bg-black/20 sm:bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-500/10 p-2 sm:p-6 shadow-xl sm:shadow-2xl">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndexes.has(index)}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mt-8 sm:mt-16 px-4"
        >
          <p className="text-gray-400 text-xs sm:text-base mb-3 sm:mb-6">
            لم تجد إجابة لسؤالك؟ تواصل معنا مباشرة
          </p>
          <motion.a
            href="https://t.me/OnRequest_dev"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "tween", duration: 0.1 }}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white text-sm sm:text-base font-medium hover:bg-purple-600/30 active:bg-purple-600/40 transition-colors duration-150 touch-manipulation"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            تواصل مع الدعم
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQAccordion;