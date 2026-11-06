// Hoofdstukken en eindschermen, de knoppen (hint, toon, geluid, beweging), de klok, prestaties, scores, het titelmenu,
// de installeerbare app en het opstarten. Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde ruimte.

/* ---------- hoofdstukken ---------- */
const LAST_CH = 4;   // het nieuwste hoofdstuk; verhoog het als je er een toevoegt
const START = { 1: () => startNew(), 2: () => startCh2(), 3: () => startCh3(), 4: () => startCh4() };
function chapterDone(){ return !!S.f['out' + S.ch]; }
function nextChapter(){ const f = START[S.ch + 1]; if(f) f(); }
/* De uitgang van een kamer leidt naar het volgende hoofdstuk zodra het hoofdstuk klaar is. */
function exitLabels(){
  const open = chapterDone() && S.ch < LAST_CH, n = S.ch + 1;
  setLabel('#sc-boot [data-hs="loopplank"]', open && S.ch === 1 ? tx('Naar huis: door naar hoofdstuk {n}', { n }) : 'Naar de kade');
  setLabel('#sc-gang [data-hs="trap4"]', S.ch !== 2 ? 'De trap naar boven' : open ? tx('Trap naar boven: door naar hoofdstuk {n}', { n }) : 'Trap naar boven (naar bed)');
  setLabel('#sc-dak [data-hs="ladder"]', open && S.ch === 3 ? tx('Ladder naar beneden: door naar hoofdstuk {n}', { n }) : 'Ladder');
}
function refreshMenu(){
  const fin = chapterDone();
  $('#btn-cont').hidden = !S.started || (fin && S.ch >= LAST_CH);
  $('#btn-cont').textContent = fin ? tx('Door naar hoofdstuk {n}', { n: S.ch + 1 }) : 'Verder spelen';
  $('#chapters').hidden = !unlocked(2);
  for(let n = 2; n <= LAST_CH; n++) $('#btn-ch' + n).hidden = !unlocked(n);
}

const CH_END = {
  1: ['Aan wal in Grave · hoofdstuk 1 klaar', 'Hij is er', "Sinterklaas is in het land! Volgende: thuis, bij de houtkachel. Vanavond mag je voor het eerst je schoen zetten…", 'Door naar hoofdstuk 2'],
  2: ['Schoen gezet · hoofdstuk 2 klaar', 'Slaap lekker', "Er zat een chocoladeletter in je schoen, en een briefje van Klimpiet. Volgende: in de nacht van 4 december help jij de Pieten op de daken…", 'Door naar hoofdstuk 3'],
  3: ['Middernacht · hoofdstuk 3 klaar', 'Heel goed', "De pakjes van Twan staan bij zijn schoen, en Klimpiet heeft zijn muts terug. Volgende: 5 december. Pakjesavond!", 'Door naar hoofdstuk 4'],
  4: ['Pakjesavond · alle hoofdstukken klaar', 'Hoera', "Je bent nu een echte Hulppiet, voor altijd. Dag Sinterklaasje, dag lieve Pieten, dag Ozosnel! Tot volgend jaar, als de stoomboot weer komt.", '']
};
function showWin(){
  if(S.ch < LAST_CH) setUnlocked(S.ch + 1);
  const [eb, ti, note, next] = CH_END[S.ch] || CH_END[1];
  $('#btn-next').hidden = !next; $('#btn-next').textContent = next;
  $('#w-eyebrow').textContent = eb;
  $('#w-title').innerHTML = esc(ti) + '<span class="cursor">!</span>';
  $('#w-note').textContent = note;
  $('#w-time').textContent = fmt(S.t); $('#w-hints').textContent = S.hints;
  $('#w-rank').textContent = rankFor(S.hints);
  recordScore(S.ch, S.t, S.hints);
  $('#w-ach').innerHTML = ACH.map(([k, l]) => `<span class="${S.ach[k] ? 'got' : ''}">${S.ach[k] ? '✓ ' : ''}${l}</span>`).join('');
  $('#win').hidden = false;
}

