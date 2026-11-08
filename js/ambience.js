// Geluid op de achtergrond: een zachte, gegenereerde geluidsomgeving per kamer, gemaakt met de Web Audio API (geen
// geluidsbestanden). Volgt de knop Geluid, is stil op het titelscherm en in een verborgen tabblad, en verandert met het
// verhaal mee (de stoommachine, de muziek op de kade, het feest). ambKey() bepaalt wat er nu moet klinken.

const AMB = { cur: null, master: null, nodes: [], timers: [] };
let noiseBuf = null;

function audioCtx(){ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; }

/* Wat er nu moet klinken, als sleutel zoals 'boot+engine'. null is stilte. */
function ambKey(){
  if(!soundOn || !S.started || !$('#title').hidden || document.visibilityState !== 'visible') return null;
  const f = S.f;
  switch(S.scene){
    case 'boot': return 'boot' + (f.engine && !f.lock ? '+engine' : '') + (f.lock ? '+quay' : '');
    case 'ruim': return 'ruim' + (f.engine && !f.lock ? '+engine' : '');
    case 'kamer': return 'kamer';
    case 'keuken': return 'keuken';
    case 'dak': case 'dak2': return 'dak' + (f.gust && !f.wind ? '+gust' : '');
    case 'werk': return 'werk' + (f.uitgepakt ? '+blij' : '');
    case 'magazijn': return 'magazijn';
    case 'gang': if(S.ch === 2) return 'kamer';
    // falls through
    case 'feest': return 'feest' + (f.out5 ? '+cheer' : '');
  }
  return null;
}
function ambUpdate(){
  let want = null;
  try{ want = ambKey(); }catch(e){}
  if(!want) stopSinging();
  if(want === AMB.cur) return;
  ambStop();
  AMB.cur = want;
  if(want){ try{ ambStart(want); }catch(e){ AMB.cur = null; } }
}

function ambStop(){
  AMB.timers.forEach(clearTimeout); AMB.timers = []; AMB.music = null;
  const m = AMB.master, nodes = AMB.nodes;
  AMB.master = null; AMB.nodes = [];
  if(!m || !ac) return;
  m.gain.cancelScheduledValues(ac.currentTime);
  m.gain.setTargetAtTime(0, ac.currentTime, .25);
  setTimeout(() => { nodes.forEach(n => { try{ n.stop && n.stop(); }catch(e){} try{ n.disconnect(); }catch(e){} }); try{ m.disconnect(); }catch(e){} }, 1500);
}

function ambStart(key){
  const ctx = audioCtx();
  if(ctx.state === 'suspended') ctx.resume().catch(() => {});
  const m = ctx.createGain();
  m.gain.value = 0; m.connect(ctx.destination); m.gain.setTargetAtTime(.9, ctx.currentTime, .8);
  AMB.master = m;
  const [scene, ...mods] = key.split('+');
  SOUNDSCAPES[scene](m, mods);
}

/* ---------- building blocks ---------- */
const keep = n => (AMB.nodes.push(n), n);

function noiseBuffer(){
  if(noiseBuf) return noiseBuf;
  const ctx = audioCtx(), b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
  for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf = b;
}

/* A steady bed of filtered noise (fans, wind, water). wobble makes it swell slowly. */
function bed(out, { type = 'lowpass', freq = 500, q = .7, gain = .02, wobble = 0, rate = .2 } = {}){
  const src = keep(ac.createBufferSource()); src.buffer = noiseBuffer(); src.loop = true;
  const f = keep(ac.createBiquadFilter()); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = keep(ac.createGain()); g.gain.value = gain;
  src.connect(f); f.connect(g); g.connect(out); src.start();
  if(wobble){ const l = keep(ac.createOscillator()); l.frequency.value = rate; const lg = keep(ac.createGain()); lg.gain.value = gain * wobble; l.connect(lg); lg.connect(g.gain); l.start(); }
  return g;
}

/* A constant tone (mains hum, motors). */
function hum(out, freq, gain, type = 'sine', lowpass){
  const o = keep(ac.createOscillator()); o.type = type; o.frequency.value = freq;
  const g = keep(ac.createGain()); g.gain.value = gain;
  if(lowpass){ const f = keep(ac.createBiquadFilter()); f.type = 'lowpass'; f.frequency.value = lowpass; o.connect(f); f.connect(g); } else o.connect(g);
  g.connect(out); o.start();
}

/* One short tone, optionally gliding to another pitch (chirps, drips, seagulls). */
function blip(out, freq, dur, vol, type = 'sine', glideTo){
  if(!AMB.master) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
}

/* One short burst of noise (crackles, footsteps, breath). */
function burst(out, dur, vol, freq = 2000, type = 'bandpass'){
  if(!AMB.master) return;
  const t = ac.currentTime, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuffer(); f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + .05);
}

/* Run fn every min–max milliseconds while this soundscape plays. */
function every(min, max, fn){
  const tick = () => { if(!AMB.master) return; try{ fn(); }catch(e){} AMB.timers.push(setTimeout(tick, min + Math.random() * (max - min))); };
  AMB.timers.push(setTimeout(tick, 300 + Math.random() * min));
}
const later = (ms, fn) => AMB.timers.push(setTimeout(() => AMB.master && fn(), ms));

/* Speel liedjes uit js/liedjes.js steeds opnieuw (om de beurt) zolang deze geluidsomgeving klinkt, met gap ms ertussen.
   Ze gaan via AMB.music, zodat ze even zwijgen als iemand in het verhaal zingt (singSong). */
