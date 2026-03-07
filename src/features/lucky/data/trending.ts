/**
 * Trending destinations — fallback data when API hasn't loaded.
 * Victor sẽ replace bằng real API data từ Geoapify + BucketList.
 */
export interface TrendingDestination {
    id: string;
    name: string;
    location: { city: string; country: string; countryFlag: string; lat: number; lon: number };
    image: string;
    description: string;
    priceRange: 'Free' | 'Budget' | 'Mid' | 'Premium';
    tags: string[];
    weather?: { temp: number; icon: string };
    rating?: number;
    affiliate: {
        tours?: string;
        hotel?: string;
        flights?: string;
    };
    subIdPrefix: string;
}

export const TRENDING_DESTINATIONS: TrendingDestination[] = [
    {
        id: 'hoian',
        name: 'Hội An',
        location: { city: 'Hội An', country: 'Vietnam', countryFlag: '🇻🇳', lat: 15.88, lon: 108.33 },
        image: '',
        description: 'Ancient town with lanterns, incredible street food and tailor shops.',
        priceRange: 'Budget',
        tags: ['Culture', 'Food', 'History'],
        weather: { temp: 28, icon: '🌤' },
        rating: 4.8,
        affiliate: {
            tours: 'https://www.getyourguide.com/hoi-an-l1157/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=HoiAn&marker=535510',
            flights: 'https://www.aviasales.com/search/HANXXMAYDAG1?marker=535510',
        },
        subIdPrefix: 'explore_hoian',
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        location: { city: 'Tokyo', country: 'Japan', countryFlag: '🇯🇵', lat: 35.68, lon: 139.69 },
        image: '',
        description: 'Neon-lit metropolis blending ancient temples with cutting-edge tech.',
        priceRange: 'Premium',
        tags: ['Food', 'Tech', 'Culture'],
        weather: { temp: 12, icon: '⛅' },
        rating: 4.9,
        affiliate: {
            tours: 'https://www.getyourguide.com/tokyo-l193/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=Tokyo&marker=535510',
            flights: 'https://www.aviasales.com/search/HANXXMAYNRT1?marker=535510',
        },
        subIdPrefix: 'explore_tokyo',
    },
    {
        id: 'santorini',
        name: 'Santorini',
        location: { city: 'Santorini', country: 'Greece', countryFlag: '🇬🇷', lat: 36.39, lon: 25.46 },
        image: '',
        description: 'Iconic white-washed cliffs, stunning sunsets, and Mediterranean charm.',
        priceRange: 'Premium',
        tags: ['Romance', 'View', 'Beach'],
        weather: { temp: 18, icon: '☀️' },
        rating: 4.7,
        affiliate: {
            tours: 'https://www.getyourguide.com/santorini-l523/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=Santorini&marker=535510',
        },
        subIdPrefix: 'explore_santorini',
    },
    {
        id: 'bali',
        name: 'Bali',
        location: { city: 'Bali', country: 'Indonesia', countryFlag: '🇮🇩', lat: -8.34, lon: 115.09 },
        image: '',
        description: 'Tropical paradise with rice terraces, temples, and world-class surfing.',
        priceRange: 'Mid',
        tags: ['Adventure', 'Nature', 'Wellness'],
        weather: { temp: 30, icon: '🌤' },
        rating: 4.6,
        affiliate: {
            tours: 'https://www.getyourguide.com/bali-l347/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=Bali&marker=535510',
        },
        subIdPrefix: 'explore_bali',
    },
    {
        id: 'danang',
        name: 'Đà Nẵng',
        location: { city: 'Đà Nẵng', country: 'Vietnam', countryFlag: '🇻🇳', lat: 16.05, lon: 108.22 },
        image: '',
        description: 'Coastal city with Bà Nà Hills, Dragon Bridge, and pristine beaches.',
        priceRange: 'Budget',
        tags: ['Beach', 'Adventure', 'Food'],
        weather: { temp: 27, icon: '🌤' },
        rating: 4.5,
        affiliate: {
            tours: 'https://www.getyourguide.com/da-nang-l4151/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=DaNang&marker=535510',
        },
        subIdPrefix: 'explore_danang',
    },
    {
        id: 'bangkok',
        name: 'Bangkok',
        location: { city: 'Bangkok', country: 'Thailand', countryFlag: '🇹🇭', lat: 13.76, lon: 100.50 },
        image: '',
        description: 'Vibrant street food capital with golden temples and floating markets.',
        priceRange: 'Budget',
        tags: ['Food', 'Culture', 'Nightlife'],
        weather: { temp: 33, icon: '🌤' },
        rating: 4.5,
        affiliate: {
            tours: 'https://www.getyourguide.com/bangkok-l169/?partner_id=XXXXX',
            hotel: 'https://hotellook.com/hotels?destination=Bangkok&marker=535510',
        },
        subIdPrefix: 'explore_bangkok',
    },
];

export const ACTIVITY_CATEGORIES = [
    { id: 'adventure', label: '🏔️ Adventure', icon: '🏔️' },
    { id: 'food', label: '🍜 Food & Cooking', icon: '🍜' },
    { id: 'culture', label: '🏛️ Culture', icon: '🏛️' },
    { id: 'shows', label: '🎭 Shows', icon: '🎭' },
    { id: 'water', label: '🚤 Water', icon: '🚤' },
    { id: 'nature', label: '🌿 Nature', icon: '🌿' },
    { id: 'art', label: '🎨 Art & Craft', icon: '🎨' },
] as const;
