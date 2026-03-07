import { Panel } from './Panel';
import { isDesktopRuntime, getLocalApiPort } from '@/services/runtime';
import { escapeHtml } from '@/utils/sanitize';
import { t } from '../services/i18n';
import { trackWebcamSelected, trackWebcamRegionFiltered } from '@/services/analytics';
import { getStreamQuality, subscribeStreamQualityChange } from '@/services/ai-flow-settings';
import { SITE_VARIANT, STORAGE_KEYS } from '@/config';
import { loadFromStorage, saveToStorage } from '@/utils';

export type WebcamRegion = 'iran' | 'middle-east' | 'europe' | 'asia' | 'americas' | 'space' | 'custom';

export interface WebcamFeed {
  id: string;
  city: string;
  country: string;
  region: WebcamRegion;
  channelHandle: string;
  fallbackVideoId: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

// Verified YouTube live stream IDs — validated Feb 2026 via title cross-check.
// IDs may rotate; update when stale.
const WEBCAM_FEEDS: WebcamFeed[] = [
  // Iran Attacks — Tehran, Tel Aviv, Jerusalem
  { id: 'iran-tehran', city: 'Tehran', country: 'Iran', region: 'iran', channelHandle: '@IranHDCams', fallbackVideoId: '-zGuR1qVKrU', lat: 35.6892, lng: 51.3890, zoom: 6 },
  { id: 'iran-telaviv', city: 'Tel Aviv', country: 'Israel', region: 'iran', channelHandle: '@IsraelLiveCam', fallbackVideoId: '-VLcYT5QBrY', lat: 32.0853, lng: 34.7818, zoom: 6 },
  { id: 'iran-jerusalem', city: 'Jerusalem', country: 'Israel', region: 'iran', channelHandle: '@JerusalemLive', fallbackVideoId: 'JHwwZRH2wz8', lat: 31.7683, lng: 35.2137, zoom: 6 },
  { id: 'iran-multicam', city: 'Middle East', country: 'Multi', region: 'iran', channelHandle: '@MiddleEastCams', fallbackVideoId: '4E-iFtUM2kk', lat: 31.0461, lng: 34.8516, zoom: 4 },
  // Middle East — Jerusalem & Tehran adjacent (conflict hotspots)
  { id: 'jerusalem', city: 'Jerusalem', country: 'Israel', region: 'middle-east', channelHandle: '@TheWesternWall', fallbackVideoId: 'UyduhBUpO7Q', lat: 31.7683, lng: 35.2137, zoom: 7 },
  { id: 'tehran', city: 'Tehran', country: 'Iran', region: 'middle-east', channelHandle: '@IranHDCams', fallbackVideoId: '-zGuR1qVKrU', lat: 35.6892, lng: 51.3890, zoom: 6 },
  { id: 'tel-aviv', city: 'Tel Aviv', country: 'Israel', region: 'middle-east', channelHandle: '@IsraelLiveCam', fallbackVideoId: '-VLcYT5QBrY', lat: 32.0853, lng: 34.7818, zoom: 6.5 },
  { id: 'mecca', city: 'Mecca', country: 'Saudi Arabia', region: 'middle-east', channelHandle: '@MakkahLive', fallbackVideoId: 'DEcpmPUbkDQ', lat: 21.3891, lng: 39.8579, zoom: 7 },
  // Europe
  { id: 'kyiv', city: 'Kyiv', country: 'Ukraine', region: 'europe', channelHandle: '@DWNews', fallbackVideoId: '-Q7FuPINDjA', lat: 50.4501, lng: 30.5234, zoom: 6 },
  { id: 'odessa', city: 'Odessa', country: 'Ukraine', region: 'europe', channelHandle: '@UkraineLiveCam', fallbackVideoId: 'e2gC37ILQmk', lat: 46.4825, lng: 30.7233, zoom: 6.5 },
  { id: 'paris', city: 'Paris', country: 'France', region: 'europe', channelHandle: '@PalaisIena', fallbackVideoId: 'OzYp4NRZlwQ', lat: 48.8566, lng: 2.3522, zoom: 6 },
  { id: 'st-petersburg', city: 'St. Petersburg', country: 'Russia', region: 'europe', channelHandle: '@SPBLiveCam', fallbackVideoId: 'CjtIYbmVfck', lat: 59.9311, lng: 30.3609, zoom: 5 },
  { id: 'london', city: 'London', country: 'UK', region: 'europe', channelHandle: '@EarthCam', fallbackVideoId: 'Lxqcg1qt0XU', lat: 51.5072, lng: -0.1276, zoom: 6 },
  // Americas
  { id: 'washington', city: 'Washington DC', country: 'USA', region: 'americas', channelHandle: '@AxisCommunications', fallbackVideoId: '1wV9lLe14aU', lat: 38.9072, lng: -77.0369, zoom: 6 },
  { id: 'new-york', city: 'New York', country: 'USA', region: 'americas', channelHandle: '@EarthCam', fallbackVideoId: '4qyZLflp-sI', lat: 40.7128, lng: -74.0060, zoom: 6 },
  { id: 'los-angeles', city: 'Los Angeles', country: 'USA', region: 'americas', channelHandle: '@VeniceVHotel', fallbackVideoId: 'EO_1LWqsCNE', lat: 34.0522, lng: -118.2437, zoom: 5.5 },
  { id: 'miami', city: 'Miami', country: 'USA', region: 'americas', channelHandle: '@FloridaLiveCams', fallbackVideoId: '5YCajRjvWCg', lat: 25.7617, lng: -80.1918, zoom: 6 },
  // Asia-Pacific — Taipei first (strait hotspot), then Shanghai, Tokyo, Seoul
  { id: 'taipei', city: 'Taipei', country: 'Taiwan', region: 'asia', channelHandle: '@JackyWuTaipei', fallbackVideoId: 'z_fY1pj1VBw', lat: 25.0330, lng: 121.5654, zoom: 6.5 },
  { id: 'shanghai', city: 'Shanghai', country: 'China', region: 'asia', channelHandle: '@SkylineWebcams', fallbackVideoId: '76EwqI5XZIc', lat: 31.2304, lng: 121.4737, zoom: 6 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', region: 'asia', channelHandle: '@TokyoLiveCam4K', fallbackVideoId: '4pu9sF5Qssw', lat: 35.6762, lng: 139.6503, zoom: 5.5 },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', region: 'asia', channelHandle: '@UNvillage_live', fallbackVideoId: '-JhoMGoAfFc', lat: 37.5665, lng: 126.9780, zoom: 6 },
  { id: 'sydney', city: 'Sydney', country: 'Australia', region: 'asia', channelHandle: '@WebcamSydney', fallbackVideoId: '7pcL-0Wo77U', lat: -33.8688, lng: 151.2093, zoom: 5 },
  // Space
  { id: 'iss1', city: 'ISS orbit', country: 'Space', region: 'space', channelHandle: '@NASA', fallbackVideoId: 'xRPjKQtRXR8', lat: 0, lng: 0, zoom: 1 },
];

export const OPTIONAL_WEBCAM_REGIONS: { key: WebcamRegion; labelKey: string; feedIds: string[] }[] = [
  { key: 'iran', labelKey: 'components.webcams.regions.iran', feedIds: ['iran-tehran', 'iran-telaviv', 'iran-jerusalem', 'iran-multicam'] },
  { key: 'middle-east', labelKey: 'components.webcams.regions.mideast', feedIds: ['jerusalem', 'tehran', 'tel-aviv', 'mecca'] },
  { key: 'europe', labelKey: 'components.webcams.regions.europe', feedIds: ['kyiv', 'odessa', 'paris', 'st-petersburg', 'london'] },
  { key: 'americas', labelKey: 'components.webcams.regions.americas', feedIds: ['washington', 'new-york', 'los-angeles', 'miami'] },
  { key: 'asia', labelKey: 'components.webcams.regions.asia', feedIds: ['taipei', 'shanghai', 'tokyo', 'seoul', 'sydney'] },
];

const FINANCE_WEBCAM_FEEDS: WebcamFeed[] = [
  { id: 'new-york', city: 'New York (NYSE)', country: 'USA', region: 'americas', channelHandle: '@EarthCam', fallbackVideoId: '4qyZLflp-sI', lat: 40.7128, lng: -74.0060, zoom: 6 },
  { id: 'london', city: 'London', country: 'UK', region: 'europe', channelHandle: '@EarthCam', fallbackVideoId: 'Lxqcg1qt0XU', lat: 51.5072, lng: -0.1276, zoom: 6 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', region: 'asia', channelHandle: '@TokyoLiveCam4K', fallbackVideoId: 'f0lYfG_vY_U', lat: 35.6762, lng: 139.6503, zoom: 5.5 },
  { id: 'shanghai', city: 'Shanghai', country: 'China', region: 'asia', channelHandle: '@SkylineWebcams', fallbackVideoId: '76EwqI5XZIc', lat: 31.2304, lng: 121.4737, zoom: 6 },
];

const TECH_WEBCAM_FEEDS: WebcamFeed[] = [
  { id: 'san-francisco', city: 'San Francisco', country: 'USA', region: 'americas', channelHandle: '@SFWebCam', fallbackVideoId: 'K7zPBYmN03w', lat: 37.7749, lng: -122.4194, zoom: 6.5 },
  { id: 'seattle', city: 'Seattle', country: 'USA', region: 'americas', channelHandle: '@SpaceNeedle', fallbackVideoId: 'T8XGgI-0z9c', lat: 47.6062, lng: -122.3321, zoom: 6 },
  { id: 'taipei', city: 'Taipei', country: 'Taiwan', region: 'asia', channelHandle: '@JackyWuTaipei', fallbackVideoId: 'z_fY1pj1VBw', lat: 25.0330, lng: 121.5654, zoom: 6.5 },
  { id: 'new-york', city: 'New York', country: 'USA', region: 'americas', channelHandle: '@EarthCam', fallbackVideoId: '4qyZLflp-sI', lat: 40.7128, lng: -74.0060, zoom: 6 },
];

export function getDefaultWebcams(): WebcamFeed[] {
  if (SITE_VARIANT === 'finance') return FINANCE_WEBCAM_FEEDS;
  if (SITE_VARIANT === 'tech') return TECH_WEBCAM_FEEDS;
  if (!['full', 'finance', 'tech'].includes(SITE_VARIANT)) {
    if (SITE_VARIANT === 'travel') return WEBCAM_FEEDS.filter(f => ['paris', 'london', 'new-york', 'los-angeles', 'miami', 'tokyo', 'seoul', 'sydney'].includes(f.id));
    if (SITE_VARIANT === 'climate' || SITE_VARIANT === 'weather') return WEBCAM_FEEDS.filter(f => ['washington', 'miami'].includes(f.id));
    return WEBCAM_FEEDS.slice(0, 4);
  }
  return WEBCAM_FEEDS.filter(f => f.region === 'iran' || f.region === 'middle-east');
}

export function loadWebcamsFromStorage(): WebcamFeed[] {
  const data = loadFromStorage(STORAGE_KEYS.liveWebcams, []);
  if (!Array.isArray(data) || data.length === 0) return [];
  return data as WebcamFeed[];
}

export function saveWebcamsToStorage(feeds: WebcamFeed[]): void {
  saveToStorage(STORAGE_KEYS.liveWebcams, feeds);
}

// Map for fast lookup
export const optionalWebcamMap = new Map<string, WebcamFeed>();
for (const w of WEBCAM_FEEDS) optionalWebcamMap.set(w.id, w);

const MAX_GRID_CELLS = 4;

type ViewMode = 'grid' | 'single';
type RegionFilter = 'all' | WebcamRegion;

export class LiveWebcamsPanel extends Panel {
  private viewMode: ViewMode = 'grid';
  private regionFilter: RegionFilter = 'iran';
  private activeFeed: WebcamFeed = WEBCAM_FEEDS[0]!;
  private toolbar: HTMLElement | null = null;
  private iframes: HTMLIFrameElement[] = [];
  private observer: IntersectionObserver | null = null;
  private isVisible = false;
  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private boundIdleResetHandler!: () => void;
  private boundVisibilityHandler!: () => void;
  private readonly IDLE_PAUSE_MS = 5 * 60 * 1000;
  private isIdle = false;

  private async showLiveWebcamsWindow(): Promise<void> {
    const existing = document.querySelector('.live-webcams-modal-overlay');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.className = 'live-channels-modal-overlay'; // Reusing Live News CSS generic class names

    const modal = document.createElement('div');
    modal.className = 'live-channels-modal';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'live-channels-modal-close';
    closeBtn.innerHTML = '×';

    const close = () => overlay.remove();
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    const { initLiveWebcamsWindow } = await import('../live-webcams-window');
    initLiveWebcamsWindow(modal);
  }
  public feeds: WebcamFeed[] = [];

  constructor() {
    super({ id: 'live-webcams', title: t('panels.liveWebcams'), className: 'panel-wide' });
    this.feeds = loadWebcamsFromStorage();
    if (this.feeds.length === 0) this.feeds = getDefaultWebcams();
    this.activeFeed = this.feeds[0] || WEBCAM_FEEDS[0]!;

    this.createToolbar();
    this.setupIntersectionObserver();
    this.setupIdleDetection();
    subscribeStreamQualityChange(() => this.render());
    this.setupBridgeMessageListener();
    this.render();
  }

  private setupBridgeMessageListener(): void {
    window.addEventListener('message', (event) => {
      if (typeof event.data !== 'object' || event.data === null) return;
      if (event.data.type === 'WORLDMONITOR_WEBCAMS_UPDATED') {
        const newFeeds = loadWebcamsFromStorage();
        if (newFeeds.length === 0) {
          this.feeds = getDefaultWebcams();
        } else {
          this.feeds = newFeeds;
        }

        if (!this.feeds.some(f => f.id === this.activeFeed.id)) {
          this.activeFeed = this.feeds[0] || WEBCAM_FEEDS[0]!;
        }

        // Re-render only if visible
        if (this.isVisible) this.render();
      }
    });
  }

  private get filteredFeeds(): WebcamFeed[] {
    if (!['full', 'finance', 'tech'].includes(SITE_VARIANT)) {
      return this.feeds;
    }
    if (this.regionFilter === 'all') return this.feeds;
    return this.feeds.filter(f => f.region === this.regionFilter);
  }

  private static get ALL_GRID_IDS(): string[] {
    if (SITE_VARIANT === 'tech') return ['san-francisco', 'seattle', 'taipei', 'new-york'];
    if (SITE_VARIANT === 'finance') return ['new-york', 'london', 'tokyo', 'shanghai'];
    if (SITE_VARIANT === 'travel') return ['paris', 'london', 'new-york', 'sydney'];
    if (SITE_VARIANT === 'climate' || SITE_VARIANT === 'weather') return ['washington', 'miami', 'tokyo', 'taipei'];
    if (SITE_VARIANT === 'sports') return ['tokyo', 'sydney', 'london', 'los-angeles'];
    if (SITE_VARIANT === 'health') return ['london', 'paris', 'tokyo', 'washington'];
    return ['iran-tehran', 'iran-telaviv', 'kyiv', 'washington'];
  }

  private get gridFeeds(): WebcamFeed[] {
    if (['full', 'finance', 'tech'].includes(SITE_VARIANT) && this.regionFilter === 'all') {
      return LiveWebcamsPanel.ALL_GRID_IDS
        .map(id => this.feeds.find(f => f.id === id) || WEBCAM_FEEDS.find(f => f.id === id)!)
        .filter(Boolean);
    }
    return this.filteredFeeds.slice(0, MAX_GRID_CELLS);
  }

  private createToolbar(): void {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'webcam-toolbar';

    const viewGroup = document.createElement('div');
    viewGroup.className = 'webcam-toolbar-group';

    const gridBtn = document.createElement('button');
    gridBtn.className = `webcam-view-btn${this.viewMode === 'grid' ? ' active' : ''}`;
    gridBtn.dataset.mode = 'grid';
    gridBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>';
    gridBtn.title = 'Grid view';
    gridBtn.addEventListener('click', () => this.setViewMode('grid'));

    const singleBtn = document.createElement('button');
    singleBtn.className = `webcam-view-btn${this.viewMode === 'single' ? ' active' : ''}`;
    singleBtn.dataset.mode = 'single';
    singleBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="3" width="18" height="14" rx="2"/><rect x="3" y="19" width="18" height="2" rx="1"/></svg>';
    singleBtn.title = 'Single view';
    singleBtn.addEventListener('click', () => this.setViewMode('single'));

    viewGroup.appendChild(gridBtn);
    viewGroup.appendChild(singleBtn);

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'webcam-view-btn';
    settingsBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
    settingsBtn.title = t('components.webcams.manage') ?? 'Manage Webcams';
    settingsBtn.addEventListener('click', () => {
      this.showLiveWebcamsWindow();
    });
    viewGroup.appendChild(settingsBtn);

    let regions: { key: RegionFilter; label: string }[] = [];

    // Core variants layout
    if (['full', 'finance', 'tech'].includes(SITE_VARIANT)) {
      regions = [
        { key: 'iran', label: t('components.webcams.regions.iran') ?? 'IRAN ATTACKS' },
        { key: 'all', label: t('components.webcams.regions.all') ?? 'ALL' },
        { key: 'middle-east', label: t('components.webcams.regions.mideast') ?? 'MIDEAST' },
        { key: 'europe', label: t('components.webcams.regions.europe') ?? 'EUROPE' },
        { key: 'americas', label: t('components.webcams.regions.americas') ?? 'AMERICAS' },
        { key: 'asia', label: t('components.webcams.regions.asia') ?? 'ASIA' },
        { key: 'space', label: 'SPACE' },
      ];
    } else {
      // Dynamic Affiliate Layouts (Travel, Sports, Weather, etc.)
      const affiliateTitleMap: Record<string, string> = {
        travel: 'POPULAR DESTINATIONS',
        climate: 'EXTREME WEATHER',
        weather: 'LIVE WEATHER',
        sports: 'GLOBAL SPORTS VENUES',
        health: 'HOSPITALS & LABS',
      };
      const title = affiliateTitleMap[SITE_VARIANT] || 'TOP CAMS';

      regions = [
        { key: 'iran', label: title },
        { key: 'all', label: 'ALL REGIONS' },
        { key: 'custom', label: 'MY CUSTOM CAMS' },
      ];
    }

    if (regions.length > 0) {
      const regionGroup = document.createElement('div');
      regionGroup.className = 'webcam-toolbar-group';
      regions.forEach(({ key, label }) => {
        const btn = document.createElement('button');
        btn.className = `webcam-region-btn${key === this.regionFilter ? ' active' : ''}`;
        btn.dataset.region = key;
        btn.textContent = label;
        btn.addEventListener('click', () => this.setRegionFilter(key));
        regionGroup.appendChild(btn);
      });
      this.toolbar.appendChild(regionGroup);
    }
    this.toolbar.appendChild(viewGroup);
    this.element.insertBefore(this.toolbar, this.content);
  }

  private setRegionFilter(filter: RegionFilter): void {
    if (filter === this.regionFilter) return;
    trackWebcamRegionFiltered(filter);
    this.regionFilter = filter;
    this.toolbar?.querySelectorAll('.webcam-region-btn').forEach(btn => {
      (btn as HTMLElement).classList.toggle('active', (btn as HTMLElement).dataset.region === filter);
    });
    const feeds = this.filteredFeeds;
    if (feeds.length > 0 && !feeds.includes(this.activeFeed)) {
      this.activeFeed = feeds[0]!;
    }
    this.render();
  }

  private setViewMode(mode: ViewMode): void {
    if (mode === this.viewMode) return;
    this.viewMode = mode;
    this.toolbar?.querySelectorAll('.webcam-view-btn').forEach(btn => {
      (btn as HTMLElement).classList.toggle('active', (btn as HTMLElement).dataset.mode === mode);
    });
    this.render();
  }

  private buildEmbedUrl(videoId: string): string {
    const quality = getStreamQuality();
    if (isDesktopRuntime()) {
      // Use local sidecar embed — YouTube rejects tauri:// parent origin with error 153.
      // The sidecar serves the embed from http://127.0.0.1:PORT which YouTube accepts.
      const params = new URLSearchParams({ videoId, autoplay: '1', mute: '1' });
      if (quality !== 'auto') params.set('vq', quality);
      return `http://localhost:${getLocalApiPort()}/api/youtube-embed?${params.toString()}`;
    }
    const vq = quality !== 'auto' ? `&vq=${quality}` : '';
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0${vq}`;
  }

  private createIframe(feed: WebcamFeed): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.className = 'webcam-iframe';
    iframe.src = this.buildEmbedUrl(feed.fallbackVideoId);
    iframe.title = `${feed.city} live webcam`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    if (!isDesktopRuntime()) {
      iframe.allowFullscreen = true;
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    }
    return iframe;
  }

  private render(): void {
    this.destroyIframes();

    if (!this.isVisible || this.isIdle) {
      this.content.innerHTML = '<div class="webcam-placeholder">Webcams paused</div>';
      return;
    }

    if (this.viewMode === 'grid') {
      this.renderGrid();
    } else {
      this.renderSingle();
    }
  }

  private renderGrid(): void {
    this.content.innerHTML = '';
    this.content.className = 'panel-content webcam-content';

    const grid = document.createElement('div');
    grid.className = 'webcam-grid';

    const feeds = this.gridFeeds;
    const desktop = isDesktopRuntime();

    feeds.forEach((feed, i) => {
      const cell = document.createElement('div');
      cell.className = 'webcam-cell';

      const label = document.createElement('div');
      label.className = 'webcam-cell-label';
      label.innerHTML = `<span class="webcam-live-dot"></span><span class="webcam-city">${escapeHtml(feed.city.toUpperCase())}</span>`;

      if (desktop) {
        // On desktop, clicks pass through label (pointer-events:none in CSS)
        // to YouTube iframe so users click play directly. Add expand button.
        const expandBtn = document.createElement('button');
        expandBtn.className = 'webcam-expand-btn';
        expandBtn.title = t('webcams.expand') || 'Expand';
        expandBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          trackWebcamSelected(feed.id, feed.city, 'grid');
          if (feed.lat !== undefined && feed.lng !== undefined) {
            window.dispatchEvent(new CustomEvent('APP_FLY_TO_LOCATION', {
              detail: { lat: feed.lat, lng: feed.lng, zoom: feed.zoom || 8 }
            }));
          }
          this.activeFeed = feed;
          this.setViewMode('single');
        });
        label.appendChild(expandBtn);
      } else {
        cell.addEventListener('click', () => {
          trackWebcamSelected(feed.id, feed.city, 'grid');
          if (feed.lat !== undefined && feed.lng !== undefined) {
            window.dispatchEvent(new CustomEvent('APP_FLY_TO_LOCATION', {
              detail: { lat: feed.lat, lng: feed.lng, zoom: feed.zoom || 8 }
            }));
          }
          this.activeFeed = feed;
          this.setViewMode('single');
        });
      }

      cell.appendChild(label);
      grid.appendChild(cell);

      if (desktop && i > 0) {
        // Stagger iframe creation on desktop — WKWebView throttles concurrent autoplay.
        setTimeout(() => {
          if (!this.isVisible || this.isIdle) return;
          const iframe = this.createIframe(feed);
          cell.insertBefore(iframe, label);
          this.iframes.push(iframe);
        }, i * 800);
      } else {
        const iframe = this.createIframe(feed);
        cell.insertBefore(iframe, label);
        this.iframes.push(iframe);
      }
    });

    this.content.appendChild(grid);
  }

  private renderSingle(): void {
    this.content.innerHTML = '';
    this.content.className = 'panel-content webcam-content';

    const wrapper = document.createElement('div');
    wrapper.className = 'webcam-single';

    const iframe = this.createIframe(this.activeFeed);
    wrapper.appendChild(iframe);
    this.iframes.push(iframe);

    const switcher = document.createElement('div');
    switcher.className = 'webcam-switcher';

    const backBtn = document.createElement('button');
    backBtn.className = 'webcam-feed-btn webcam-back-btn';
    backBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> Grid';
    backBtn.addEventListener('click', () => this.setViewMode('grid'));
    switcher.appendChild(backBtn);

    this.filteredFeeds.forEach(feed => {
      const btn = document.createElement('button');
      btn.className = `webcam-feed-btn${feed.id === this.activeFeed.id ? ' active' : ''}`;
      btn.textContent = feed.city;
      btn.addEventListener('click', () => {
        trackWebcamSelected(feed.id, feed.city, 'single');
        if (feed.lat !== undefined && feed.lng !== undefined) {
          window.dispatchEvent(new CustomEvent('APP_FLY_TO_LOCATION', {
            detail: { lat: feed.lat, lng: feed.lng, zoom: feed.zoom || 8 }
          }));
        }
        this.activeFeed = feed;
        this.render();
      });
      switcher.appendChild(btn);
    });

    this.content.appendChild(wrapper);
    this.content.appendChild(switcher);
  }

  private destroyIframes(): void {
    this.iframes.forEach(iframe => {
      iframe.src = 'about:blank';
      iframe.remove();
    });
    this.iframes = [];
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const wasVisible = this.isVisible;
        this.isVisible = entries.some(e => e.isIntersecting);
        if (this.isVisible && !wasVisible && !this.isIdle) {
          this.render();
        } else if (!this.isVisible && wasVisible) {
          this.destroyIframes();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.element);
  }

  private setupIdleDetection(): void {
    this.boundVisibilityHandler = () => {
      if (document.hidden) {
        if (this.idleTimeout) clearTimeout(this.idleTimeout);
      } else {
        if (this.isIdle) {
          this.isIdle = false;
          if (this.isVisible) this.render();
        }
        this.boundIdleResetHandler();
      }
    };
    document.addEventListener('visibilitychange', this.boundVisibilityHandler);

    this.boundIdleResetHandler = () => {
      if (this.idleTimeout) clearTimeout(this.idleTimeout);
      if (this.isIdle) {
        this.isIdle = false;
        if (this.isVisible) this.render();
      }
      this.idleTimeout = setTimeout(() => {
        this.isIdle = true;
        this.destroyIframes();
        this.content.innerHTML = '<div class="webcam-placeholder">Webcams paused — move mouse to resume</div>';
      }, this.IDLE_PAUSE_MS);
    };

    ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
      document.addEventListener(event, this.boundIdleResetHandler, { passive: true });
    });

    this.boundIdleResetHandler();
  }

  public refresh(): void {
    if (this.isVisible && !this.isIdle) {
      this.render();
    }
  }

  public destroy(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
      document.removeEventListener(event, this.boundIdleResetHandler);
    });
    this.observer?.disconnect();
    this.destroyIframes();
    super.destroy();
  }

  // End of class
}
