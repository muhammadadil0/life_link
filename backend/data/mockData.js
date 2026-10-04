const mockStats = {
  activeDonors: 1250,
  emergencySupport: '24/7',
  successRate: '98%',
  livesSaved: 2847,
  totalDonations: 3247,
  avgResponseTime: '2.3 min'
};

const mockCarouselPatients = [
  {
    id: "6abfe066c896a9fb50a82267",
    name: "raziq",
    bloodType: "O-",
    urgency: "Moderate",
    hospital: "HMC",
    city: "Lahore",
    units: 2,
    story: "Urgent requirement for 2 unit(s) of O- at HMC, Lahore. Contact: 03494996898",
    heroImage: "/hero_slide_2.jpg",
    badgeColor: "bg-orange-500",
    urgencyBg: "bg-orange-100 text-orange-800"
  },
  {
    id: "6abd1fd6f28dc8b96f43d240",
    name: "Muhammad Adil",
    bloodType: "O-",
    urgency: "Critical",
    hospital: "Mayo Hospital",
    city: "Lahore",
    units: 2,
    story: "Urgent requirement for 2 unit(s) of O- at Mayo Hospital, Lahore. Contact: 03494996898",
    heroImage: "/hero_slide_3.jpg",
    badgeColor: "bg-red-500",
    urgencyBg: "bg-red-100 text-red-800"
  },
  {
    id: "6abd1fbff28dc8b96f43d23f",
    name: "John",
    bloodType: "O-",
    urgency: "Critical",
    hospital: "Al-Shifa Hospital",
    city: "Lahore",
    units: 2,
    story: "Urgent requirement for 2 unit(s) of O- at Al-Shifa Hospital, Lahore. Contact: 03160925561",
    heroImage: "/hero_slide_2.jpg",
    badgeColor: "bg-red-500",
    urgencyBg: "bg-red-100 text-red-800"
  },
  {
    id: "6abd1f0ef28dc8b96f43d23e",
    name: "Muhammad Adil",
    bloodType: "B-",
    urgency: "Critical",
    hospital: "Lady Reading Hospital",
    city: "Peshawar",
    units: 1,
    story: "Urgent requirement for 1 unit(s) of B- at Lady Reading Hospital, Peshawar. Contact: 03494996898",
    heroImage: "/hero_slide_3.jpg",
    badgeColor: "bg-red-500",
    urgencyBg: "bg-red-100 text-red-800"
  }
];

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

