# Affiliate Configuration Guide — SubID Format & Environment Variables

## Mục đích

Tài liệu này hướng dẫn:
1. Cách đặt affiliate IDs vào biến môi trường.
2. SubID format chuẩn để tracking campaigns.
3. Cách built affiliate URLs từ app.

---

## Environment Variables (Affiliate IDs)

Các biến sau phải được đặt trong Cloudflare Workers environment variables hoặc `.env.local` (dev):

### Travel & Booking Partners

```env
REACT_APP_TRAVELPAYOUTS_ID=your_travelpayouts_id
REACT_APP_MAPPING_ID=your_mapping_id
REACT_APP_GETYOURGUIDE_ID=your_getyourguide_partner_id
REACT_APP_BOOKING_ID=your_booking_aid
REACT_APP_EXPEDIA_ID=your_expedia_site_id
REACT_APP_AIRALO_ID=your_airalo_referral_code
REACT_APP_DISCOVERCARS_ID=your_discovercars_partner_id
```

### Travel Insurance & Prep

```env
REACT_APP_SAFETYWING_ID=your_safetywing_referral
REACT_APP_VISITORSCOVERAGE_ID=your_visitorscoverage_ref
REACT_APP_INSUBUY_ID=your_insubuy_ref
```

### Connectivity, VPN, Finance

```env
REACT_APP_NORDVPN_ID=your_nordvpn_aff_id
REACT_APP_WISE_ID=your_wise_referral_code
REACT_APP_BINANCE_ID=your_binance_ref_id
REACT_APP_HOSTINGER_ID=your_hostinger_aff_id
```

### Local Transport & Misc

```env
REACT_APP_KIWITAXI_ID=your_kiwitaxi_pap_id
REACT_APP_WEGOTRIP_ID=your_wegotrip_partner_id
REACT_APP_HOTELLOOK_ID=your_hotellook_marker
```

---

## SubID Format (Tracking)

All affiliate URLs must include a SubID parameter to track source, destination, duration, and position.

### Format Specification

```
{block}_{destination}{duration}_{position}
```

### Components

| Part | Format | Example | Notes |
|---|---|---|---|
| block | lowercase | `hero`, `section_a`, `footer` | UI section on page |
| destination | UPPERCASE (ISO 3166-1 alpha-3 or shortcode) | `PARIS`, `NYC`, `DA_NANG` | Country/city code |
| duration | digit + unit | `3d`, `1w`, `multi` | Trip length |
| position | number/grid ref | `1`, `2`, `grid3`, `top` | Position in block/grid |

### Examples

Valid SubIDs:
- `hero_PARIS3d_1` — Hero section, Paris trip, 3 days, position 1.
- `section_a_HO_CHI_MINH_week_2` — Section A, Ho Chi Minh, 1 week, position 2.
- `footer_NYC_multi_top` — Footer, NYC, multi-day, top position.
- `sidebar_TOKYO_3d_grid2` — Sidebar, Tokyo, 3 days, grid position 2.

Invalid SubIDs (should be rejected):
- `Hero_Paris_1` (mixed case, spaces).
- `hero_paris_3d_1` (destination not uppercase).
- `section DEST_3d` (invalid characters).

---

## Destination Codes (Reference)

### Popular Travel Destinations

| Destination | Code | Region |
|---|---|---|
| Paris | PARIS | Europe |
| Tokyo | TOKYO | Asia |
| Miami | MIAMI | North America |
| New York | NYC | North America |
| London | LONDON | Europe |
| Barcelona | BARCELONA | Europe |
| Ho Chi Minh City | HO_CHI_MINH | Asia |
| Đà Nẵng | DA_NANG | Asia |
| Phuket | PHUKET | Asia |
| Bali | BALI | Asia |
| Dubai | DUBAI | Middle East |
| Istanbul | ISTANBUL | Europe/Asia |
| Sydney | SYDNEY | Oceania |
| Bangkok | BANGKOK | Asia |
| Hong Kong | HONG_KONG | Asia |

### Country Codes (ISO 3166-1 Alpha-3)

Use standard ISO codes if needed:
- USA (United States)
- GBR (United Kingdom)
- FRA (France)
- JPN (Japan)
- AUS (Australia)

---

## How to Build & Use Affiliate URLs

### In React/TypeScript

```tsx
import { buildAffiliateUrl, buildSubId } from '@/features/affiliate/config/affiliateLinks';

// Build SubID
const subId = buildSubId('hero', 'PARIS', '3d', 1);
// Result: 'hero_PARIS3d_1'

// Build affiliate URL
const travelPayoutsUrl = buildTravelPayoutsLink({
  destination: 'PARIS',
  duration: '3d',
  subId: subId,
  // affiliateId loaded from env var (via process.env.REACT_APP_TRAVELPAYOUTS_ID)
});

// Use in href
<a href={travelPayoutsUrl}>Book flights →</a>
```

### In Templates / Config

If using static config (e.g., `src/config/affiliatePartners.ts`):

