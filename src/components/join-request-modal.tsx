"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Transition, Easing } from "framer-motion";
import { X, Send, Plus, Trash2, User, Phone, Briefcase, Link } from "lucide-react";

interface JoinRequestModalProps {
  onClose: () => void;
}

// Escape HTML special characters for Telegram
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function JoinRequestModal({ onClose }: JoinRequestModalProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [about, setAbout] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const maxLinks = 5;

  const addLink = () => {
    if (links.length < maxLinks) {
      setLinks([...links, ""]);
    }
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const filteredLinks = links.filter(l => l.trim());
    
    // Escape user inputs for HTML
    const safeName = escapeHtml(name);
    const safeWhatsapp = escapeHtml(whatsapp);
    const safeAbout = escapeHtml(about);
    const safeLinks = filteredLinks.map(escapeHtml);

    // Build HTML message for Telegram
    let message = `<b>✨ طلب انضمام جديد لـ OnRequest ✨</b>\n\n`;
    message += `<b>👤 الاسم:</b> ${safeName}\n`;
    message += `<b>📱 واتساب:</b> ${safeWhatsapp}\n`;
    message += `<b>📝 نبذة:</b>\n${safeAbout}\n\n`;
    if (safeLinks.length > 0) {
      message += `<b>🔗 الروابط:</b>\n${safeLinks.map(l => `• ${l}`).join('\n')}\n`;
    }
    message += `\n#طلب_انضمام #OnRequest`;

    const botToken = "8736761252:AAFxGoTtmpTbQTy7gn9pBSQ7FKqdbSCSE44";
    const chatId = "-1003688920562";

    if (!botToken || !chatId) {
      setErrorMsg("حدث خطأ في الإعدادات، يرجى المحاولة لاحقاً");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || "فشل الإرسال");
      }

      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setName("");
        setWhatsapp("");
        setAbout("");
        setLinks([""]);
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile-optimized transitions with proper typing
  const backdropTransition: Transition = {
    duration: 0.2,
    ease: "easeOut" as Easing
  };
  
  const modalTransition: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.4
  };

  const successTransition: Transition = {
    duration: 0.2,
    ease: "easeOut" as Easing
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={backdropTransition}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 5 }}
        transition={modalTransition}
        className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#0F1F35] to-[#0A1628] border border-purple-500/20 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10 active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-white text-center mb-2">
          انضم إلى{" "}
          <span className="bg-clip-text font-bold text-white">
            OnRequest
          </span>
        </h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          املأ النموذج أدناه وسنتواصل معك قريباً
        </p>

        {isSuccess ? (
          /* Success Message */
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={successTransition}
  className="text-center py-8 relative"
>
  {/* Animated background particles */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
    />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0.2, 0], y: [20, -20, 20] }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-lg"
    />
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: [0, 0.15, 0], y: [-20, 20, -20] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
      className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-lg"
    />
  </div>

  {/* Animated checkmark with confetti effect */}
  <div className="relative z-10">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/20 border-2 border-green-400/50 flex items-center justify-center shadow-2xl shadow-green-500/20"
    >
      <motion.svg
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="w-10 h-10 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </motion.svg>
    </motion.div>

    {/* Confetti particles */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, -60 - Math.random() * 40],
            scale: [0, 0.8 + Math.random() * 0.5],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
          className="absolute top-24 left-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: `hsl(${120 + Math.random() * 60}, 80%, 60%)`,
            left: `calc(50% + ${(Math.random() - 0.5) * 80}px)`,
          }}
        />
      ))}
    </div>

    {/* Main text with gradient */}
    <motion.h4
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
    >
      تم الإرسال بنجاح!
    </motion.h4>

    {/* Subtle divider */}
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 60 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent mx-auto mb-3"
    />

    <motion.p
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.65, duration: 0.4 }}
      className="text-gray-300 text-sm max-w-xs mx-auto"
    >
      تم استلام طلبك بنجاح
      <span className="block text-xs text-gray-500 mt-1">سنراجع طلبك ونتواصل معك قريباً</span>
    </motion.p>

    {/* Sparkle effect around text */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
      className="absolute -inset-4 pointer-events-none"
    >
      <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-2xl" />
    </motion.div>
  </div>
</motion.div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* Name */}
            <div className="relative z-10">
              <label className="block text-gray-400 text-xs mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="أدخل اسمك الكامل"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="relative z-10">
              <label className="block text-gray-400 text-xs mb-1.5">رقم الواتساب</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  placeholder="+966 5xxxxxxxx"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            {/* About */}
            <div className="relative z-10">
              <label className="block text-gray-400 text-xs mb-1.5">
                المجال الذي ترغب العمل به ونبذة عنك
              </label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-4 w-4 h-4 text-gray-500" />
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  required
                  placeholder="مثال: مطور واجهات أمامية، لدي خبرة 3 سنوات في React و Next.js..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/40 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Links */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-xs">
                  روابط تؤيد خبرتك (حتى {maxLinks} روابط)
                </label>
                {links.length < maxLinks && (
                  <button
                    type="button"
                    onClick={addLink}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs transition-colors active:scale-95"
                  >
                    <Plus size={14} />
                    <span>إضافة رابط</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateLink(index, e.target.value)}
                        placeholder="https://github.com/your-profile"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/40 transition-colors"
                        dir="ltr"
                      />
                    </div>
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {errorMsg && (
              <p className="text-red-400 text-xs text-center">{errorMsg}</p>
            )}

{/* Submit button - Glassmorphism with Animated Purple Border */}
<button
  type="submit"
  disabled={isSubmitting}
  className="relative group flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-transparent text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {/* Border container */}
  <div className="absolute inset-0 rounded-xl border border-white group-hover:border-purple-500 transition-colors duration-500" />

  {/* Animated border line (runs on hover) */}
  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
    <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
  </div>

  {/* Inner content */}
  <span className="relative z-10 flex items-center gap-2">
    {isSubmitting ? (
      <>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
        <span>جاري الإرسال...</span>
      </>
    ) : (
      <>
        <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        <span>إرسال الطلب</span>
      </>
    )}
  </span>
</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}