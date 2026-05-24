// components/Contact.tsx
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="min-h-screen w-full bg-black flex items-center py-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">تواصل معنا</h2>
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-md border border-white/10">
            <input type="email" placeholder="بريدك الإلكتروني" className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white mb-4 focus:outline-none focus:border-yellow-500" />
            <textarea placeholder="رسالتك" rows={4} className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white mb-4 focus:outline-none focus:border-yellow-500"></textarea>
            <button className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
              إرسال
            </button>
          </div>
          <p className="text-gray-500 mt-8 text-sm">© 2025 OnRequest - استثمارات رقمية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;