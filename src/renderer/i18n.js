(function (root) {
  const DICT = {
    pt: {
      devices: 'Dispositivos',
      settings: 'Configurações',
      refresh: 'Procurar dispositivos',
      mute: 'Mudo (M)',
      volume: 'Volume',
      vuTitle: 'Sinal de áudio da placa',
      menu: 'Menu',
      adjust: 'Ajustes',
      fullscreen: 'Tela cheia',
      exitFullscreen: 'Sair da tela cheia',
      thisDevice: 'Este dispositivo',
      cardAudio: 'Áudio da placa',
      cardAudioHint: 'O áudio da placa é tocado nas suas caixas/fone (saída do Windows), sem filtros de voz.',
      video: 'Vídeo',
      resolution: 'Resolução',
      resDefault: '1920 × 1080 (padrão)',
      resMonitor: 'Resolução do monitor',
      fps: 'Quadros por segundo',
      noStretchHint: 'A imagem nunca é esticada: se o formato não bater com a janela, aparecem barras pretas.',
      audio: 'Áudio',
      playOn: 'Tocar o áudio em',
      general: 'Geral',
      language: 'Idioma',
      langAuto: 'Automático (do Windows)',
      optPreview: 'Prévia ao vivo no menu',
      optAutoOpen: 'Abrir o último dispositivo ao iniciar',
      optSounds: 'Sons do menu',
      optVirtual: 'Mostrar câmeras virtuais',
      optVirtualHint: '(não recomendado: podem mostrar a sua própria tela)',
      ok: 'OK',
      kindCapture: 'Placa de captura',
      kindCamera: 'Câmera',
      inUseShort: 'Em uso por outro programa',
      noPreview: 'Sem prévia',
      permBlocked: 'O Windows está bloqueando o acesso às placas de captura.\nAtive "Permitir que aplicativos da área de trabalho acessem a câmera".',
      openWinSettings: 'Abrir configurações do Windows',
      noDevices: 'Nenhuma placa de captura encontrada.\nConecte a placa (USB ou HDMI) — ela aparece aqui sozinha.',
      connecting: 'Conectando a {name}…',
      retry: 'Tentar de novo',
      inUse: 'Esta placa está sendo usada por outro programa (ex.: OBS, Discord, navegador).\nFeche o outro programa e tente de novo.',
      notFound: 'Dispositivo não encontrado. Ele foi desconectado?',
      openFailed: 'Não foi possível abrir o dispositivo ({err}).',
      disconnected: 'Dispositivo desconectado.\nAguardando reconexão…',
      noAudio: 'Sem áudio',
      audioNotFound: 'Áudio da placa não encontrado — escolha em Ajustes',
      audioFailed: 'Não foi possível abrir o áudio ({err})',
      audioLabel: 'Áudio: {name}',
      auto: 'Automático',
      notFoundShort: 'não encontrado',
      winDefault: 'Padrão do Windows',
      videoDevice: 'Dispositivo de vídeo {n}',
      audioInput: 'Entrada de áudio {n}',
      audioOutput: 'Saída de áudio {n}',
    },
    en: {
      devices: 'Devices',
      settings: 'Settings',
      refresh: 'Search for devices',
      mute: 'Mute (M)',
      volume: 'Volume',
      vuTitle: 'Capture card audio signal',
      menu: 'Menu',
      adjust: 'Settings',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit fullscreen',
      thisDevice: 'This device',
      cardAudio: 'Capture card audio',
      cardAudioHint: 'The capture card audio plays on your speakers/headphones (Windows output), with no voice filters.',
      video: 'Video',
      resolution: 'Resolution',
      resDefault: '1920 × 1080 (default)',
      resMonitor: 'Monitor resolution',
      fps: 'Frames per second',
      noStretchHint: 'The image is never stretched: if its shape doesn\'t match the window, black bars appear.',
      audio: 'Audio',
      playOn: 'Play audio on',
      general: 'General',
      language: 'Language',
      langAuto: 'Automatic (from Windows)',
      optPreview: 'Live preview in the menu',
      optAutoOpen: 'Open the last device on startup',
      optSounds: 'Menu sounds',
      optVirtual: 'Show virtual cameras',
      optVirtualHint: '(not recommended: they may show your own screen)',
      ok: 'OK',
      kindCapture: 'Capture card',
      kindCamera: 'Camera',
      inUseShort: 'In use by another program',
      noPreview: 'No preview',
      permBlocked: 'Windows is blocking access to capture cards.\nTurn on "Let desktop apps access your camera".',
      openWinSettings: 'Open Windows settings',
      noDevices: 'No capture card found.\nConnect your card (USB or HDMI) — it will show up here on its own.',
      connecting: 'Connecting to {name}…',
      retry: 'Try again',
      inUse: 'This card is being used by another program (e.g. OBS, Discord, a browser).\nClose the other program and try again.',
      notFound: 'Device not found. Was it disconnected?',
      openFailed: 'Could not open the device ({err}).',
      disconnected: 'Device disconnected.\nWaiting for it to reconnect…',
      noAudio: 'No audio',
      audioNotFound: 'Capture card audio not found — pick it in Settings',
      audioFailed: 'Could not open the audio ({err})',
      audioLabel: 'Audio: {name}',
      auto: 'Automatic',
      notFoundShort: 'not found',
      winDefault: 'Windows default',
      videoDevice: 'Video device {n}',
      audioInput: 'Audio input {n}',
      audioOutput: 'Audio output {n}',
    },
    es: {
      devices: 'Dispositivos',
      settings: 'Configuración',
      refresh: 'Buscar dispositivos',
      mute: 'Silenciar (M)',
      volume: 'Volumen',
      vuTitle: 'Señal de audio de la capturadora',
      menu: 'Menú',
      adjust: 'Ajustes',
      fullscreen: 'Pantalla completa',
      exitFullscreen: 'Salir de pantalla completa',
      thisDevice: 'Este dispositivo',
      cardAudio: 'Audio de la capturadora',
      cardAudioHint: 'El audio de la capturadora se reproduce en tus altavoces/auriculares (salida de Windows), sin filtros de voz.',
      video: 'Vídeo',
      resolution: 'Resolución',
      resDefault: '1920 × 1080 (predeterminado)',
      resMonitor: 'Resolución del monitor',
      fps: 'Fotogramas por segundo',
      noStretchHint: 'La imagen nunca se estira: si el formato no coincide con la ventana, aparecen barras negras.',
      audio: 'Audio',
      playOn: 'Reproducir audio en',
      general: 'General',
      language: 'Idioma',
      langAuto: 'Automático (de Windows)',
      optPreview: 'Vista previa en vivo en el menú',
      optAutoOpen: 'Abrir el último dispositivo al iniciar',
      optSounds: 'Sonidos del menú',
      optVirtual: 'Mostrar cámaras virtuales',
      optVirtualHint: '(no recomendado: pueden mostrar tu propia pantalla)',
      ok: 'OK',
      kindCapture: 'Capturadora',
      kindCamera: 'Cámara',
      inUseShort: 'En uso por otro programa',
      noPreview: 'Sin vista previa',
      permBlocked: 'Windows está bloqueando el acceso a las capturadoras.\nActiva "Permitir que las aplicaciones de escritorio accedan a la cámara".',
      openWinSettings: 'Abrir configuración de Windows',
      noDevices: 'No se encontró ninguna capturadora.\nConecta la capturadora (USB o HDMI): aparecerá aquí sola.',
      connecting: 'Conectando con {name}…',
      retry: 'Reintentar',
      inUse: 'Otro programa está usando esta capturadora (p. ej., OBS, Discord, el navegador).\nCierra el otro programa e inténtalo de nuevo.',
      notFound: 'Dispositivo no encontrado. ¿Se desconectó?',
      openFailed: 'No se pudo abrir el dispositivo ({err}).',
      disconnected: 'Dispositivo desconectado.\nEsperando a que se reconecte…',
      noAudio: 'Sin audio',
      audioNotFound: 'No se encontró el audio de la capturadora: elígelo en Ajustes',
      audioFailed: 'No se pudo abrir el audio ({err})',
      audioLabel: 'Audio: {name}',
      auto: 'Automático',
      notFoundShort: 'no encontrado',
      winDefault: 'Predeterminado de Windows',
      videoDevice: 'Dispositivo de vídeo {n}',
      audioInput: 'Entrada de audio {n}',
      audioOutput: 'Salida de audio {n}',
    },
  };

  const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' };
  let lang = 'pt';

  function detect() {
    const l = String(navigator.language || 'en').toLowerCase();
    if (l.startsWith('pt')) return 'pt';
    if (l.startsWith('es')) return 'es';
    return 'en';
  }

  function t(key, vars) {
    let s = (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
    if (vars) for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  function locale() {
    const sys = navigator.language || '';
    if (lang === 'pt') return 'pt-BR';
    if (lang === 'es') return sys.toLowerCase().startsWith('es') ? sys : 'es-ES';
    return sys.toLowerCase().startsWith('en') ? sys : 'en-US';
  }

  function apply() {
    document.documentElement.lang = HTML_LANG[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  }

  function setLang(pref) {
    lang = pref && pref !== 'auto' && DICT[pref] ? pref : detect();
    apply();
    return lang;
  }

  root.EVLi18n = { t, setLang, locale, current: () => lang };
  root.EVLt = t;
})(window);