function songLoop(out, ids, kind, vol, gap, first = 1200, octave = 0, lowpass){
  const mg = keep(ac.createGain()); mg.connect(out); AMB.music = mg;
  let i = 0;
  const next = () => { if(!AMB.master) return; const dur = playSong(ids[i++ % ids.length], { out: mg, kind, vol, octave, lowpass }); AMB.timers.push(setTimeout(next, dur * 1000 + gap)); };
  AMB.timers.push(setTimeout(next, first));
}

/* ---------- een geluidsomgeving per kamer ---------- */
const SOUNDSCAPES = {
  // Hoofdstuk 1, de stoomboot: kabbelend water en meeuwen; het puffen van de stoommachine als hij draait;
  // aan de kade een zacht fanfaretje en vrolijke kinderen.
  boot(m, mods){
    bed(m, { freq: 420, gain: .025, wobble: .7, rate: .12 });
    every(6000, 13000, () => [0, 1, 2].forEach(i => later(i * 180, () => blip(m, 1500 + Math.random() * 300, .18, .012, 'sine', 1100))));
    if(mods.includes('engine')) every(520, 520, () => burst(m, .18, .03, 400, 'lowpass'));
    // aan de kade speelt de fanfare "Zie ginds komt de stoomboot", steeds opnieuw, met wat gejuich ertussen
    if(mods.includes('quay')){
      bed(m, { type: 'bandpass', freq: 900, q: .5, gain: .018, wobble: .5, rate: .2 });
      songLoop(m, ['stoomboot'], 'fanfare', .016, 2500);
    }
  },
  // Hoofdstuk 1, het ruim: klotsend water onder de planken, krakend hout, af en toe een druppel.
  ruim(m, mods){
    bed(m, { freq: 260, gain: .03, wobble: .8, rate: .1 });
    every(2500, 6000, () => blip(m, 140 + Math.random() * 60, .5, .012, 'triangle', 90));
    every(1500, 4000, () => blip(m, 900 + Math.random() * 300, .12, .02, 'sine', 500));
    if(mods.includes('engine')) every(520, 520, () => burst(m, .18, .04, 300, 'lowpass'));
  },
  // Hoofdstuk 2, de keuken: het zoemen van de koelkast en de kookwekker die tikt.
  keuken(m){
    hum(m, 50, .008, 'sawtooth', 200);
    every(500, 500, () => burst(m, .02, .01, 4200));
  },
  // Hoofdstuk 2, de woonkamer: een knisperende houtkachel en een tikkende klok.
  kamer(m){
    bed(m, { freq: 180, gain: .025, wobble: .4, rate: .3 });
    every(80, 420, () => burst(m, .04 + Math.random() * .06, .01 + Math.random() * .025, 1800 + Math.random() * 2500, 'highpass'));
    every(1000, 1000, () => burst(m, .03, .015, 3800));
  },
  // Hoofdstuk 3, op het dak: wind, een uil in de verte, het getik van hoefjes over de pannen, en zacht gezang uit een schoorsteen.
  dak(m, mods){
    bed(m, { type: 'bandpass', freq: 600, q: .4, gain: .02, wobble: .9, rate: .07 });
    every(12000, 22000, () => { blip(m, 420, .35, .015, 'sine', 380); later(500, () => blip(m, 400, .55, .015, 'sine', 360)); });
    every(9000, 16000, () => [0, 1, 2, 3, 4, 5].forEach(i => later(i * 170, () => burst(m, .04, .02, 2600, 'bandpass'))));
    if(mods.includes('gust')) bed(m, { type: 'bandpass', freq: 900, q: .6, gain: .03, wobble: .9, rate: .3 });
    // heel zacht, uit een schoorsteen: kinderen die nog bij de kachel zingen
    else songLoop(m, ['paardenvoetjes', 'daken'], 'zang', .01, 18000, 6000, 0, 900);
  },
  // Hoofdstuk 4, de werkkamer van Sint: een tikkende klok, het geruis van de tv, af en toe de telefoon;
  // als het boek terug is speelt de tv "Zie ginds komt de stoomboot".
  werk(m, mods){
    bed(m, { freq: 300, gain: .015, wobble: .3, rate: .2 });
    every(1000, 1000, () => burst(m, .03, .014, 3600));
    if(mods.includes('blij')) songLoop(m, ['stoomboot'], 'speeldoos', .012, 5000, 1500);
    else every(14000, 26000, () => [0, 1].forEach(i => later(i * 420, () => blip(m, 880, .12, .012, 'square', 860))));
  },
  // Hoofdstuk 4, het magazijn: de lopende band, het zoemen van de grijparm, en het knisperen van papier.
  magazijn(m){
    hum(m, 70, .007, 'sawtooth', 300);
    every(600, 600, () => burst(m, .05, .012, 900, 'lowpass'));
    every(4000, 9000, () => burst(m, .4, .012, 5000, 'highpass'));
  },
  // Hoofdstuk 5, pakjesavond: de kachel, gezellig gemurmel, en oude liedjes op de speeldoos; aan het eind gejuich.
  feest(m, mods){
    bed(m, { freq: 200, gain: .018, wobble: .4, rate: .3 });
    every(120, 500, () => burst(m, .04, .012, 2200 + Math.random() * 2000, 'highpass'));
    // een speeldoos speelt de oude liedjes, om de beurt
    songLoop(m, ['maan', 'kloppen', 'kapoentje', 'wind'], 'speeldoos', .014, 6000, 1500, 1);
    if(mods.includes('cheer')) every(3000, 6000, () => burst(m, 1, .02, 1500, 'bandpass'));
  }
};

/* Het geluid bijhouden. Browsers laten pas geluid toe als je een keer hebt geklikt of getikt. */
setInterval(ambUpdate, 700);
document.addEventListener('visibilitychange', ambUpdate);
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if(ac && ac.state === 'suspended') ac.resume().catch(() => {}); ambUpdate(); }, { passive: true }));
