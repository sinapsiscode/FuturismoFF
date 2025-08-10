export const LANGUAGES = [
  { code: 'es', name: 'marketplace.filters.languages.spanish' },
  { code: 'en', name: 'marketplace.filters.languages.english' },
  { code: 'fr', name: 'marketplace.filters.languages.french' },
  { code: 'de', name: 'marketplace.filters.languages.german' },
  { code: 'it', name: 'marketplace.filters.languages.italian' },
  { code: 'pt', name: 'marketplace.filters.languages.portuguese' },
  { code: 'ja', name: 'marketplace.filters.languages.japanese' },
  { code: 'ko', name: 'marketplace.filters.languages.korean' },
  { code: 'zh', name: 'marketplace.filters.languages.chinese' },
  { code: 'ru', name: 'marketplace.filters.languages.russian' }
];

export const SORT_OPTIONS = [
  { value: 'rating', label: 'marketplace.search.sort.rating' },
  { value: 'price', label: 'marketplace.search.sort.price' },
  { value: 'experience', label: 'marketplace.search.sort.experience' },
  { value: 'reviews', label: 'marketplace.search.sort.reviews' }
];

export const TOUR_TYPE_ICONS = {
  cultural: 'BuildingLibraryIcon',
  aventura: 'GlobeAltIcon',
  gastronomico: 'CakeIcon',
  mistico: 'SparklesIcon',
  fotografico: 'CameraIcon'
};

export const WORK_ZONE_NAMES = {
  'cusco-ciudad': 'marketplace.zones.cusco-city',
  'valle-sagrado': 'marketplace.zones.sacred-valley',
  'machu-picchu': 'marketplace.zones.machu-picchu',
  'sur-valle': 'marketplace.zones.south-valley',
  'otros': 'marketplace.zones.others'
};

export const DEFAULT_FILTERS = {
  languages: [],
  tourTypes: [],
  workZones: [],
  groupTypes: [],
  priceRange: { min: 0, max: 500 },
  rating: 0,
  availability: null,
  instantBooking: false,
  verified: false
};

export const RATING_OPTIONS = [5, 4, 3, 2, 1];

export const PRICE_RANGE_CONFIG = {
  min: { min: 0, max: 200, step: 10 },
  max: { min: 0, max: 500, step: 10 }
};

export const FILTER_SECTIONS = {
  languages: true,
  tourTypes: true,
  workZones: true,
  groupTypes: false,
  price: false,
  rating: true,
  availability: false
};