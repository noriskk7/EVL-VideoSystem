(() => {
  'use strict';

  const D = window.EVLDevices;
  const noop = async () => {};
  const N = window.evlNative || {
    toggleFullscreen: noop, setFullscreen: noop, isFullscreen: async () => false,
    onFullscreenChange: () => {}, keepAwake: noop, openPrivacy: noop, version: async () => '',
    titlebarTheme: noop,
  };
  const $ = (s) => document.querySelector(s);
  const md = navigator.mediaDevices;
  const I = window.EVLi18n;
  const t = I.t;

  const DEFAULTS = {
    res: '1080', fps: 60, audioOut: '', preview: true, showVirtual: false, sounds: true,
    autoOpen: false, volume: 100, muted: false, audioMap: {}, lastDevice: '', lang: 'auto',
  };
  let S = loadSettings();
  function loadSettings() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('evl.settings') || '{}')); }
    catch { return Object.assign({}, DEFAULTS); }
  }
  function saveSettings() {
    try { localStorage.setItem('evl.settings', JSON.stringify(S)); } catch {  }
  }

  let uiCtx = null;
  function blip(type) {
    if (!S.sounds || screen !== 'home') return;
    try {
      uiCtx = uiCtx || new AudioContext();
      const t = uiCtx.currentTime;
      const o = uiCtx.createOscillator();
      const g = uiCtx.createGain();
      const f = { hover: [1500, 1500], click: [760, 1240], back: [900, 560] }[type] || [1000, 1000];
      const peak = type === 'hover' ? 0.02 : 0.05;
      const len = type === 'hover' ? 0.05 : 0.14;
      o.type = 'sine';
      o.frequency.setValueAtTime(f[0], t);
      o.frequency.exponentialRampToValueAtTime(f[1], t + len * 0.7);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(uiCtx.destination);
      o.start(t);
      o.stop(t + len + 0.02);
    } catch {  }
  }

  I.setLang(S.lang);

  function tickClock() {
    const d = new Date();
    $('#clock-time').textContent = d.toLocaleTimeString(I.locale(), { hour: '2-digit', minute: '2-digit' });
    $('#clock-date').textContent = d.toLocaleDateString(I.locale(), { weekday: 'short', day: 'numeric', month: 'numeric' }).replace('.', '');
  }
  tickClock();
  setInterval(tickClock, 5000);

  let screen = 'home';
  let devices = { video: [], audioIn: [], audioOut: [] };
  let permProblem = null;
  const previews = new Map();
  let previewToken = 0;
  const cur = { video: null, vstream: null, astream: null, audioDev: null, nodes: null, waiting: false, token: 0, error: null };
  let audioCtx = null;

  async function listDevices() {
    let list = await md.enumerateDevices();
    const noVideoLabels = list.some((d) => d.kind === 'videoinput' && !d.label);
    const noAudioLabels = list.some((d) => d.kind === 'audioinput' && !d.label);
    permProblem = null;
    if (noVideoLabels) {
      try { (await md.getUserMedia({ video: true })).getTracks().forEach((t) => t.stop()); }
      catch (e) { if (e.name === 'NotAllowedError') permProblem = 'camera'; }
    }
    if (noAudioLabels) {
      try { (await md.getUserMedia({ audio: true })).getTracks().forEach((t) => t.stop()); }
      catch (e) { if (e.name === 'NotAllowedError' && !permProblem) permProblem = 'mic'; }
    }
    if (noVideoLabels || noAudioLabels) list = await md.enumerateDevices();
    return list;
  }

  async function refreshDevices() {
    const list = await listDevices();
    devices = {
      video: D.filterVideo(list, { showVirtual: S.showVirtual }),
      audioIn: D.audioInputs(list),
      audioOut: D.audioOutputs(list),
    };
  }

  const ICON_CAPTURE = '<svg viewBox="0 0 24 24"><path d="M3 6h18v10H3zm2 2v6h14V8zM8 18h8v2H8z"/></svg>';
  const ICON_CAMERA = '<svg viewBox="0 0 24 24"><path d="M4 7h11v10H4zm12 3 4-3v10l-4-3z"/></svg>';

  function stopPreviews() {
    previewToken++;
    previews.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    previews.clear();
  }

  function renderGrid() {
    const grid = $('#grid');
    grid.textContent = '';
    const total = Math.max(12, Math.ceil(devices.video.length / 4) * 4);
    devices.video.forEach((dev) => {
      const tile = document.createElement('button');
      tile.className = 'slot channel';
      tile.dataset.id = dev.deviceId;
      tile.title = dev.label;
      tile.innerHTML =
        '<video muted autoplay playsinline disablepictureinpicture></video>' +
        '<div class="ch-fallback">' + (dev.kind === 'capture' ? ICON_CAPTURE : ICON_CAMERA) + '<span class="fb-text"></span></div>' +
        '<span class="ch-kind ' + dev.kind + '">' + t(dev.kind === 'capture' ? 'kindCapture' : 'kindCamera') + '</span>' +
        '<span class="ch-label"></span>';
      tile.querySelector('.ch-label').textContent = dev.label;
      tile.addEventListener('mouseenter', () => blip('hover'));
      tile.addEventListener('focus', () => blip('hover'));
      tile.addEventListener('click', () => openDevice(dev));
      grid.appendChild(tile);
    });
    for (let i = devices.video.length; i < total; i++) {
      const empty = document.createElement('div');
      empty.className = 'slot empty';
      grid.appendChild(empty);
    }
    showHomeMessage();
  }

  function showHomeMessage() {
    const box = $('#home-msg');
    const text = $('#home-msg-text');
    const action = $('#home-msg-action');
    action.classList.add('hidden');
    action.onclick = null;
    if (permProblem === 'camera') {
      text.textContent = t('permBlocked');
      action.textContent = t('openWinSettings');
      action.onclick = () => N.openPrivacy('camera');
      action.classList.remove('hidden');
    } else if (!devices.video.length) {
      text.textContent = t('noDevices');
    } else {
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
  }

  async function startPreviews() {
    const token = ++previewToken;
    if (!S.preview) {
      document.querySelectorAll('.channel .fb-text').forEach((el) => { el.textContent = ''; });
      return;
    }
    for (const dev of devices.video) {
      if (token !== previewToken || screen !== 'home') return;
      const tile = document.querySelector('.channel[data-id="' + CSS.escape(dev.deviceId) + '"]');
      if (!tile) continue;
      let stream = previews.get(dev.deviceId);
      if (!stream) {
        try {
          stream = await md.getUserMedia({
            video: { deviceId: { exact: dev.deviceId }, width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 30 } },
          });
        } catch (e) {
          const fb = tile.querySelector('.fb-text');
          if (fb) fb.textContent = t(e.name === 'NotReadableError' ? 'inUseShort' : 'noPreview');
          continue;
        }
        if (token !== previewToken || screen !== 'home') { stream.getTracks().forEach((t) => t.stop()); return; }
        previews.set(dev.deviceId, stream);
      }
      const v = tile.querySelector('video');
      v.srcObject = stream;
      v.play().catch(() => {});
      tile.classList.add('live');
    }
  }

  async function goHome() {
    screen = 'home';
    document.body.classList.add('on-home');
    document.body.classList.remove('on-viewer');
    $('#viewer').classList.remove('active');
    $('#home').classList.add('active');
    N.titlebarTheme('light');
    N.keepAwake(false);
    await refreshDevices();
    renderGrid();
    startPreviews();
  }

  function resolutionTarget() {
    switch (S.res) {
      case '720': return { w: 1280, h: 720 };
      case '1440': return { w: 2560, h: 1440 };
      case '2160': return { w: 3840, h: 2160 };
      case 'monitor': {
        const r = window.devicePixelRatio || 1;
        return { w: Math.round(window.screen.width * r), h: Math.round(window.screen.height * r) };
      }
      default: return { w: 1920, h: 1080 };
    }
  }

  function setStatus(text, opts) {
    const o = opts || {};
    $('#status').classList.remove('hidden');
    $('#status-text').textContent = text;
    $('#status-spinner').classList.toggle('hidden', !o.spinner);
    const btn = $('#status-action');
    if (o.action) {
      btn.textContent = o.action.label;
      btn.onclick = o.action.run;
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
      btn.onclick = null;
    }
  }
  function hideStatus() { $('#status').classList.add('hidden'); }

  function stopCapture() {
    cur.token++;
    stopAudio();
    if (cur.vstream) cur.vstream.getTracks().forEach((t) => t.stop());
    cur.vstream = null;
    $('#screen').srcObject = null;
    $('#info-badge').textContent = '';
  }

  async function openDevice(dev) {
    blip('click');
    stopPreviews();
    screen = 'viewer';
    cur.video = dev;
    cur.waiting = false;
    S.lastDevice = dev.label;
    saveSettings();
    document.body.classList.remove('on-home');
    document.body.classList.add('on-viewer');
    $('#home').classList.remove('active');
    $('#viewer').classList.add('active');
    $('#viewer-name').textContent = dev.label;
    N.titlebarTheme('dark');
    wakeHud();
    await startCapture();
  }

  async function startCapture() {
    stopCapture();
    const token = cur.token;
    const dev = cur.video;
    cur.error = null;
    setStatus(t('connecting', { name: dev.label }), { spinner: true });

    const { w, h } = resolutionTarget();
    const vc = {
      deviceId: { exact: dev.deviceId },
      width: { ideal: w },
      height: { ideal: h },
      frameRate: { ideal: Number(S.fps) || 60 },
    };
    if (md.getSupportedConstraints().resizeMode) vc.resizeMode = 'none';

    let vstream;
    try {
      vstream = await md.getUserMedia({ video: vc });
    } catch (e) {
      if (e.name === 'OverconstrainedError') {
        try { vstream = await md.getUserMedia({ video: { deviceId: { exact: dev.deviceId } } }); }
        catch (e2) { return captureError(e2, token); }
      } else {
        return captureError(e, token);
      }
    }
    if (token !== cur.token || screen !== 'viewer') { vstream.getTracks().forEach((t) => t.stop()); return; }

    cur.vstream = vstream;
    const track = vstream.getVideoTracks()[0];
    track.addEventListener('ended', () => { if (token === cur.token) onDisconnected(); });
    const video = $('#screen');
    video.srcObject = vstream;
    video.play().catch(() => {});

    await startAudio(token);
    if (token !== cur.token) return;
    updateInfo();
    hideStatus();
    N.keepAwake(true);
  }

  function captureError(e, token) {
    if (token !== cur.token) return;
    cur.error = e.name;
    const retry = { label: t('retry'), run: () => startCapture() };
    if (e.name === 'NotAllowedError') {
      setStatus(t('permBlocked'), {
        action: { label: t('openWinSettings'), run: () => N.openPrivacy('camera') },
      });
    } else if (e.name === 'NotReadableError' || e.name === 'AbortError' || e.name === 'TrackStartError') {
      setStatus(t('inUse'), { action: retry });
    } else if (e.name === 'NotFoundError') {
      setStatus(t('notFound'), { action: retry });
    } else {
      setStatus(t('openFailed', { err: e.name }), { action: retry });
    }
  }

  function onDisconnected() {
    cur.waiting = true;
    stopCapture();
    N.keepAwake(false);
    setStatus(t('disconnected'), { spinner: true });
  }

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new AudioContext({ latencyHint: 'interactive' });
      applyAudioOutput();
    }
    return audioCtx;
  }

  async function applyAudioOutput() {
    if (!audioCtx || typeof audioCtx.setSinkId !== 'function') return;
    try { await audioCtx.setSinkId(S.audioOut || ''); }
    catch {
      S.audioOut = '';
      try { await audioCtx.setSinkId(''); } catch {  }
    }
  }

  function chosenAudio() {
    const choice = S.audioMap[cur.video.label] || 'auto';
    if (choice === 'none') return null;
    if (choice !== 'auto') {
      const found = devices.audioIn.find((a) => a.label === choice);
      if (found) return found;
    }
    return D.pairAudio(cur.video, devices.audioIn);
  }

  async function startAudio(token) {
    stopAudio();
    const adev = chosenAudio();
    cur.audioDev = adev;
    cur.audioError = null;
    if (adev) {
      try {
        const astream = await md.getUserMedia({
          audio: {
            deviceId: { exact: adev.deviceId },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: { ideal: 2 },
            sampleRate: { ideal: 48000 },
            latency: { ideal: 0.01 },
          },
        });
        if (token !== cur.token) { astream.getTracks().forEach((t) => t.stop()); return; }
        const ctx = getAudioCtx();
        const src = ctx.createMediaStreamSource(astream);
        const gain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        src.connect(gain).connect(ctx.destination);
        src.connect(analyser);
        cur.astream = astream;
        cur.nodes = { src, gain, analyser, buf: new Float32Array(analyser.fftSize) };
        applyVolume();
        if (ctx.state !== 'running') await ctx.resume().catch(() => {});
      } catch (e) {
        cur.audioError = e.name;
      }
    }
    updateAudioUi();
  }

  function stopAudio() {
    if (cur.nodes) {
      try { cur.nodes.src.disconnect(); cur.nodes.gain.disconnect(); } catch {  }
    }
    cur.nodes = null;
    if (cur.astream) cur.astream.getTracks().forEach((t) => t.stop());
    cur.astream = null;
  }

  function applyVolume() {
    $('#volume').value = S.volume;
    $('#volume-val').textContent = S.volume + '%';
    $('#ico-vol').classList.toggle('hidden', S.muted);
    $('#ico-mute').classList.toggle('hidden', !S.muted);
    if (cur.nodes && audioCtx) {
      cur.nodes.gain.gain.setTargetAtTime(S.muted ? 0 : S.volume / 100, audioCtx.currentTime, 0.015);
    }
  }

  function updateAudioUi() {
    const el = $('#audio-name');
    el.classList.remove('warn');
    if (!cur.video) return;
    if (!cur.audioDev) {
      const choice = S.audioMap[cur.video.label];
      el.textContent = t(choice === 'none' ? 'noAudio' : 'audioNotFound');
      if (choice !== 'none') el.classList.add('warn');
    } else if (cur.audioError) {
      el.textContent = t('audioFailed', { err: cur.audioError });
      el.classList.add('warn');
    } else {
      el.textContent = t('audioLabel', { name: cur.audioDev.label });
    }
  }

  function updateInfo() {
    if (!cur.vstream) return;
    const s = cur.vstream.getVideoTracks()[0].getSettings();
    const fps = s.frameRate ? Math.round(s.frameRate) + ' fps' : '';
    $('#info-badge').textContent = (s.width && s.height ? s.width + ' × ' + s.height : '') + (fps ? ' · ' + fps : '');
  }

  function vuLoop() {
    let level = 0;
    if (cur.nodes && screen === 'viewer') {
      const { analyser, buf } = cur.nodes;
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      level = Math.min(1, Math.sqrt(sum / buf.length) * 4);
    }
    $('#vu-bar').style.width = (level * 100).toFixed(0) + '%';
    cur.vuLevel = level;
    requestAnimationFrame(vuLoop);
  }
  requestAnimationFrame(vuLoop);

  let hudTimer = null;
  const modalOpen = () => !$('#modal').classList.contains('hidden');

  function hideHudNow() {
    clearTimeout(hudTimer);
    if (screen === 'viewer' && !modalOpen()) $('#viewer').classList.add('idle');
  }

  function wakeHud() {
    if (!document.hasFocus()) return hideHudNow();
    $('#viewer').classList.remove('idle');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => {
      if (screen !== 'viewer') return;
      if (modalOpen() || $('#hud').matches(':hover')) return wakeHud();
      hideHudNow();
    }, 2500);
  }
  ['mousemove', 'mousedown', 'wheel'].forEach((ev) => $('#viewer').addEventListener(ev, wakeHud, { passive: true }));
  document.addEventListener('mousemove', () => { if (screen === 'viewer') wakeHud(); }, { passive: true });
  window.addEventListener('blur', hideHudNow);
  document.documentElement.addEventListener('mouseleave', hideHudNow);

  let isFs = false;
  function setFsUi(on) {
    isFs = !!on;
    document.body.classList.toggle('is-fullscreen', isFs);
    $('#fs-label').textContent = t(isFs ? 'exitFullscreen' : 'fullscreen');
  }
  setFsUi(false);
  N.onFullscreenChange(setFsUi);
  const toggleFs = () => N.toggleFullscreen();
  $('#btn-fullscreen').addEventListener('click', toggleFs);
  $('#screen').addEventListener('dblclick', toggleFs);

  $('#btn-back').addEventListener('click', async () => {
    stopCapture();
    await N.setFullscreen(false);
    await goHome();
    blip('back');
  });
  $('#btn-mute').addEventListener('click', () => { S.muted = !S.muted; applyVolume(); saveSettings(); });
  $('#volume').addEventListener('input', (e) => { S.volume = Number(e.target.value); S.muted = false; applyVolume(); });
  $('#volume').addEventListener('change', saveSettings);
  $('#btn-refresh').addEventListener('click', async () => { blip('click'); stopPreviews(); await refreshDevices(); renderGrid(); startPreviews(); });
  $('#btn-settings').addEventListener('click', () => { blip('click'); openSettings(); });
  $('#btn-viewer-settings').addEventListener('click', openSettings);

  function fillSelect(sel, options, value) {
    sel.textContent = '';
    for (const [val, label] of options) {
      const o = document.createElement('option');
      o.value = val;
      o.textContent = label;
      sel.appendChild(o);
    }
    sel.value = value;
    if (sel.value !== value && sel.options.length) sel.selectedIndex = 0;
  }

  function openSettings() {
    const inViewer = screen === 'viewer' && cur.video;
    $('#device-section').classList.toggle('hidden', !inViewer);
    if (inViewer) {
      $('#device-section-title').textContent = cur.video.label;
      const auto = D.pairAudio(cur.video, devices.audioIn);
      fillSelect($('#set-audio-in'), [
        ['auto', t('auto') + ' (' + (auto ? auto.label : t('notFoundShort')) + ')'],
        ['none', t('noAudio')],
        ...devices.audioIn.map((a) => [a.label, a.label]),
      ], S.audioMap[cur.video.label] || 'auto');
    }
    const r = window.devicePixelRatio || 1;
    $('#set-res').querySelector('option[value="monitor"]').textContent =
      t('resMonitor') + ' (' + Math.round(screen_w() * r) + ' × ' + Math.round(screen_h() * r) + ')';
    $('#set-res').value = S.res;
    $('#set-fps').value = String(S.fps);
    $('#set-lang').value = S.lang || 'auto';
    fillSelect($('#set-audio-out'), [['', t('winDefault')], ...devices.audioOut.map((a) => [a.deviceId, a.label])], S.audioOut);
    $('#set-preview').checked = S.preview;
    $('#set-autoopen').checked = S.autoOpen;
    $('#set-sounds').checked = S.sounds;
    $('#set-virtual').checked = S.showVirtual;
    $('#modal').classList.remove('hidden');
    $('#modal-close').focus();
  }
  function screen_w() { return window.screen.width; }
  function screen_h() { return window.screen.height; }

  async function closeSettings() {
    $('#modal').classList.add('hidden');
    const before = { res: S.res, fps: S.fps, showVirtual: S.showVirtual, preview: S.preview, lang: S.lang };
    const audioBefore = cur.video ? (S.audioMap[cur.video.label] || 'auto') : null;

    S.res = $('#set-res').value;
    S.fps = Number($('#set-fps').value);
    S.audioOut = $('#set-audio-out').value;
    S.preview = $('#set-preview').checked;
    S.autoOpen = $('#set-autoopen').checked;
    S.sounds = $('#set-sounds').checked;
    S.showVirtual = $('#set-virtual').checked;
    S.lang = $('#set-lang').value;
    if (screen === 'viewer' && cur.video) S.audioMap[cur.video.label] = $('#set-audio-in').value;
    saveSettings();
    applyAudioOutput();

    const langChanged = before.lang !== S.lang;
    if (langChanged) {
      I.setLang(S.lang);
      tickClock();
      setFsUi(isFs);
      updateAudioUi();
    }

    if (screen === 'home' && langChanged) {
      await refreshDevices();
      renderGrid();
      startPreviews();
    }

    if (screen === 'viewer' && cur.video) {
      if (before.res !== S.res || before.fps !== S.fps) {
        await startCapture();
      } else if (audioBefore !== S.audioMap[cur.video.label]) {
        await startAudio(cur.token);
      }
      wakeHud();
    } else if (screen === 'home' && (before.showVirtual !== S.showVirtual || before.preview !== S.preview)) {
      stopPreviews();
      await refreshDevices();
      renderGrid();
      startPreviews();
    }
  }
  $('#modal-close').addEventListener('click', closeSettings);
  $('#modal').addEventListener('mousedown', (e) => { if (e.target.id === 'modal') closeSettings(); });

  document.addEventListener('keydown', async (e) => {
    const modalOpen = !$('#modal').classList.contains('hidden');
    if (e.key === 'Escape') {
      if (modalOpen) return closeSettings();
      if (document.body.classList.contains('is-fullscreen')) return N.setFullscreen(false);
      return;
    }
    if (modalOpen || screen !== 'viewer') return;
    wakeHud();
    const k = e.key.toLowerCase();
    if (e.key === 'F11' || k === 'f') { e.preventDefault(); toggleFs(); }
    else if (k === 'm') { S.muted = !S.muted; applyVolume(); saveSettings(); }
    else if (e.key === 'ArrowUp') { S.volume = Math.min(150, S.volume + 5); S.muted = false; applyVolume(); saveSettings(); }
    else if (e.key === 'ArrowDown') { S.volume = Math.max(0, S.volume - 5); applyVolume(); saveSettings(); }
    else if (e.key === 'Backspace') { $('#btn-back').click(); }
  });

  let changeTimer = null;
  md.addEventListener('devicechange', () => {
    clearTimeout(changeTimer);
    changeTimer = setTimeout(async () => {
      if (screen === 'home') {
        stopPreviews();
        await refreshDevices();
        renderGrid();
        startPreviews();
        return;
      }
      await refreshDevices();
      if (screen !== 'viewer' || !cur.video) return;
      const again = devices.video.find((v) => v.deviceId === cur.video.deviceId) ||
                    devices.video.find((v) => v.label === cur.video.label);
      if (!again) {
        if (!cur.waiting && cur.vstream) onDisconnected();
      } else if (cur.waiting || cur.error) {
        cur.video = again;
        cur.waiting = false;
        startCapture();
      } else if (cur.audioDev && !devices.audioIn.some((a) => a.deviceId === cur.audioDev.deviceId)) {
        startAudio(cur.token);
      }
    }, 700);
  });

  window.__evlDebug = () => ({
    screen,
    permProblem,
    video: devices.video.map((v) => v.label + ' [' + v.kind + ']'),
    audioIn: devices.audioIn.map((a) => a.label),
    previews: previews.size,
    current: cur.video ? {
      label: cur.video.label,
      settings: cur.vstream ? cur.vstream.getVideoTracks()[0].getSettings() : null,
      audio: cur.audioDev ? cur.audioDev.label : null,
      audioSettings: cur.astream ? cur.astream.getAudioTracks()[0].getSettings() : null,
      audioError: cur.audioError || null,
      audioCtx: audioCtx ? audioCtx.state : null,
      vuLevel: cur.vuLevel || 0,
      status: $('#status').classList.contains('hidden') ? null : $('#status-text').textContent,
    } : null,
  });

  (async () => {
    N.version().then((v) => { if (v) $('#version').textContent = 'EVL VideoSystem v' + v; });
    applyVolume();
    await goHome();
    if (S.autoOpen && S.lastDevice) {
      const last = devices.video.find((v) => v.label === S.lastDevice);
      if (last) openDevice(last);
    }
  })();
})();
