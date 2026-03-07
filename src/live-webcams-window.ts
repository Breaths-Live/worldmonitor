/**
 * Standalone channel management window (LIVE WEBCAMS panel: add/remove/reorder webcams).
 */
import type { WebcamFeed } from '@/components/LiveWebcamsPanel';
import {
  loadWebcamsFromStorage,
  saveWebcamsToStorage,
  getDefaultWebcams,
  optionalWebcamMap,
  OPTIONAL_WEBCAM_REGIONS,
} from '@/components/LiveWebcamsPanel';
import { SITE_VARIANT } from '@/config';
import { t } from '@/services/i18n';

function customWebcamIdFromHandle(handle: string): string {
  const normalized = handle
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return 'custom-webcam-' + normalized;
}

// Persist active region tab across re-renders
let activeRegionTab = OPTIONAL_WEBCAM_REGIONS[0]?.key ?? 'iran';

function channelInitials(name: string): string {
  return name.split(/[\s-]+/).map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function initLiveWebcamsWindow(containerEl?: HTMLElement): void {
  const appEl = containerEl ?? document.getElementById('app');
  if (!appEl) return;

  if (!containerEl) {
    document.title = `Manage Webcams - World Monitor`;
  }

  let feeds = loadWebcamsFromStorage();
  if (feeds.length === 0) feeds = getDefaultWebcams();
  let suppressRowClick = false;

  function applyOrderFromDom(listEl: HTMLElement): void {
    const rows = listEl.querySelectorAll<HTMLElement>('.live-news-manage-row');
    const ids = Array.from(rows).map((el) => el.dataset.feedId).filter((id): id is string => !!id);
    const map = new Map(feeds.map((c) => [c.id, c]));
    feeds = ids.map((id) => map.get(id)).filter((c): c is WebcamFeed => !!c);
    saveWebcamsToStorage(feeds);
    notifyPanel();
  }

  function notifyPanel(): void {
    window.postMessage({ type: 'WORLDMONITOR_WEBCAMS_UPDATED' }, '*');
  }

  function setupListDnD(listEl: HTMLElement): void {
    let dragging: HTMLElement | null = null;
    let dragStarted = false;
    let startY = 0;
    const THRESHOLD = 6;

    listEl.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, button, textarea, select')) return;
      const row = target.closest('.live-news-manage-row') as HTMLElement | null;
      if (!row || row.classList.contains('live-news-manage-row-editing')) return;
      dragging = row;
      dragStarted = false;
      startY = e.clientY;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      if (!dragStarted) {
        if (Math.abs(e.clientY - startY) < THRESHOLD) return;
        dragStarted = true;
        dragging.classList.add('live-news-manage-row-dragging');
      }
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.live-news-manage-row') as HTMLElement | null;
      if (!target || target === dragging) return;
      const all = Array.from(listEl.querySelectorAll('.live-news-manage-row'));
      const idx = all.indexOf(dragging);
      const targetIdx = all.indexOf(target);
      if (idx === -1 || targetIdx === -1) return;
      if (idx < targetIdx) {
        target.parentElement?.insertBefore(dragging, target.nextSibling);
      } else {
        target.parentElement?.insertBefore(dragging, target);
      }
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      if (dragStarted) {
        dragging.classList.remove('live-news-manage-row-dragging');
        applyOrderFromDom(listEl);
        suppressRowClick = true;
        setTimeout(() => {
          suppressRowClick = false;
        }, 0);
      }
      dragging = null;
      dragStarted = false;
    });
  }

  function renderList(listEl: HTMLElement): void {
    listEl.innerHTML = '';
    for (const feed of feeds) {
      const row = document.createElement('div');
      row.className = 'live-news-manage-row';
      row.dataset.feedId = feed.id;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'live-news-manage-row-name';
      nameSpan.textContent = feed.city ?? feed.id;
      row.appendChild(nameSpan);

      row.addEventListener('click', (e) => {
        if (suppressRowClick || row.classList.contains('live-news-manage-row-dragging')) return;
        if ((e.target as HTMLElement).closest('input, button, textarea, select')) return;
        e.preventDefault();
        showEditForm(row, feed, listEl);
      });

      listEl.appendChild(row);
    }
    updateRestoreButton();
    renderAvailableWebcams(listEl);
  }

  function getMissingDefaultWebcams(): WebcamFeed[] {
    const currentIds = new Set(feeds.map((c) => c.id));
    return getDefaultWebcams().filter((c) => !currentIds.has(c.id));
  }

  function updateRestoreButton(): void {
    const btn = document.getElementById('liveWebcamsRestoreBtn');
    if (!btn) return;
    const missing = getMissingDefaultWebcams();
    (btn as HTMLButtonElement).style.display = missing.length > 0 ? '' : 'none';
  }

  function applyEditFormToWebcams(
    currentFeed: WebcamFeed,
    formRow: HTMLElement,
    isCustom: boolean,
    displayName: string,
  ): WebcamFeed[] | null {
    const idx = feeds.findIndex((c) => c.id === currentFeed.id);
    if (idx === -1) return null;

    if (isCustom) {
      const handleRaw = (formRow.querySelector('.live-news-manage-edit-handle') as HTMLInputElement | null)?.value?.trim();
      const fallbackVideoId = (formRow.querySelector('.live-news-manage-edit-video') as HTMLInputElement | null)?.value?.trim();

      if (handleRaw) {
        const handle = handleRaw.startsWith('@') ? handleRaw : `@${handleRaw}`;
        const newId = customWebcamIdFromHandle(handle);
        const existing = feeds.find((c) => c.id === newId && c.id !== currentFeed.id);
        if (existing) return null;
        const next = feeds.slice();
        next[idx] = { ...currentFeed, id: newId, channelHandle: handle, city: displayName, fallbackVideoId: fallbackVideoId || currentFeed.fallbackVideoId };
        return next;
      }
    }
    const next = feeds.slice();
    next[idx] = { ...currentFeed, city: displayName };
    return next;
  }

  function showEditForm(row: HTMLElement, feed: WebcamFeed, listEl: HTMLElement): void {
    const isCustom = feed.id.startsWith('custom-');
    row.innerHTML = '';
    row.className = 'live-news-manage-row live-news-manage-row-editing';

    if (isCustom) {
      const handleInput = document.createElement('input');
      handleInput.type = 'text';
      handleInput.className = 'live-news-manage-edit-handle';
      handleInput.value = feed.channelHandle ?? '';
      handleInput.placeholder = 'YouTube handle';
      row.appendChild(handleInput);

      const vIdInput = document.createElement('input');
      vIdInput.type = 'text';
      vIdInput.className = 'live-news-manage-edit-video';
      vIdInput.value = feed.fallbackVideoId ?? '';
      vIdInput.placeholder = 'Video ID';
      row.appendChild(vIdInput);
    }

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'live-news-manage-edit-name';
    nameInput.value = feed.city ?? '';
    nameInput.placeholder = 'City / Name';
    row.appendChild(nameInput);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'live-news-manage-remove live-news-manage-remove-in-form';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      feeds = feeds.filter((c) => c.id !== feed.id);
      saveWebcamsToStorage(feeds);
      notifyPanel();
      renderList(listEl);
    });
    row.appendChild(removeBtn);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'live-news-manage-save';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
      const displayName = nameInput.value.trim() || feed.city || feed.id || 'Custom Location';
      const next = applyEditFormToWebcams(feed, row, isCustom, displayName);
      if (next) {
        feeds = next;
        saveWebcamsToStorage(feeds);
        notifyPanel();
      }
      renderList(listEl);
    });
    row.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'live-news-manage-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      renderList(listEl);
    });
    row.appendChild(cancelBtn);
  }

  function renderAvailableWebcams(listEl: HTMLElement): void {
    const tabBar = document.getElementById('liveWebcamsTabBar');
    const tabContents = document.getElementById('liveWebcamsTabContents');
    if (!tabBar || !tabContents) return;

    const currentIds = new Set(feeds.map((c) => c.id));

    tabBar.innerHTML = '';
    for (const region of OPTIONAL_WEBCAM_REGIONS) {
      const addedCount = region.feedIds.filter((id) => currentIds.has(id)).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'live-news-manage-tab-btn' + (region.key === activeRegionTab ? ' active' : '');
      const label = t(region.labelKey) ?? region.key.toUpperCase();
      btn.textContent = addedCount > 0 ? `${label} (${addedCount})` : label;
      btn.addEventListener('click', () => {
        activeRegionTab = region.key;
        renderAvailableWebcams(listEl);
      });
      tabBar.appendChild(btn);
    }

    tabContents.innerHTML = '';
    for (const region of OPTIONAL_WEBCAM_REGIONS) {
      const panel = document.createElement('div');
      panel.className = 'live-news-manage-tab-content' + (region.key === activeRegionTab ? ' active' : '');

      const grid = document.createElement('div');
      grid.className = 'live-news-manage-card-grid';

      for (const chId of region.feedIds) {
        const ch = optionalWebcamMap.get(chId);
        if (!ch) continue;
        const isAdded = currentIds.has(chId);
        grid.appendChild(createCard(ch, isAdded, listEl));
      }

      panel.appendChild(grid);
      tabContents.appendChild(panel);
    }
  }

  function createCard(feed: WebcamFeed, isAdded: boolean, listEl: HTMLElement): HTMLElement {
    const card = document.createElement('div');
    card.className = 'live-news-manage-card' + (isAdded ? ' added' : '');

    const icon = document.createElement('div');
    icon.className = 'live-news-manage-card-icon';
    icon.textContent = channelInitials(feed.city);

    const info = document.createElement('div');
    info.className = 'live-news-manage-card-info';
    const nameEl = document.createElement('span');
    nameEl.className = 'live-news-manage-card-name';
    nameEl.textContent = feed.city;
    const handleEl = document.createElement('span');
    handleEl.className = 'live-news-manage-card-handle';
    handleEl.textContent = feed.channelHandle ?? '';
    info.appendChild(nameEl);
    info.appendChild(handleEl);

    const action = document.createElement('span');
    action.className = 'live-news-manage-card-action';
    action.textContent = isAdded ? '✓' : '+';

    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(action);

    if (!isAdded) {
      card.addEventListener('click', () => {
        if (feeds.some((c) => c.id === feed.id)) return;
        feeds.push({ ...feed });
        saveWebcamsToStorage(feeds);
        notifyPanel();
        renderList(listEl);
      });
    }
    return card;
  }

  let customTitle = 'Add custom webcam';
  if (SITE_VARIANT === 'travel') customTitle = 'Add custom travel webcam (YouTube)';
  else if (SITE_VARIANT === 'climate' || SITE_VARIANT === 'weather') customTitle = 'Add custom weather/climate webcam';
  else if (SITE_VARIANT === 'health') customTitle = 'Add custom health/outbreak webcam';
  else if (SITE_VARIANT === 'sports') customTitle = 'Add custom sports/event webcam';

  appEl.innerHTML = `
    <div class="live-channels-window-shell">
      <div class="live-channels-window-header">
         <span class="live-channels-window-title">Manage Webcams</span>
      </div>
      <div class="live-channels-window-content">
        <div class="live-channels-window-toolbar">
          <button type="button" class="live-news-manage-restore-defaults" id="liveWebcamsRestoreBtn" style="display: none;">Restore default webcams</button>
        </div>
        <div class="live-news-manage-list" id="liveWebcamsList"></div>
        <div class="live-news-manage-available-section">
          <span class="live-news-manage-add-title">Available webcams</span>
          <div class="live-news-manage-tab-bar" id="liveWebcamsTabBar"></div>
          <div class="live-news-manage-tab-contents" id="liveWebcamsTabContents"></div>
        </div>
        <div class="live-news-manage-add-section">
          <span class="live-news-manage-add-title">${customTitle}</span>
          <div class="live-news-manage-add">
            <div class="live-news-manage-add-field">
              <label class="live-news-manage-add-label" for="liveWebcamsHandle">YouTube handle</label>
              <input type="text" class="live-news-manage-handle" id="liveWebcamsHandle" placeholder="@Channel" />
            </div>
            <div class="live-news-manage-add-field">
              <label class="live-news-manage-add-label" for="liveWebcamsVideo">Video ID</label>
              <input type="text" class="live-news-manage-handle" id="liveWebcamsVideo" placeholder="abcdef123" />
            </div>
            <div class="live-news-manage-add-field">
              <label class="live-news-manage-add-label" for="liveWebcamsName">City Name</label>
              <input type="text" class="live-news-manage-name" id="liveWebcamsName" placeholder="Tokyo" />
            </div>
            <div class="live-news-manage-add-field">
              <label class="live-news-manage-add-label" for="liveWebcamsRegion">Region</label>
              <select class="live-news-manage-name" id="liveWebcamsRegion">
                <option value="iran">Iran</option>
                <option value="middle-east">Middle East</option>
                <option value="europe">Europe</option>
                <option value="americas">Americas</option>
                <option value="asia">Asia</option>
              </select>
            </div>
            <button type="button" class="live-news-manage-add-btn" id="liveWebcamsAddBtn">Add webcam</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const listEl = document.getElementById('liveWebcamsList');
  if (!listEl) return;
  setupListDnD(listEl);
  renderList(listEl);

  const restoreBtn = document.getElementById('liveWebcamsRestoreBtn');
  restoreBtn?.addEventListener('click', () => {
    const missing = getMissingDefaultWebcams();
    if (missing.length === 0) return;
    feeds.push(...missing);
    saveWebcamsToStorage(feeds);
    notifyPanel();
    renderList(listEl);
  });

  const addBtn = document.getElementById('liveWebcamsAddBtn');
  const addHandle = document.getElementById('liveWebcamsHandle') as HTMLInputElement | null;
  const addVideo = document.getElementById('liveWebcamsVideo') as HTMLInputElement | null;
  const addName = document.getElementById('liveWebcamsName') as HTMLInputElement | null;
  const addRegion = document.getElementById('liveWebcamsRegion') as HTMLSelectElement | null;

  function validateAddForm() {
    if (!addBtn) return;
    const hasData = (addHandle?.value.trim().length || 0) > 0 || (addVideo?.value.trim().length || 0) > 0;
    (addBtn as HTMLButtonElement).disabled = !hasData;
  }

  addHandle?.addEventListener('input', validateAddForm);
  addVideo?.addEventListener('input', validateAddForm);
  addName?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !(addBtn as HTMLButtonElement).disabled) {
      e.preventDefault();
      addBtn?.click();
    }
  });

  addBtn?.addEventListener('click', () => {
    if (!addHandle || !addVideo || !addName || !addRegion) return;
    const handleStr = addHandle.value.trim() || '@Custom';
    const videoStr = addVideo.value.trim() || '';
    if (!handleStr && !videoStr) return;

    let handle = handleStr;
    if (handle && !handle.startsWith('@')) handle = '@' + handle;

    const newId = customWebcamIdFromHandle(handle || videoStr);

    // NOTE: PER USER REQUEST NO CHANNEL LIMIT REQUIRED
    const feed: WebcamFeed = {
      id: newId + '-' + Date.now(),
      city: addName.value.trim() || 'Custom Location',
      country: 'Custom',
      region: (addRegion.value || 'americas') as any,
      channelHandle: handle,
      fallbackVideoId: videoStr
    };

    feeds.push(feed);
    saveWebcamsToStorage(feeds);
    notifyPanel();
    renderList(listEl);

    addHandle.value = '';
    addVideo.value = '';
    addName.value = '';
    validateAddForm();
  });

  validateAddForm();
}
