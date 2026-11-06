// De oude Sinterklaasliedjes: de melodieën en een kleine speler (Web Audio, geen geluidsbestanden).
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.
//
// Elk liedje is een lijst van "lettergreep=NOOT/tellen", gescheiden door spaties. Een nieuwe regel begint een nieuwe
// zin. De noot is een naam met een octaaf (C4 is de middelste C, A4 is 440 Hz); een rust schrijf je als R. Een tel is
// een kwartnoot. "=G4/0.5" (zonder lettergreep) is een noot op dezelfde lettergreep; "G4/1" kan ook, zonder tekst.
// Alleen liedjes waarvan tekst én melodie vrij zijn: volksliedjes, of de maker is langer dan 70 jaar dood.
// De melodieën komen uit oude bladmuziek; klopt er een noot niet, verbeter hem hier en hij klopt overal.

const MAAN_LATER = `G4/0.5 G4/0.5 C5/1 C5/1 B4/0.5 A4/0.5 B4/2 B4/0.5 B4/0.5 A4/1 D5/1 B4/0.5 A4/0.5 G4/2
            G4/0.5 G4/0.5 G4/0.5 G4/0.5 G4/0.5 A4/0.5 B4/2 B4/0.5 B4/0.5 A4/1 G4/1 F#4/0.5 F#4/0.5 G4/2`;