```ts
export const affiliatePartners = {
  experiences: [
    {
      name: 'GetYourGuide Tours',
      link: 'https://www.getyourguide.com/?partner_id=${GETYOURGUIDE_ID}&sub_id={subId}',
      subIdTemplate: 'exp_${destination}_${duration}_${position}',
    },
  ],
};
```

Then substitute env vars and subIds at runtime (Victor's job to handle).

---

## Testing Affiliate URLs Locally

1. Set env vars in `.env.local`:
   ```
   REACT_APP_TRAVELPAYOUTS_ID=test_travelpayouts_123
   REACT_APP_BOOKING_ID=test_booking_456
   ```

2. Run `npm run dev` (or `vercel dev`).

3. Open panel with affiliate card:
   - Example: `http://localhost:3000/?variant=travel&dest=paris`

4. Inspect network tab:
   - Click affiliate link.
   - Check URL in "Network" tab to confirm SubID & affiliate ID are present.
   - Example:
     ```
     https://www.booking.com/?aid=test_booking_456&utm_campaign=hero_PARIS3d_1
     ```

5. Click through to partner site to confirm redirect works (no errors).

---

## Production Deployment

### Cloudflare Workers

1. Upload env vars to Cloudflare:
   ```bash
   wrangler secret put REACT_APP_TRAVELPAYOUTS_ID
   # Enter: your_real_travelpayouts_id
   
   wrangler secret put REACT_APP_BOOKING_ID
   # Enter: your_real_booking_aid
   
   # ... repeat for all affiliate IDs
   ```

2. Access in worker:
   ```js
   const travelpayoutsId = env.REACT_APP_TRAVELPAYOUTS_ID;
   ```

3. Test production URL (staging):
   ```
   https://staging-breaths-live.pages.dev/?variant=travel&dest=paris
   ```

4. Verify affiliate links on staging before pushing to main.

### Vercel (Dev/Parity Testing Only)

1. Set in Vercel project settings → Environment Variables.
2. Redeploy and test same way as above.

---

## Monitoring & Analytics

Track affiliate performance via:

1. **Partner Dashboard**: Check each partner's affiliate dashboard for clicks, conversions, revenue.
   - Travelpayouts: https://my.travelpayouts.com/
   - GetYourGuide: https://partner.getyourguide.com/
   - Booking.com: https://partner.booking.com/

2. **Google Analytics / Custom Events**:
   - Log events when user clicks affiliate link (include SubID in event properties).
   - Example event:
     ```
     event('click_affiliate', {
       partner: 'booking',
       sub_id: 'hero_PARIS3d_1',
       destination: 'PARIS',
     });
     ```

3. **SubID Analysis**:
   - Use SubID to segment performance by:
     - Block / UI section (hero vs sidebar vs footer).
     - Destination (PARIS vs NYC vs BANGKOK).
     - Duration (3d vs multi).
     - Position (top vs grid2 vs bottom).

---

## Common Issues & Troubleshooting

### Issue: Affiliate ID not injected, link shows `XXXXX`

**Cause**: Env var not set or not available at runtime.

**Solution**:
1. Check `.env.local` (dev) or Cloudflare env (prod) has the var.
2. Restart dev server if added env var.
3. Check React side loads from `process.env.REACT_APP_*` (not server-side envs).
4. Verify var name matches exactly (case-sensitive).

### Issue: SubID format invalid, tracking not working

**Cause**: SubID doesn't match expected format.

**Solution**:
1. Use the `buildSubId()` helper function to auto-format.
2. Validate before use: `isValidSubId(subId)` returns boolean.
3. Check no spaces, special chars (except underscores).
4. Ensure destination is UPPERCASE.

### Issue: Partner reports zero conversions on certain SubIDs

**Cause**: SubID format misunderstood by partner's tracking system.

**Solution**:
1. Check partner's tracking docs (sometimes they have specific format requirements).
2. Test with simpler SubID (e.g., just `hero_PARIS_1`).
3. Contact partner support to verify tracking parameter name (might be `utm_campaign` vs `sub_id` vs custom).

---

## Security Notes

- **NEVER commit real affiliate IDs** to the repo.
- **ALWAYS use environment variables**, not hardcoded strings.
- **Sanitize SubIDs** — avoid URLs that could be injection vectors.
- **Use HTTPS only** — all affiliate redirects must be secure.

---

## Future Enhancements

- [ ] Add `/api/trackAffiliateClick` endpoint to log clicks server-side (for better attribution).
- [ ] Implement A/B testing for CTA copy & placement using SubIDs.
- [ ] Build dashboard to visualize affiliate performance by SubID, destination, block.
- [ ] Add fraud detection (flag suspicious click patterns).

---

**Last updated**: 2026-03-07 (Victor agent)  
**Owner**: Victor (backend) & Lucky (UI)  
**Related files**:
- `src/features/affiliate/config/affiliateLinks.ts` — link builders.
- `docs/dev/victor-api-endpoints.md` — API documentation.
- `.agen/skills/AFFILIATE/AFFILIATE_SKILL.md` — affiliate rules.
