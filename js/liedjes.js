// De oude Sinterklaasliedjes: de melodieën en een kleine speler (Web Audio, geen geluidsbestanden).
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.
//
// Elk liedje is een lijst van "lettergreep=NOOT/tellen", gescheiden door spaties. Een nieuwe regel begint een nieuwe
// zin. De noot is een naam met een octaaf (C4 is de middelste C, A4 is 440 Hz); een rust schrijf je als R.
// Bijvoorbeeld: "Sin=G4/1 ter=E4/0.5" is "Sin" op G, één tel, en "ter" op E, een halve tel.
// De melodieën zijn uit het hoofd opgeschreven en met het oor gecontroleerd; klopt er een noot niet, verbeter hem hier.

const SONGS = {
  stoomboot: {
    title: 'Zie ginds komt de stoomboot', bpm: 132, maat: 3,
    noten: `Zie=G4/1 ginds=C5/1 komt=C5/1 de=C5/1 stoom=E5/1 boot=D5/1 uit=C5/1 Span=D5/1 je=D5/1 weer=D5/1 aan=B4/2 hij=G4/1
            brengt=D5/1 ons=D5/1 Sint=D5/1 Ni=F5/1 co=E5/1 laas=D5/1 ik=E5/1 zie=E5/1 hem=D5/1 al=C5/1 staan=C5/2`
  },
  kapoentje: {
    title: 'Sinterklaas kapoentje', bpm: 120, maat: 3,
    noten: `Sin=G4/1 ter=E4/0.5 klaas=G4/1 ka=E4/0.5 poen=A4/1.5 tje=G4/1.5
            gooi=G4/1 wat=E4/0.5 in=G4/1 mijn=E4/0.5 schoen=A4/1.5 tje=G4/1.5
            gooi=G4/1 wat=G4/0.5 in=F4/1 mijn=F4/0.5 laar=E4/1.5 sje=E4/1.5
            dank=D4/1 je=D4/0.5 Sin=E4/1 ter=D4/0.5 klaas=C4/1.5 je=C4/1.5`
  },
  paardenvoetjes: {
    title: 'Zachtjes gaan de paardenvoetjes', bpm: 108, maat: 4,
    noten: `Zacht=E4/1 jes=E4/1 gaan=G4/1 de=G4/1 paar=A4/1 den=A4/1 voet=G4/1 jes=G4/1
            trip=F4/1 pel=F4/1 trap=E4/1 pel=E4/1 trip=D4/1 pel=D4/1 trap=C4/2
            't=G4/1 is=G4/1 het=A4/1 paard=A4/1 van=G4/1 Sin=G4/1 ter=E4/1 klaas=E4/1
            trip=F4/1 pel=F4/1 trap=E4/1 pel=E4/1 trip=D4/1 pel=D4/1 trap=C4/2`
  },
  kloppen: {
    title: 'Hoor wie klopt daar kinderen', bpm: 116, maat: 4,
    noten: `Hoor=G4/1 wie=G4/1 klopt=G4/1 daar=E4/1 kin=G4/1 de=G4/0.5 ren=E4/1.5
            hoor=G4/1 wie=G4/1 klopt=G4/1 daar=E4/1 kin=G4/1 de=G4/0.5 ren=E4/1.5
            hoor=G4/1 wie=G4/1 tikt=A4/1 daar=G4/1 zacht=F4/1 jes=E4/1 te=D4/0.5 gen=E4/0.5 't=F4/1 raam=E4/2`
  }
};

/* "Sin=G4/1 …" → [{ syl, note, beats, line }]. Een noot zonder octaaf krijgt octaaf 4. */
function parseSong(txt){
  const out = [];
  String(txt).trim().split(/\n/).forEach((line, li) => line.trim().split(/\s+/).filter(Boolean).forEach(tok => {
    const m = tok.match(/^(.*?)=([A-GR][#b]?\d?)\/([\d.]+)$/i);
    if(m) out.push({ syl: m[1], note: m[2][0].toUpperCase() + m[2].slice(1), beats: +m[3], line: li });
  }));
  return out;
}
/* De frequentie van een noot als "G4", "F#5" of "Bb3". */
function noteHz(n){
  const m = String(n).match(/^([A-G])([#b]?)(\d)?$/); if(!m) return 0;
  const semi = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * Math.pow(2, (semi + 12 * ((m[3] ? +m[3] : 4) - 4)) / 12);
}

/* Een toon met een klankkleur: 'speeldoos' (zacht en helder), 'fanfare' (koperachtig) of 'fluit'. */
function songTone(ctx, out, hz, t, dur, kind, vol){
  const o = ctx.createOscillator(), g = ctx.createGain();
  let node = o;
  if(kind === 'fanfare'){ o.type = 'sawtooth'; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500; o.connect(f); node = f; }
  else o.type = kind === 'fluit' ? 'sine' : 'triangle';
  o.frequency.setValueAtTime(hz, t);
  const a = kind === 'speeldoos' ? .005 : .03, end = t + dur * (kind === 'speeldoos' ? 1.6 : .92);
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
/* Speel een liedje. Geeft de duur in seconden terug. opts: { kind, vol, out (een AudioNode), octave (+1 = hoger) }. */
let songTimer = null;
function playSong(id, opts = {}){
  const s = SONGS[id]; if(!s) return 0;
  let ctx; try{ ctx = ac = ac || new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ return 0; }
  if(ctx.state === 'suspended') ctx.resume().catch(() => {});
  const out = opts.out || ctx.destination, beat = 60 / s.bpm, shift = Math.pow(2, opts.octave || 0);
  let t = ctx.currentTime + .08;
  for(const n of parseSong(s.noten)){
    const dur = n.beats * beat;
    if(n.note !== 'R') songTone(ctx, out, noteHz(n.note) * shift, t, dur, opts.kind || 'speeldoos', opts.vol || .05);
    t += dur;
  }
  return t - ctx.currentTime;
}
/* Speel een liedje één keer als het geluid aan staat (voor momenten in het verhaal, zoals het kloppen op de deur). */
function singSong(id, opts){ if(soundOn) playSong(id, Object.assign({ kind: 'speeldoos', vol: .06 }, opts)); }
