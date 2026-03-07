/**
 * Affiliate Links Config — Victor sẽ điền IDs thật sau
 * Lucky chỉ tạo skeleton placeholder links.
 */
// --- AUTOMATION_START ---
export const AFF_LINKS = {
    aviasales: 'https://aviasales.com/?marker=535510',
    booking: 'https://booking.com/?aid=XXXXX',
    getyourguide: 'https://getyourguide.com/?partner_id=XXXXX',
    expedia: 'https://expedia.com/?affcid=XXXXX',
    airalo: 'https://airalo.com/?referral=XXXXX',
    discovercars: 'https://discovercars.com/?a_aid=XXXXX',
    nordvpn: 'https://nordvpn.com/?aff=XXXXX',
    safetywing: 'https://safetywing.com/?referral=XXXXX',
    insubuy: 'https://insubuy.com/?ref=XXXXX',
    wise: 'https://wise.com/?r=XXXXX',
    binance: 'https://binance.com/?ref=XXXXX',
    hostinger: 'https://hostinger.com/?aff=XXXXX',
    visitorscoverage: 'https://visitorscoverage.com/?ref=XXXXX',
    kiwitaxi: 'https://kiwitaxi.com/?pap=XXXXX',
    wegotrip: 'https://wegotrip.com/?partner=XXXXX',
    ticketnet: 'https://ticketnetwork.com/?tag=XXXXX',
    hotellook: 'https://hotellook.com/?marker=XXXXX',
} as const;
// --- AUTOMATION_END ---


export type AffLinkKey = keyof typeof AFF_LINKS;

/**
 * Hàm builder để tự động tạo danh sách Affiliate Link thay vì hardcode.
 * @param key Khóa của link affiliate (ví dụ: 'aviasales', 'booking')
 * @param subId Chuỗi tracking chiến dịch/vị trí (ví dụ: 'lucky_explore_cta')
 */
export function buildAffiliateUrl(key: AffLinkKey, subId: string = 'lucky_app'): string {
    const rawUrl = AFF_LINKS[key];
    if (!rawUrl) return '#';

    // Thay thế XXXXX (nếu có placeholder) hoặc nối thêm tuỳ cấu trúc url
    if (rawUrl.includes('XXXXX')) {
        return rawUrl.replace('XXXXX', subId);
    }

    // Nếu url có dạng ?marker=535510, ta nối thêm text subid vào (tuỳ mạng lưới, giả định nối _:subId)
    // Tạm thời trả về rawUrl nếu không chứa XXXXX, Victor tự handle logic chuyên sâu sau
    return rawUrl;
}
