(function (root) {
  const VIRTUAL = /(virtual|obs[\s-]?cam|obs virtual|vcam|streamlabs|xsplit|manycam|snap camera|splitcam|screen[\s-]?capture|desktop|e2esoft|mmhmm|camtwist|nvidia broadcast|logi capture|youcam|camo\b|chromacam)/i;

  const CAPTURE = /(capture|hdmi|elgato|game ?capture|cam ?link|hd60|4k60|4k ?x|4k ?s|avermedia|live ?gamer|live ?streamer|gc5\d\d|gc3\d\d|gc\d{3}|ugreen|usb ?video|usb3\.? ?0 ?capture|ms21\d\d|razer ripsaw|ripsaw|magewell|blackmagic|decklink|epiphan|startech|j5create|mirabox|ezcap|genki|shadowcast|nzxt signal|evga xr1|acasis|guermok|rybozen|digitnow|video grabber|av to usb|uvc capture|hdmi to usb|usb3\.0 video)/i;

  const CAPTURE_AUDIO = /(capture|hdmi|elgato|game ?capture|cam ?link|hd60|4k60|avermedia|live ?gamer|ms21\d\d|usb digital audio|digital audio interface|ugreen|ezcap|genki|ripsaw|magewell|blackmagic|decklink|line ?in)/i;

  const MIC_LIKE = /(microphone|microfone|\bmic\b|headset|array|realtek|webcam|stereo mix|mixagem est[eé]reo|steam streaming|virtual|voicemeeter|cable output|nvidia broadcast)/i;

  const GENERIC_WORDS = new Set([
    'usb', 'audio', 'video', 'device', 'digital', 'interface', 'microphone', 'microfone', 'mic', 'input',
    'entrada', 'the', 'and', 'with', 'for', 'default', 'padrao', 'padrão', 'communications', 'comunicacoes',
    'comunicações', 'high', 'definition', 'line', 'linha', 'stream', 'camera', 'câmera', 'cam',
  ]);

  function fallbackName(key, n, pt) {
    return root.EVLt ? root.EVLt(key, { n }) : pt.replace('{n}', n);
  }

  function cleanLabel(label) {
    return String(label || '')
      .replace(/^(default|padr[aã]o|communications|comunica[cç][oõ]es)\s*-\s*/i, '')
      .replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, '')
      .trim();
  }

  function tokens(label) {
    return cleanLabel(label)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 2 && !GENERIC_WORDS.has(t));
  }

  function isVirtual(label) {
    return VIRTUAL.test(label || '');
  }

  function kindOf(label) {
    return CAPTURE.test(label || '') ? 'capture' : 'camera';
  }

  function filterVideo(devices, opts) {
    const showVirtual = opts && opts.showVirtual;
    return devices
      .filter((d) => d.kind === 'videoinput')
      .filter((d) => showVirtual || !isVirtual(d.label))
      .map((d, i) => ({
        deviceId: d.deviceId,
        groupId: d.groupId,
        label: cleanLabel(d.label) || fallbackName('videoDevice', i + 1, 'Dispositivo de vídeo {n}'),
        kind: kindOf(d.label),
      }))
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'capture' ? -1 : 1));
  }

  function audioInputs(devices) {
    return devices
      .filter((d) => d.kind === 'audioinput')
      .filter((d) => d.deviceId !== 'default' && d.deviceId !== 'communications')
      .map((d, i) => ({ deviceId: d.deviceId, groupId: d.groupId, label: cleanLabel(d.label) || fallbackName('audioInput', i + 1, 'Entrada de áudio {n}') }));
  }

  function audioOutputs(devices) {
    return devices
      .filter((d) => d.kind === 'audiooutput')
      .filter((d) => d.deviceId !== 'default' && d.deviceId !== 'communications')
      .map((d, i) => ({ deviceId: d.deviceId, label: cleanLabel(d.label) || fallbackName('audioOutput', i + 1, 'Saída de áudio {n}') }));
  }

  function scoreAudio(video, audio) {
    let score = 0;
    if (video.groupId && audio.groupId && video.groupId === audio.groupId) score += 100;
    const vt = new Set(tokens(video.label));
    const at = tokens(audio.label);
    for (const t of at) if (vt.has(t)) score += 12;
    const isCapture = video.kind === 'capture' || CAPTURE.test(video.label);
    if (isCapture) {
      if (CAPTURE_AUDIO.test(audio.label)) score += 8;
      if (MIC_LIKE.test(audio.label)) score -= 10;
      if (vt.size === 0 && at.length === 0) score += 4;
    }
    return score;
  }

  function pairAudio(video, audios) {
    let best = null;
    let bestScore = 0;
    for (const a of audios) {
      const s = scoreAudio(video, a);
      if (s > bestScore) {
        best = a;
        bestScore = s;
      }
    }
    return best;
  }

  const api = { isVirtual, kindOf, filterVideo, audioInputs, audioOutputs, pairAudio, scoreAudio, cleanLabel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EVLDevices = api;
})(typeof window !== 'undefined' ? window : globalThis);
