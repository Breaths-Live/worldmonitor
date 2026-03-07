/**
 * Static blog post data for BlogCard rendering.
 * Victor sẽ thay URL thật sau khi có content.
 */
export const BLOG_POSTS = {
    travel: [
        {
            title: 'Top 10 Visa-Free Countries 2026',
            img: '',
            url: '#',
            affTag: 'booking',
        },
        {
            title: 'Best Travel eSIM for Asia',
            img: '',
            url: '#',
            affTag: 'airalo',
        },
        {
            title: 'How to Find Cheap Flights in 2026',
            img: '',
            url: '#',
            affTag: 'aviasales',
        },
    ],
    weather: [
        {
            title: 'Top Safest Climate Destinations 2026',
            img: '',
            url: '#',
            affTag: 'booking',
        },
        {
            title: 'Best Rain Gear for Travel',
            img: '',
            url: '#',
            affTag: 'discovercars',
        },
        {
            title: 'How to Track Storms in Real-Time',
            img: '',
            url: '#',
            affTag: 'nordvpn',
        },
    ],
    health: [
        {
            title: 'Vaccine Requirements by Country 2026',
            img: '',
            url: '#',
            affTag: 'safetywing',
        },
        {
            title: 'Best Travel Health Insurance Compared',
            img: '',
            url: '#',
            affTag: 'insubuy',
        },
        {
            title: 'Emergency Apps Every Traveler Needs',
            img: '',
            url: '#',
            affTag: 'airalo',
        },
    ],
    sports: [
        {
            title: 'UEFA 2026 Travel Guide',
            img: '',
            url: '#',
            affTag: 'ticketnet',
        },
        {
            title: 'Best Sports Streaming VPN Review',
            img: '',
            url: '#',
            affTag: 'nordvpn',
        },
        {
            title: 'Top 10 Stadiums to Visit Worldwide',
            img: '',
            url: '#',
            affTag: 'booking',
        },
    ],
} as const;

export type BlogCategory = keyof typeof BLOG_POSTS;
