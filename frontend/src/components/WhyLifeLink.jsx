import React from 'react';
import { MessageSquareHeart } from 'lucide-react';

export default function WhyLifeLink() {
  return (
    <section className="py-6 sm:py-12 px-3 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card bg-white/95 rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-10 border-l-4 sm:border-l-8 border-red-500 relative overflow-hidden">
          {/* Watermark Quote Icon */}
          <div className="absolute -top-6 -right-6 opacity-5 text-red-600 text-8xl sm:text-9xl select-none pointer-events-none font-display">
            ❝
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <MessageSquareHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-red-600 font-display">
              Why LifeLink?
            </h2>
          </div>

          {/* English Message */}
          <p className="text-gray-700 text-xs sm:text-lg leading-relaxed mb-4 sm:mb-6 font-light">
            In urgent times, people often send messages in WhatsApp groups and social media, desperately searching for blood donors.{' '}
            <span className="font-semibold text-red-600">LifeLink</span> makes this process easier, faster, and more reliable. With just a few clicks, you can connect with donors or patients in need—no more waiting, no more uncertainty.{' '}
            <span className="font-semibold text-green-600">Save lives, spread hope, and be a hero in your community!</span>
          </p>

          {/* Urdu Message Box */}
          <div className="p-4 sm:p-6 bg-red-50/80 rounded-xl sm:rounded-2xl border border-red-200 text-right">
            <span className="block text-lg sm:text-xl font-bold text-red-700 font-display mb-1.5 sm:mb-2">
              لائف لنک کیوں؟
            </span>
            <p className="text-gray-800 text-base sm:text-xl leading-relaxed sm:leading-loose font-urdu" dir="rtl">
              ایمرجنسی میں لوگ واٹس ایپ اور گروپس میں پیغامات بھیجتے ہیں، خون کے عطیہ دہندگان کی تلاش میں۔{' '}
              <span className="font-bold text-red-600">LifeLink</span> اس عمل کو آسان، تیز اور قابلِ اعتماد بناتا ہے۔ صرف چند کلکس میں آپ ضرورت مند مریض یا عطیہ دہندگان سے جڑ سکتے ہیں۔ اب انتظار نہیں، اب بے یقینی نہیں۔{' '}
              <span className="font-bold text-green-600">زندگیاں بچائیں، امید پھیلائیں، اور اپنے معاشرے کے ہیرو بنیں!</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
