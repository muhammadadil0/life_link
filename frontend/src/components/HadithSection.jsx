import React from 'react';

export default function HadithSection({ quotes = [] }) {
  const defaultQuotes = [
    {
      id: 1,
      quote: "Whoever saves one life, it is as if he had saved mankind entirely.",
      source: "Qur'an 5:32",
      urdu: "جس نے ایک جان کو بچایا، گویا اس نے پوری انسانیت کو بچایا۔",
      symbol: "ﷺ"
    },
    {
      id: 2,
      quote: "The best among you are those who bring greatest benefits to many others.",
      source: "Prophet Muhammad ﷺ (Daraqutni, Hasan)",
      urdu: "تم میں سب سے بہتر وہ ہے جو دوسروں کو سب سے زیادہ فائدہ پہنچائے۔",
      symbol: "ﷺ"
    },
    {
      id: 3,
      quote: "Allah is helping the servant as long as the servant is helping his brother.",
      source: "Prophet Muhammad ﷺ (Muslim)",
      urdu: "اللہ اپنے بندے کی مدد کرتا ہے جب تک بندہ اپنے بھائی کی مدد کرتا رہے۔",
      symbol: "ﷺ"
    }
  ];

  const items = quotes.length > 0 ? quotes : defaultQuotes;

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-red-50/90 via-white to-red-50/60 rounded-3xl shadow-xl p-8 border-2 border-red-100/80 relative overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Calligraphy Watermark */}
              <div className="absolute -top-4 -right-4 opacity-10 text-red-600 text-8xl select-none pointer-events-none font-urdu">
                {item.symbol || 'ﷺ'}
              </div>

              <div>
                <blockquote className="text-lg sm:text-xl italic text-gray-800 text-center leading-relaxed mb-4 font-serif">
                  "{item.quote}"
                </blockquote>
                <div className="text-right text-gray-500 font-medium text-xs tracking-wider uppercase mb-6">
                  — {item.source}
                </div>
              </div>

              <div className="text-center text-red-700 text-lg font-bold font-urdu pt-4 border-t border-red-100" dir="rtl">
                "{item.urdu}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
