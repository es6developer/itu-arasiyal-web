export const APP_NAME = 'இது அரசியல்';
export const APP_NAME_EN = 'Ithu Arasiyal';
export const TAGLINE = 'அரசியலை அறிந்து முடிவெடுங்கள்';

export const CATEGORIES = [
  { key: 'all', label: 'செய்திகள்', labelEn: 'News' },
  { key: 'politics', label: 'அரசியல்', labelEn: 'Politics' },
  { key: 'tamil_nadu', label: 'தமிழ்நாடு', labelEn: 'Tamil Nadu' },
  { key: 'india', label: 'இந்தியா', labelEn: 'India' },
  { key: 'cinema', label: 'சினிமா', labelEn: 'Cinema' },
  { key: 'sports', label: 'விளையாட்டு', labelEn: 'Sports' },
  { key: 'business', label: 'வணிகம்', labelEn: 'Business' },
  { key: 'technology', label: 'தொழில்நுட்பம்', labelEn: 'Technology' },
  { key: 'lifestyle', label: 'வாழ்க்கை', labelEn: 'Lifestyle' },
  { key: 'spiritual', label: 'ஆன்மிகம்', labelEn: 'Spiritual' },
  { key: 'health', label: 'உடல்நலம்', labelEn: 'Health' },
  { key: 'education', label: 'கல்வி', labelEn: 'Education' },
  { key: 'trending', label: 'ட்ரெண்டிங்', labelEn: 'Trending' },
];

export const RSS_URLS = {
  all: [
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://www.dailythanthi.com/stories.rss',
  ],
  politics: [
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
  ],
  tamil_nadu: [
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
    'https://www.dailythanthi.com/stories.rss',
  ],
  india: [
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
  ],
  cinema: [
    'https://tamil.oneindia.com/rss/feeds/tamil-cinema-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/tamil-ott-fb.xml',
  ],
  sports: [
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
  ],
  business: [
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://www.dailythanthi.com/stories.rss',
  ],
  technology: [
    'https://tamil.oneindia.com/rss/feeds/tamil-technology-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/artificial-intelligence-fb.xml',
  ],
  lifestyle: [
    'https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
  ],
  spiritual: [
    'https://tamil.oneindia.com/rss/feeds/tamil-spirtuality-fb.xml',
    'https://tamil.oneindia.com/rss/feeds/tamil-astrology-fb.xml',
  ],
  health: [
    'https://tamil.oneindia.com/rss/feeds/tamil-health-fb.xml',
  ],
  education: [
    'https://tamil.oneindia.com/rss/feeds/tamil-education-fb.xml',
  ],
  trending: [
    'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml',
  ],
};

export const SECTION_CONFIG = [
  { key: 'breaking', category: 'all', title: 'உடனடிச் செய்திகள்', titleEn: 'Breaking News' },
  { key: 'politics', category: 'politics', title: 'அரசியல்', titleEn: 'Politics' },
  { key: 'tamil_nadu', category: 'tamil_nadu', title: 'தமிழ்நாடு', titleEn: 'Tamil Nadu' },
  { key: 'cinema', category: 'cinema', title: 'சினிமா', titleEn: 'Cinema' },
  { key: 'technology', category: 'technology', title: 'தொழில்நுட்பம்', titleEn: 'Technology' },
  { key: 'spiritual', category: 'spiritual', title: 'ஆன்மிகம்', titleEn: 'Spiritual' },
  { key: 'health', category: 'health', title: 'உடல்நலம்', titleEn: 'Health' },
  { key: 'education', category: 'education', title: 'கல்வி', titleEn: 'Education' },
];

export const CORS_PROXIES = [
  (url) => `/proxy?url=${encodeURIComponent(url)}`,
];

export const CACHE_DURATION = 15 * 60 * 1000;

export const PARTIES = [
  { key: 'TVK', label: 'தவெக', color: '#E91E63' },
  { key: 'DMK', label: 'திமுக', color: '#D32F2F' },
  { key: 'AIADMK', label: 'அதிமுக', color: '#1565C0' },
  { key: 'BJP', label: 'பாஜக', color: '#FF8F00' },
  { key: 'CONGRESS', label: 'காங்கிரஸ்', color: '#1B5E20' },
  { key: 'NTK', label: 'நாதக', color: '#4A148C' },
  { key: 'PMK', label: 'பாமக', color: '#004D40' },
];