const SONGS = {
  stoomboot: {
    title: 'Zie ginds komt de stoomboot', bron: 'Jan Schenkman, ca. 1850; op de wijs van "Im Märzen der Bauer"', bpm: 120,
    noten: `Zie=C4/0.5 ginds=F4/0.5 komt=F4/0.5 de=A4/0.5 stoom=G4/0.5 boot=G4/0.5 uit=Bb4/0.5 Span=E4/0.5 je=E4/0.5 weer=G4/0.5 aan=F4/1
            hij=C4/0.5 brengt=F4/0.5 ons=F4/0.5 Sint=A4/0.5 Ni=G4/0.25 co=G4/0.25 laas=G4/0.5 ik=Bb4/0.5 zie=E4/0.5 hem=E4/0.5 al=G4/0.5 staan=F4/1
            Hoe=C5/0.5 hup=G4/0.5 pelt=G4/0.5 zijn=C5/0.5 paard=A4/0.5 je=A4/0.5 het=C5/0.5 dek=Bb4/0.5 op=Bb4/0.5 en=A4/0.5 neer=G4/1
            hoe=C4/0.5 waai=F4/0.5 en=F4/0.25 =G4/0.25 de=A4/0.25 =Bb4/0.25 wim=C5/0.5 pels=A4/0.5 al=F4/0.5 heen=Bb4/0.5 en=G4/0.5 al=E4/0.5 weer=F4/1.5`
  },
  kapoentje: {
    title: 'Sinterklaas kapoentje', bron: 'volksliedje, opgetekend in 1851', bpm: 140,
    noten: `Sin=G4/0.75 ter=G4/0.25 klaas=A4/0.75 ka=A4/0.25 poen=G4/1 tje=E4/1
            gooi=G4/0.75 wat=G4/0.25 in=A4/0.75 mijn=A4/0.25 schoen=G4/1 tje=E4/1
            gooi=F4/0.75 wat=F4/0.25 in=F4/0.75 mijn=D4/0.25 laars=F4/1 je=F4/1
            dank=A4/0.75 u=G4/0.25 Sin=F4/0.75 ter=E4/0.25 klaas=D4/1 je=C4/2`
  },
  bonne: {
    title: 'Sinterklaasje, bonne, bonne, bonne', bron: 'volksliedje, opgetekend in 1851', bpm: 150,
    noten: `Sin=G4/1 ter=G4/1 klaas=A4/1 je=A4/1 bon=G4/0.5 ne=A4/0.5 bon=G4/0.5 ne=F4/0.5 bon=E4/1 ne=C4/1
            gooi=G4/1 wat=G4/1 in=A4/1 mijn=A4/1 le=G4/0.5 ge=A4/0.5 le=G4/0.5 ge=F4/0.5 ton=E4/1 ne=C4/1
            gooi=F4/1 wat=F4/1 in=F4/1 mijn=D4/1 laars=F4/2 je=F4/2
            dank=A4/1 u=G4/1 Sin=F4/1 ter=E4/1 klaas=D4/2 je=C4/2`
  },
  paardenvoetjes: {
    title: 'Zachtjes gaan de paardenvoetjes', bron: 'Simon Abramsz, 1911', bpm: 132,
    noten: `Zacht=C4/0.5 jes=C4/0.5 gaan=F4/1 de=F4/1 paar=F4/0.5 de=G4/0.5 voet=F4/0.5 =E4/0.5 jes=E4/2
            trip=G4/0.5 pel=C4/0.5 trap=G4/0.5 pel=C4/0.5 trip=G4/0.5 pel=A4/0.5 trap=F4/2
            't=C4/0.5 is=C4/0.5 het=F4/1 paard=F4/1 van=F4/0.5 Sin=G4/0.5 ter=F4/0.5 klaas=E4/0.5 je=E4/2
            stip=G4/0.5 pe=C4/0.5 stap=G4/0.5 pe=C4/0.5 stip=G4/0.5 pe=A4/0.5 stap=F4/2
            Schim=F4/0.5 mel=E4/0.5 tje=D4/1 draagt=E4/1 met=F4/0.5 ge=D4/0.5 mak=C4/2
            Sin=A3/0.5 ter=C4/0.5 klaas=Bb3/1 je=C4/1 o=D4/0.5 ver=Bb3/0.5 dak=A3/2
            Schim=C4/0.5 mel=C4/0.5 tje=D4/1 draagt=E4/1 met=F4/0.5 ge=G4/0.5 mak=A4/2
            Sin=F4/0.5 ter=A4/0.5 klaas=G4/1 je=D4/1 o=E4/0.5 ver=G4/0.5 dak=F4/2`
  },
  maan: {
    title: 'Zie, de maan schijnt door de bomen', bron: 'J.P. Heije en J.J. Viotta, 1845', bpm: 120,
    noten: `Zie=D4/0.5 de=D4/0.5 maan=G4/1 schijnt=G4/1 door=G4/0.5 de=A4/0.5 bo=B4/1 men=G4/1
            mak=A4/0.5 kers=A4/0.5 staakt=A4/0.5 uw=A4/0.5 wild=B4/0.5 ge=A4/0.5 raas=G4/2
            D4/0.5 D4/0.5 G4/1 G4/1 G4/0.5 A4/0.5 B4/1 G4/1
            A4/0.5 A4/0.5 A4/0.5 A4/0.5 B4/0.5 A4/0.5 G4/2
            ${MAAN_LATER}`
  },
  daken: {
    title: 'Op de hoge, hoge daken', bron: 'Simon Abramsz, 1911; op de wijs van "Zie, de maan schijnt door de bomen"', bpm: 130,
    noten: `Op=D4/0.5 de=D4/0.5 ho=G4/1 ge=G4/1 ho=G4/0.5 ge=A4/0.5 da=B4/1 ken=G4/1
            rijdt=A4/0.5 de=A4/0.5 bis=A4/0.5 schop=A4/0.5 met=B4/0.5 zijn=A4/0.5 knecht=G4/2
            D4/0.5 D4/0.5 G4/1 G4/1 G4/0.5 A4/0.5 B4/1 G4/1
            A4/0.5 A4/0.5 A4/0.5 A4/0.5 B4/0.5 A4/0.5 G4/2
            ${MAAN_LATER}`
  },
  wind: {
    title: 'Hoor de wind waait door de bomen', bron: 'volksliedje, ca. 1925', bpm: 110,
    noten: `C4/0.75 C4/0.25 A4/1 F4/1 C4/0.333 F4/0.333 A4/0.334 C5/1 A4/1 G4/0.75 A4/0.25 Bb4/1 G4/1 D4/0.75 E4/0.25 F4/2
            C4/0.75 C4/0.25 A4/1 F4/1 C4/0.333 F4/0.333 A4/0.334 C5/1 A4/1 G4/0.75 A4/0.25 Bb4/1 D5/1 C5/0.75 Bb4/0.25 A4/2
            G4/0.75 A4/0.25 Bb4/1 G4/1 D4/0.75 E4/0.25 F4/2`
  },
  kloppen: {
    title: 'Hoor wie klopt daar kinderen', bron: 'volksliedje, ca. 1925 (een deel van "Hoor de wind waait door de bomen")', bpm: 120,
    noten: `Hoor=C4/0.5 wie=C4/0.5 klopt=A4/0.5 daar=F4/0.5 kind=F4/0.5 ren=F4/0.5
            hoor=C4/0.5 wie=C4/0.5 klopt=A4/0.5 daar=F4/0.5 kind=F4/0.5 ren=F4/0.5
            hoor=C4/0.5 wie=C4/0.5 tikt=G4/0.5 daar=F#4/0.5 zacht=G4/0.5 jes=F#4/0.5 te=G4/0.5 gen=A4/0.5 raam=F4/2`
  }
};