/* ---------- scores: het beste resultaat per hoofdstuk, ook na een nieuw spel (KEY-scores) ---------- */
const SCORES_KEY = KEY + '-scores';
const CH_NAMES = ['De stoomboot komt', 'Schoen zetten', 'Op het dak', 'Pakjesavond'];
const rankFor = hints => hints === 0 ? 'Hoofdpiet' : hints <= 2 ? 'Klimpiet' : hints <= 5 ? 'Hulppiet' : 'Pietje in opleiding';
let scoresMem = null;   // werkt ook als de browser opslaan blokkeert (dan alleen voor dit bezoek)
function getScores(){
  if(!scoresMem){ try{ scoresMem = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}') || {}; }catch(e){ scoresMem = {}; } }
  return scoresMem;
}
/* De snelste tijd en de minste hints worden los bewaard: een snellere ronde met meer hints verbetert toch de tijd. */
function recordScore(ch, t, hints){
  const all = getScores(), old = all[ch];
  all[ch] = { t: old ? Math.min(old.t, t) : t, hints: old ? Math.min(old.hints, hints) : hints };
  try{ localStorage.setItem(SCORES_KEY, JSON.stringify(all)); }catch(e){}
}
function openScores(){
  const all = getScores();
  const rows = CH_NAMES.map((n, i) => { const r = all[i + 1];
    return `<tr class="${r ? '' : 'todo'}"><td><b>${i + 1}</b> ${n}</td>` + (r ? `<td>${fmt(r.t)}</td><td>${r.hints}</td><td>${rankFor(r.hints)}</td>` : `<td colspan="3">Nog niet gespeeld</td>`) + '</tr>'; }).join('');
  const got = ACH.filter(([k]) => S.ach[k]).length;
  openModal('Scores', 'Je beste resultaat per hoofdstuk. Een nieuw spel houdt ze.', `
    <table class="scores"><thead><tr><th>Hoofdstuk</th><th>Snelste tijd</th><th>Minste hints</th><th>Rang</th></tr></thead><tbody>${rows}</tbody></table>
    ${Object.keys(all).length ? '' : '<div class="feedback">Nog geen hoofdstuk uitgespeeld. Speel er een uit, dan zie je hier je tijd.</div>'}
    <h4 class="scores-h">${tx('Prestaties ({n} van {m})', { n: got, m: ACH.length })}</h4>
    <div class="ach">${ACH.map(([k, l]) => `<span class="${S.ach[k] ? 'got' : ''}">${S.ach[k] ? '✓ ' : ''}${l}</span>`).join('')}</div>`);
}
$('#btn-scores').onclick = openScores;

$('#btn-hint').onclick = () => {
  if(!$('#title').hidden || chapterDone()) return;
  const st = stage_(); const lv = S.hl[st] || 0; const arr = HINTS[st];
  S.hints++; S.hl[st] = lv + 1; save(); applyVisuals();
  say([['sys', tx(lv >= arr.length - 1 ? 'Grote hint: {hint}' : 'Hint: {hint}', { hint: arr[Math.min(lv, arr.length - 1)] })]]);
};
const rev = $('#btn-reveal');
rev.onclick = () => { stage.classList.add('reveal'); setTimeout(() => stage.classList.remove('reveal'), 1600); };
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeModal();
  if(e.code === 'Space' && $('#modal').hidden && document.activeElement && !/INPUT|BUTTON|SELECT/.test(document.activeElement.tagName) && !document.activeElement.classList.contains('hit')){ e.preventDefault(); stage.classList.add('reveal'); }
});
document.addEventListener('keyup', e => { if(e.code === 'Space') stage.classList.remove('reveal'); });
const showSound = () => $('#btn-sound').textContent = soundOn ? 'Geluid aan' : 'Geluid uit';
showSound();
$('#btn-sound').onclick = () => { soundOn = !soundOn; showSound();
  try{ localStorage.setItem(KEY + '-sound', soundOn ? '1' : '0'); }catch(e){}
  ambUpdate(); };

/* ---------- de klok ---------- */
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
setInterval(() => { if(S.started && !chapterDone() && $('#title').hidden && document.visibilityState === 'visible'){ S.t++; $('#timer').textContent = fmt(S.t); if(S.t % 5 === 0) save(); } }, 1000);

/* ---------- prestaties (verborgen extraatjes) ---------- */
const ACH = [['koek', 'Raad gevraagd aan de speculaaspop'], ['toet', 'Drie keer getoeterd'], ['boek', 'Stiekem in het Grote Boek gekeken'], ['zwaai', 'Naar de kinderen gezwaaid'],
  ['paardmaan', 'Een paard voor de maan gezien'], ['kat', 'Poes laten spinnen'],
  ['sint3', 'Sint op het dak gezien'],
  ['pepernoot', 'Veel te veel pepernoten'], ['sem', 'Meegezongen met Anne-Lieve'], ['saab', 'Een Saab gespot'], ['pang', 'Alle ballonnen kapot']];

