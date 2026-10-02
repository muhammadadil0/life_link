const mockStats = {
  activeDonors: 1250,
  emergencySupport: '24/7',
  successRate: '98%',
  livesSaved: 2847,
  totalDonations: 3247,
  avgResponseTime: '2.3 min'
};

const mockCarouselPatients = [];

const mockQuotes = [
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

const mockEmergencyRequests = [];
const mockDonorsList = [];

module.exports = {
  mockStats,
  mockCarouselPatients,
  mockQuotes,
  mockEmergencyRequests,
  mockDonorsList
};