/* "Sin=G4/1 …" → [{ syl, note, beats, line }]. Een noot zonder octaaf krijgt octaaf 4. */
function parseSong(txt){
  const out = [];
  String(txt).trim().split(/\n/).forEach((line, li) => line.trim().split(/\s+/).filter(Boolean).forEach(tok => {
    const m = tok.match(/^(?:(.*?)=)?([A-GR][#b]?\d?)\/([\d.]+)$/i);
    if(m) out.push({ syl: m[1] || '', note: m[2][0].toUpperCase() + m[2].slice(1), beats: +m[3], line: li });
  }));
  return out;
}
/* De frequentie van een noot als "G4", "F#5" of "Bb3". */
function noteHz(n){
  const m = String(n).match(/^([A-G])([#b]?)(\d)?$/); if(!m) return 0;
  const semi = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * Math.pow(2, (semi + 12 * ((m[3] ? +m[3] : 4) - 4)) / 12);
}

/* Een toon met een klankkleur: 'speeldoos' (zacht en helder), 'fanfare' (koperachtig), 'fluit' of 'zang' (met trilling). */
function songTone(ctx, out, hz, t, dur, kind, vol){
  const o = ctx.createOscillator(), g = ctx.createGain();
  let node = o;
  if(kind === 'fanfare'){ o.type = 'sawtooth'; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500; o.connect(f); node = f; }
  else o.type = kind === 'fluit' ? 'sine' : 'triangle';
  o.frequency.setValueAtTime(hz, t);
  if(kind === 'zang'){ const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = hz * .012; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + .1); }
  const a = kind === 'speeldoos' ? .005 : kind === 'zang' ? .04 : .03, end = t + dur * (kind === 'speeldoos' ? 1.6 : .92);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(kind === 'speeldoos' ? .0001 : vol * .6, kind === 'speeldoos' ? end : t + dur * .7);
  g.gain.exponentialRampToValueAtTime(.0001, end);
  node.connect(g); g.connect(out); o.start(t); o.stop(end + .05);
  if(kind === 'speeldoos'){   // een belletje een octaaf hoger maakt het een speeldoos
    const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.type = 'sine'; o2.frequency.value = hz * 2;
    g2.gain.setValueAtTime(vol * .35, t); g2.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o2.connect(g2); g2.connect(out); o2.start(t); o2.stop(t + dur + .05);
  }
}
/* Speel een liedje. Geeft de duur in seconden terug. opts: { kind, vol, out (een AudioNode), octave (+1 = hoger), lowpass (Hz) }. */
function playSong(id, opts = {}){
  const s = SONGS[id]; if(!s) return 0;
  let ctx; try{ ctx = ac = ac || new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ return 0; }
  if(ctx.state === 'suspended') ctx.resume().catch(() => {});
  let out = opts.out || ctx.destination;
  if(opts.lowpass){ const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opts.lowpass; f.connect(out); out = f; }
  const beat = 60 / s.bpm, shift = Math.pow(2, opts.octave || 0);
  let t = ctx.currentTime + .08;
  for(const n of parseSong(s.noten)){
    const dur = n.beats * beat;
    if(n.note !== 'R') songTone(ctx, out, noteHz(n.note) * shift, t, dur, opts.kind || 'speeldoos', opts.vol || .05);
    t += dur;
  }
  return t - ctx.currentTime;
}

/* Iemand zingt een liedje in het verhaal (een regel ['sys', '♪ … ♪', 'kapoentje'] in say(), zie core.js). Volgt de knop
   Geluid; de liedjes op de achtergrond (songLoop in js/ambience.js) zwijgen zolang. */
let singing = null;
function singSong(id, opts){
  if(!soundOn || !SONGS[id]) return;
  try{
    stopSinging();
    const ctx = ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const g = ctx.createGain(); g.connect(ctx.destination);
    const dur = playSong(id, Object.assign({ kind: 'zang', vol: .07, out: g }, opts));
    singing = g;
    if(typeof AMB !== 'undefined' && AMB.music){ AMB.music.gain.setTargetAtTime(0, ctx.currentTime, .15); AMB.music.gain.setTargetAtTime(1, ctx.currentTime + dur + .5, .8); }
  }catch(e){}
}
function stopSinging(){
  if(!singing) return;
  const g = singing; singing = null;
  g.gain.setTargetAtTime(0, ac.currentTime, .08);
  setTimeout(() => { try{ g.disconnect(); }catch(e){} }, 500);
  if(typeof AMB !== 'undefined' && AMB.music) AMB.music.gain.setTargetAtTime(1, ac.currentTime + .5, .8);
}
