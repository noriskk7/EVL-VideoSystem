const D = require('../src/renderer/devices.js');
let fail = 0;
const check = (name, cond) => { console.log((cond ? 'OK   ' : 'FALHA') + '  ' + name); if (!cond) fail++; };

const audios = D.audioInputs([
  { kind: 'audioinput', deviceId: 'default', label: 'Padrão - Microfone (Realtek(R) Audio)' },
  { kind: 'audioinput', deviceId: 'mic', label: 'Microfone (Realtek(R) Audio)' },
  { kind: 'audioinput', deviceId: 'hd60', label: 'Game Capture HD60 S Audio' },
  { kind: 'audioinput', deviceId: 'ms2109', label: 'Digital Audio Interface (USB Digital Audio)' },
  { kind: 'audioinput', deviceId: 'camlink', label: 'Cam Link 4K (0fd9:0066)' },
  { kind: 'audioinput', deviceId: 'avm', label: 'Live Gamer Ultra-Audio' },
  { kind: 'audioinput', deviceId: 'u3', label: 'Digital Audio Interface (USB3. 0 capture)' },
  { kind: 'audioinput', deviceId: 'webcam', label: 'Microfone (HD Pro Webcam C920)' },
]);

const vids = D.filterVideo([
  { kind: 'videoinput', deviceId: 'v-webcam', label: 'HD Pro Webcam C920 (046d:082d)' },
  { kind: 'videoinput', deviceId: 'v-obs', label: 'OBS Virtual Camera' },
  { kind: 'videoinput', deviceId: 'v-hd60', label: 'Game Capture HD60 S' },
  { kind: 'videoinput', deviceId: 'v-ms2109', label: 'USB Video' },
  { kind: 'videoinput', deviceId: 'v-camlink', label: 'Cam Link 4K (0fd9:0066)' },
  { kind: 'videoinput', deviceId: 'v-avm', label: 'Live Gamer Ultra-Video' },
  { kind: 'videoinput', deviceId: 'v-u3', label: 'USB3. 0 capture' },
  { kind: 'videoinput', deviceId: 'v-sl', label: 'Streamlabs Desktop Virtual Webcam' },
]);
const byId = Object.fromEntries(vids.map((v) => [v.deviceId, v]));

check('OBS Virtual Camera ignorada', !byId['v-obs']);
check('Streamlabs virtual ignorada', !byId['v-sl']);
check('placas aparecem antes da webcam', vids[vids.length - 1].deviceId === 'v-webcam');
check('HD60 S é placa', byId['v-hd60'].kind === 'capture');
check('USB Video (MS2109) é placa', byId['v-ms2109'].kind === 'capture');
check('webcam é câmera', byId['v-webcam'].kind === 'camera');

const pair = (id) => (D.pairAudio(byId[id], audios) || {}).deviceId;
check('HD60 S -> áudio HD60 S', pair('v-hd60') === 'hd60');
check('Cam Link -> áudio Cam Link', pair('v-camlink') === 'camlink');
check('AVerMedia -> áudio Live Gamer', pair('v-avm') === 'avm');
check('USB3.0 capture -> áudio USB3.0 capture', pair('v-u3') === 'u3');
check('USB Video -> Digital Audio Interface', ['ms2109', 'u3'].includes(pair('v-ms2109')));
check('Webcam -> microfone da webcam', pair('v-webcam') === 'webcam');
check('nunca pareia placa com microfone Realtek', !Object.keys(byId).filter((k) => k !== 'v-webcam').some((k) => pair(k) === 'mic'));
check('rótulo sem (vid:pid)', byId['v-camlink'].label === 'Cam Link 4K');

console.log(fail ? `\n${fail} falha(s)` : '\nTudo certo');
process.exit(fail ? 1 : 0);