/* ---------- spelverloop ---------- */
function startNew(){ S = Object.assign(fresh(), { ach: S.ach || {} }); S.started = true; sel = null; $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro1(); }
function contLine(){
  const f = S.f;
  if(S.scene === 'boot') return f.lock ? "Terug op de stoomboot, aan de kade van Grave. De kinderen zingen nog steeds." : f.engine ? "Terug op de stoomboot. Voor de boot ligt de sluis van Grave." : "Terug op de stoomboot. Hij ligt nog steeds stil op de Maas.";
  if(S.scene === 'ruim') return "Terug in het ruim. Het kraakt en het klotst.";
  if(S.scene === 'kamer') return "Terug in de woonkamer. De kachel brandt nog en Poes slaapt.";
  if(S.scene === 'keuken') return "Terug in de keuken. Het ruikt naar speculaas.";
  if(S.scene === 'dak') return f.gust && !f.wind ? "Terug op het dak. Klimpiet kijkt treurig naar de plek waar zijn muts zat." : "Terug op het dak. Klimpiet zwaait vanaf de nok.";
  if(S.scene === 'dak2') return "Terug op het dak van Hidde, op nummer 4.";
  if(S.scene === 'gang') return S.ch === 2 ? "Terug in de gang. De trap naar boven wacht op je." : "Terug in de gang. Uit de kamer klinkt gezang.";
  return "Terug op pakjesavond. Iedereen kijkt naar jou.";
}
function cont(){ $('#title').hidden = true; S.started = true; renderInv(); applyVisuals(); $('#timer').textContent = fmt(S.t); say([['sys', contLine()]]); }
$('#btn-new').onclick = startNew;
$('#btn-cont').onclick = () => chapterDone() ? nextChapter() : cont();
$('#btn-again').onclick = () => (START[S.ch] || startNew)();
$('#btn-next').onclick = nextChapter;
for(let n = 1; n <= LAST_CH; n++) $('#btn-ch' + n).onclick = START[n];
const STAY = {
  1: "Kijk maar rustig rond. Sinterklaas schudt handjes op de kade. Klik op de loopplank als je door wilt naar hoofdstuk {n}.",
  2: "Kijk maar rustig rond. De kachel brandt en je schoen staat klaar. Klik in de gang op de trap als je door wilt naar hoofdstuk {n}.",
  3: "Kijk maar rustig rond. De maan schijnt en Klimpiet neuriet een liedje. Klik op de ladder als je door wilt naar hoofdstuk {n}.",
  4: "Kijk maar rustig rond. Anne-Lieve speelt met haar bal, Silvie past haar kettinkje, Papa oefent met zijn hengel, en Sint en Klimpiet zwaaien vanaf het dak aan de overkant."
};
$('#btn-stay').onclick = () => { $('#win').hidden = true; exitLabels(); say([['sys', tx(STAY[S.ch] || STAY[1], { n: S.ch + 1 })]]); };
$('#btn-menu').onclick = () => { closeModal(); $('#dialog').hidden = true; queue = []; stopSpeaking(); $('#title').hidden = false; $('#win').hidden = true; refreshMenu(); };

const ROT_LINES = [
  "Klimpiet zegt: ondersteboven hangen is leuk, maar scheef is ook goed. Draai je telefoon en zie de hele kamer.",
  "Ozosnel kijkt ook altijd liggend naar de maan. Draai je telefoon maar.",
  "Op het dak houdt Klimpiet alles schuin. Jij je telefoon ook?",
  "Hoofdpiet heeft het op zijn lijstje gezet: telefoon draaien."
];
function setupRotate(){
  const r = $('#rotate'); let off = false;
  try{ off = localStorage.getItem(KEY + '-norotate') === '1'; }catch(e){}
  r.hidden = off;
  $('#rot-line').textContent = ROT_LINES[Math.floor(Math.random() * ROT_LINES.length)];
  $('#rot-x').onclick = () => { r.hidden = true; beep(500, .04); try{ localStorage.setItem(KEY + '-norotate', '1'); }catch(e){} };
}
const MOTION_NEXT = { auto: 'on', on: 'off', off: 'auto' };
$('#btn-motion').onclick = () => {
  motionPref = MOTION_NEXT[motionPref] || 'auto';
  try{ localStorage.setItem(KEY + '-motion', motionPref); }catch(e){}
  applyMotion();
  say([['sys', motionPref === 'on' ? 'Beweging aan: vlaggetjes wapperen en vuurtjes flakkeren, ook als je apparaat liever minder beweging wil.'
             : motionPref === 'off' ? 'Beweging uit: alles staat stil. Zelfs Klimpiet. Nou ja, bijna.'
             : tx('Beweging auto: het spel volgt de instelling van je apparaat, en dat is nu {now}.', { now: deviceReducesMotion() ? '"minder beweging", dus alles staat stil' : 'alles beweegt' })]]);
};
matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', applyMotion);

function start(data){
  setupRotate();
  buildBoot(); buildDak(); buildFeest();
  applyMotion();
  const saved = (data && data.v === 1) ? data : load();
  if(saved){ S = Object.assign(fresh(), saved); }
  refreshMenu();
  renderInv(); applyVisuals(); $('#timer').textContent = fmt(S.t);
}
/* ---------- installeerbare app (PWA) ---------- */
if('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol)){
  navigator.serviceWorker.addEventListener('message', e => { if(e.data && e.data.type === 'version') swVersion(e.data.cache); });
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.ready.then(r => r.active && r.active.postMessage({ type: 'version?' })).catch(() => {});
}
/* De service worker heeft een nieuwere versie dan de code op deze pagina: bied herladen aan (het spel is opgeslagen). */
function swVersion(cache){
  const n = +String(cache).replace(/\D/g, '');
  if(n > GAME_VERSION) $('#update-bar').hidden = false;
}
$('#btn-update').onclick = () => { save(); location.reload(); };
$('#version').textContent = 'v' + GAME_VERSION;
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#btn-install').hidden = false; });
window.addEventListener('appinstalled', () => { installEvt = null; $('#btn-install').hidden = true; say([['hoofd', "Geïnstalleerd! Nu staat de stoomboot gewoon op je apparaat. Ik heb het meteen op mijn lijstje afgevinkt."]]); });
$('#btn-install').onclick = async () => { if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt = null; $('#btn-install').hidden = true; };

start();
