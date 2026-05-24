// components/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <section className="min-h-screen w-full bg-black flex items-center py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 border-b-4 border-yellow-500 inline-block pb-2">
            من نحن
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mt-8">
            OnRequest هي شركة رائدة في مجال <span className="text-yellow-400 font-semibold">الاستثمارات الرقمية</span>،
            نقدم حلولاً مبتكرة تجمع بين التكنولوجيا المالية والذكاء الاصطناعي لتمكين المستثمرين من تحقيق أقصى عوائدهم.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-yellow-400 text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-white">سرعة التنفيذ</h3>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-yellow-400 text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold text-white">أمان تام</h3>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-yellow-400 text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-white">شفافية كاملة</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;