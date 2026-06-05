// components/ui/faq-accordion.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants, Easing } from "framer-motion";
import { ChevronDown, HelpCircle, Zap } from "lucide-react";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// FAQ Data based on your questions
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

// Single FAQ Item Component
const FAQItem = ({
  faq,
  index,
  isOpen,
  onClick,
}: {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className={cn(
        "border-b border-purple-500/20 transition-all duration-300",
        isOpen && "bg-purple-500/5 rounded-2xl border-b-0 px-6 -mx-6",
      )}
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-4 text-right group"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-purple-400"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
          <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
            {faq.question}
          </span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center"
        >
          <HelpCircle className="h-3 w-3 text-purple-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-9 text-gray-400 leading-relaxed border-r border-purple-500/20 mr-2">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main FAQ Component
const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  const titleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#050508] py-24 sm:py-32"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-800/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm"
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
              المعرفة المفتوحة
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={titleVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white"
            style={{
              fontFamily: "Somar Medium, 'Segoe UI', system-ui, sans-serif",
              textShadow: "0 0 40px rgba(168, 85, 247, 0.2)",
            }}
          >
            الأسئلة الشائعة
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            custom={1}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            كل ما تريد معرفته عن خدماتنا ونماذج العمل والتكاليف في مكان واحد
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-4 sm:p-6 shadow-2xl"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            لم تجد إجابة لسؤالك؟ تواصل معنا مباشرة
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-white font-medium hover:bg-purple-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <HelpCircle className="h-4 w-4" />
            اتصل بفريق الدعم
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQAccordion;
