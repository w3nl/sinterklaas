// De motor: toestand en opslaan, geluid, gesprekken (say), zakken (inventaris), de kamers tekenen (applyVisuals),
// klikken op dingen in de kamer en close-ups (openModal). Geladen op volgorde door js/boot.js; alle spelbestanden
// delen dezelfde globale ruimte, dus elke naam moet uniek zijn.

const KEY = 'sint-v1';
const $ = s => document.querySelector(s);
const fresh = () => ({ v:1, ch:1, scene:'boot', f:{}, inv:[], hl:{}, hints:0, t:0, ach:{}, started:false });
let S = fresh();
let sel = null;
let justGiven = null;   // het ding dat net in je zakken ging: dat vakje springt even op (css/base.css .slot.pop)

/* tx(tekst, { naam }) vult {naam} in. (Het spel is alleen in het Nederlands, dus er valt niets te vertalen.) */
function tx(s, vars){ if(s == null) return s; let out = String(s); if(vars) out = out.replace(/\{(\w+)\}/g, (m, k) => k in vars ? vars[k] : m); return out; }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* Beweging: 'auto' volgt de instelling "minder beweging" van het apparaat; 'on' en 'off' gaan daar overheen. */
let motionPref = (() => { try{ return localStorage.getItem(KEY + '-motion') || 'auto'; }catch(e){ return 'auto'; } })();
const deviceReducesMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function reducedMotion(){ return motionPref === 'off' || (motionPref === 'auto' && deviceReducesMotion()); }
function applyMotion(){
  const root = document.documentElement;
  root.classList.toggle('motion-on', motionPref === 'on');
  root.classList.toggle('motion-off', motionPref === 'off');
  const b = document.getElementById('btn-motion');
  if(b){ b.textContent = { auto:'Beweging auto', on:'Beweging aan', off:'Beweging uit' }[motionPref];
    b.title = motionPref === 'auto' ? tx('Auto volgt de instelling "minder beweging" van je apparaat (nu: {now}). Klik om te wisselen.', { now: deviceReducesMotion() ? 'minder beweging, dus alles staat stil' : 'alles beweegt' })
            : motionPref === 'on' ? 'Alles beweegt, wat je apparaat ook wil. Klik om te wisselen.' : 'Niets beweegt. Klik om te wisselen.'; }
}
let soundOn = (() => { try{ return localStorage.getItem(KEY + '-sound') !== '0'; }catch(e){ return true; } })();

/* ---------- opslaan ---------- */
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){ try{ const d = JSON.parse(localStorage.getItem(KEY)||'null'); return d && d.v===1 ? d : null; }catch(e){ return null; } }

/* ---------- geluidjes ---------- */
let ac = null;
function beep(freq=660, dur=.08, type='triangle', vol=.06){
  if(!soundOn) return;
  try{
    ac = ac || new (window.AudioContext||window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+dur);
    o.start(); o.stop(ac.currentTime+dur+.02);
  }catch(e){}
}
const chord = (arr, gap=90) => arr.forEach((f,i)=>setTimeout(()=>beep(f,.14,'triangle',.06), i*gap));
const nope = () => beep(140,.2,'sawtooth',.04);   // de "fout"-zoemer

/* ---------- gesprekken ---------- */
/* Wie er praat. Een nieuwe spreker heeft een naam hier, een portret in portraits/ (of geen), een kleur in de css
   en een stem in js/voice.js. */
const WHO = { you:'Jij', sys:'Verteller', sint:'Sinterklaas', hoofd:'Hoofdpiet', piet:'Klimpiet', paard:'Ozosnel', koek:'De speculaaspop',
  mama:'Mama', papa:'Papa', oma:'Oma', sem:'Anne-Lieve', silvie:'Silvie', burg:'De burgemeester', sluis:'De sluiswachter', hond:'De hond' };
const FACES = ['you', 'sint', 'hoofd', 'piet', 'paard', 'koek', 'mama', 'burg'];
/* Wat er boven de tekst van de verteller staat, per hoofdstuk. */
const NARRATOR = { 1:'Op de stoomboot', 2:'Thuis · 14 november', 3:'Op het dak · 4 december', 4:'Pakjesavond · 5 december' };
let queue = [], typing = null, full = '', onDone = null, curLine = null;
function say(lines, done){
  // say('tekst'), say(['tekst', 'nog een']) of say([['sint', 'tekst'], 'tekst van jou', …]); ['sys', '♪ …', 'maan'] zingt een liedje (SONGS in js/liedjes.js)
  queue = (Array.isArray(lines) ? lines : [lines]).map(l => typeof l === 'string' ? ['you', l] : l);
  onDone = done || null;
  next();
}
function faceFor(who){ return FACES.includes(who) ? `portraits/${who}.svg` : null; }
function next(){
  clearInterval(typing); typing = null;
  const box = $('#dialog');
  if(!queue.length){ box.hidden = true; if(typeof stopSpeaking === 'function') stopSpeaking(); const d = onDone; onDone = null; d && d(); return; }
  const [who, text, song] = curLine = queue.shift();
  box.hidden = false;
  box.className = 'dialog who-' + who + (song ? ' sung' : '');
  const face = faceFor(who), fe = $('#d-face');
  if(face){ box.classList.add('has-face'); fe.hidden = false;
    if(fe.getAttribute('src') !== face){ fe.src = face; fe.classList.remove('face-in'); void fe.offsetWidth; fe.classList.add('face-in'); } }
  else fe.hidden = true;
  $('#d-who').textContent = who === 'sys' ? (NARRATOR[S.ch] || 'Verteller') : (WHO[who] || who);
  $('#d-more').textContent = matchMedia('(hover: none)').matches ? (queue.length ? 'tik ▸' : 'tik ✕') : (queue.length ? 'klik ▸' : 'klik ✕');
  full = text; let i = 0;
  const el = $('#d-txt'); el.textContent = '';
  if(song){ if(typeof stopSpeaking === 'function') stopSpeaking(); if(typeof singSong === 'function') singSong(song); }
  else if(typeof speakLine === 'function') speakLine(who, full);   // stemmen (js/voice.js), als die aan staan
  if(reducedMotion()){ el.textContent = full; return; }
  typing = setInterval(() => { i += 2; el.textContent = full.slice(0, i); if(i >= full.length){ clearInterval(typing); typing = null; } }, 16);
}
$('#dialog').addEventListener('click', () => {
  if(typing){ clearInterval(typing); typing = null; $('#d-txt').textContent = full; return; }
  next();
});

/* ---------- zakken (inventaris) ---------- */
/* Elk hoofdstuk voegt zijn eigen dingen toe aan ITEMS. De speculaaspop geeft gratis een duwtje (zie js/items.js). */
const ITEMS = {
  koek: { name:'Speculaaspop', desc:'Een wijze speculaaspop. Laat hem iets zien en hij geeft je gratis een duwtje in de goede richting. (Niet opeten!)',
    svg:'<svg viewBox="0 0 44 44"><path d="M22 5a6 6 0 0 1 6 6 6 6 0 0 1-2 4.4l8 4.6-2 4-7-2.6 2 6 4 9-4 2-5-8-5 8-4-2 4-9 2-6-7 2.6-2-4 8-4.6A6 6 0 0 1 16 11a6 6 0 0 1 6-6z" fill="#b8742f" stroke="#7a4518" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="10" r="1.2" fill="#4a2a10"/><circle cx="24" cy="10" r="1.2" fill="#4a2a10"/><path d="M19.5 13q2.5 2 5 0" stroke="#4a2a10" stroke-width="1.2" fill="none"/><circle cx="22" cy="21" r="1.3" fill="#fff3d6"/><circle cx="22" cy="25" r="1.3" fill="#fff3d6"/></svg>' }
};
function renderInv(){
  const wrap = $('#slots'); wrap.innerHTML = '';
  for(let i=0;i<4;i++){
    const id = S.inv[i];
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot' + (id ? ' filled' : '') + (id && sel===id ? ' sel' : '');
    if(id && id===justGiven){ b.classList.add('pop'); justGiven = null; }
    if(id){ b.innerHTML = ITEMS[id].svg; b.title = ITEMS[id].name; b.setAttribute('aria-label', ITEMS[id].name);
      b.onclick = () => { sel = sel===id ? null : id; beep(880,.04); renderInv(); };
    } else { b.disabled = true; b.setAttribute('aria-label','Lege zak'); }
    wrap.appendChild(b);
  }
  $('#tray-hint').textContent = sel ? tx('{name}: {desc} Klik ergens om het te gebruiken, of klik het nog eens om het weg te stoppen.', { name: ITEMS[sel].name, desc: ITEMS[sel].desc })
    : (matchMedia('(hover: none)').matches ? 'Kies een ding en tik dan waar je het wilt gebruiken.' : 'Kies een ding en klik dan waar je het wilt gebruiken.');
  document.querySelectorAll('.hit').forEach(h => h.classList.toggle('item-cursor', !!sel));
}
function give(id){ if(!S.inv.includes(id)) S.inv.push(id); justGiven = id; chord([523,659,784]); renderInv(); save(); }
function take(id){ S.inv = S.inv.filter(x=>x!==id); if(sel===id) sel=null; renderInv(); save(); }
const has = id => S.inv.includes(id);

/* ---------- rustig tonen en verbergen ----------
   vis(selector, aan) laat een deel van een kamer zien of verdwijnen. Als je het kunt zien gebeuren, gaat het zacht
   (of met de eigen data-in / data-out animatie van het element); anders meteen: bij de eerste tekening, als de kamer
   wisselt, op het titelscherm, met Beweging uit en voor klikvlakken. Wat verandert terwijl een close-up open is,
   wacht tot die dicht gaat (visFlush, vanuit closeModal). */
let visQuiet = true;
const visPending = new Map();
function visSet(el, on, animate){
  el._vis = on;
  clearTimeout(el._visT); el.classList.remove('vis-in', 'vis-out', 'vis-slow-in', 'vis-slow-out');
  if(el.dataset.in) el.classList.remove(el.dataset.in);
  if(el.dataset.out) el.classList.remove(el.dataset.out);
  if(!animate){ el.style.display = on ? '' : 'none'; return; }
  if(on) el.style.display = '';
  const own = getComputedStyle(el).animationName !== 'none';
  const cls = on ? (el.dataset.in || (own ? '' : 'vis-in')) : (el.dataset.out || (own ? '' : 'vis-out'));
  if(!cls){ if(!on) el.style.display = 'none'; return; }
  void el.getBoundingClientRect();
  el.classList.add(cls);
  const done = () => { el.classList.remove(cls); if(!on) el.style.display = 'none'; };
  const ms = (parseFloat(getComputedStyle(el).animationDuration) || 1) * 1000 + (parseFloat(getComputedStyle(el).animationDelay) || 0) * 1000;
  el._visT = setTimeout(done, ms + 60);
}
function vis(sel, on){
  const el = typeof sel === 'string' ? $(sel) : sel; if(!el) return;
  on = !!on;
  const quiet = visQuiet || el._vis === undefined || reducedMotion() || el.classList.contains('hit') || !el.closest('.scene.on') || !$('#title').hidden;
  if(quiet){ visPending.delete(el); if(on !== el._vis || el._vis === undefined) visSet(el, on, false); return; }
  if(!$('#modal').hidden){ if(on === el._vis) visPending.delete(el); else visPending.set(el, on); return; }
  visPending.delete(el);
  if(on !== el._vis) visSet(el, on, true);
}
function visFlush(){
  const all = [...visPending]; visPending.clear();
  all.forEach(([el, on]) => { if(on !== el._vis) visSet(el, on, !reducedMotion() && !!el.closest('.scene.on')); });
}

/* ---------- de kamers ---------- */
/* Elke kamer: zijn hoofdstuk, de titel bovenaan en de functie die laat zien hoe het er nu bij staat (in chapterN.js). */
const ROOMS = {
  boot:  { ch:1, title:'Hoofdstuk 1 · De stoomboot komt', apply:() => applyBoot() },
  ruim:  { ch:1, title:'Hoofdstuk 1 · In het ruim', apply:() => applyRuim() },
  kamer: { ch:2, title:'Hoofdstuk 2 · Schoen zetten', apply:() => applyKamer() },
  keuken:{ ch:2, title:() => `Hoofdstuk ${S.ch} · In de keuken`, apply:() => applyKeuken() },
  dak:   { ch:3, title:'Hoofdstuk 3 · Op het dak', apply:() => applyDak() },
  dak2:  { ch:3, title:'Hoofdstuk 3 · Op het dak van Hidde', apply:() => applyDak2() },
  feest: { ch:4, title:'Hoofdstuk 4 · Pakjesavond', apply:() => applyFeest() },
  gang:  { ch:4, title:() => `Hoofdstuk ${S.ch} · In de gang`, apply:() => applyGang() }
};
function applyVisuals(){
  // een kamer waar je net binnenkomt (of een nieuw spel) wordt meteen getekend; veranderingen die je ziet gaan zacht
  const isNew = applyVisuals.scene !== S.scene || applyVisuals.state !== S; applyVisuals.scene = S.scene; applyVisuals.state = S;
  visQuiet = isNew || !$('#title').hidden;
  for(const id in ROOMS) $('#sc-' + id).classList.toggle('on', S.scene === id);
  const title = (ROOMS[S.scene] || ROOMS.boot).title;
  $('#chap').textContent = typeof title === 'function' ? title() : title;
  for(const id in ROOMS) ROOMS[id].apply();
  if(typeof exitLabels === 'function') exitLabels();
  $('#hint-count').textContent = S.hints;
}
function go(scene){
  const f = $('#fade'); f.classList.add('on'); beep(220,.08,'sine',.04);
  setTimeout(() => { S.scene = scene; applyVisuals(); save(); f.classList.remove('on'); }, 330);
}
/* Iets in een kamer een paar seconden laten bewegen (een klasse op de scene); niet met Beweging uit. */
function moment(scene, cls, ms){
  const el = $('#sc-' + scene); if(!el || reducedMotion()) return;
  el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
  clearTimeout(el['_m' + cls]); el['_m' + cls] = setTimeout(() => el.classList.remove(cls), ms);
}
/* Grapjes: iets laten schrikken, ploffen of wegvliegen (een klasse, ms lang). Geeft false als het al bezig is. */
function gag(el, cls, ms){
  if(typeof el === 'string') el = $(el);
  if(!el || el.classList.contains(cls)) return false;
  el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms);
  return true;
}
/* Een woordje ("PANG!") dat even boven iets in de kamer opstijgt. */
function gagText(el, text){
  const svg = el && el.ownerSVGElement; if(!svg) return;
  const r = el.getBoundingClientRect(), pt = svg.createSVGPoint();
  pt.x = r.x + r.width / 2; pt.y = r.y;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', p.x.toFixed(0)); t.setAttribute('y', p.y.toFixed(0)); t.setAttribute('class', 'gag-txt'); t.textContent = text;
  svg.appendChild(t); setTimeout(() => t.remove(), 1300);
}

/* ---------- tooltip en klikken op dingen ---------- */
const stage = $('#stage'), tip = $('#tip');
stage.addEventListener('mousemove', e => {
  const h = e.target.closest && e.target.closest('.hit');
  if(!h || !$('#title').hidden || !$('#win').hidden){ tip.hidden = true; return; }
  const r = stage.getBoundingClientRect();
  tip.hidden = false;
  tip.textContent = sel ? tx('{item} gebruiken op: {spot}', { item: ITEMS[sel].name, spot: h.dataset.label }) : h.dataset.label;
  tip.style.left = Math.min(Math.max(e.clientX - r.left, 80), r.width-80) + 'px';
  tip.style.top = (e.clientY - r.top) + 'px';
});
stage.addEventListener('mouseleave', () => tip.hidden = true);
stage.addEventListener('click', e => {
  const h = e.target.closest && e.target.closest('.hit');
  if(!h) return;
  if(e.detail) h.blur();
  if(matchMedia('(hover: none)').matches) tip.hidden = true;
  beep(440,.03,'sine',.03);
  const id = h.dataset.hs;
  if(sel){ const it = sel; sel = null; renderInv(); useItem(it, id); return; }
  (H[id] || (() => say('Niets bijzonders. Hier verstopt Piet in elk geval niks.')))(h);
});
stage.addEventListener('contextmenu', e => { if(sel){ e.preventDefault(); sel=null; renderInv(); } });
/* met het toetsenbord: Tab naar een klikvlak, Enter of spatie om erop te klikken */
document.querySelectorAll('.hit').forEach(h => { h.setAttribute('tabindex','0'); h.setAttribute('role','button'); h.setAttribute('aria-label', h.dataset.label);
  h.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); h.dispatchEvent(new MouseEvent('click',{bubbles:true})); } }); });
/* Een klikvlak een ander label geven (bijvoorbeeld een deur die "door naar hoofdstuk 2" wordt). */
function setLabel(sel, label){ document.querySelectorAll(sel).forEach(h => { h.dataset.label = label; h.setAttribute('aria-label', label); }); }

/* ---------- close-ups ---------- */
let modalClose = null;
function openModal(title, sub, html, onOpen, onClose){
  $('#m-title').textContent = title; $('#m-sub').textContent = sub || '';
  $('#m-body').innerHTML = html; $('#modal').hidden = false; tip.hidden = true;
  modalClose = onClose || null;
  onOpen && onOpen($('#m-body'));
}
function closeModal(){ if($('#modal').hidden) return; $('#modal').hidden = true; $('#m-body').innerHTML=''; const c = modalClose; modalClose=null; c && c(); visFlush(); }
$('#m-close').onclick = closeModal;
$('#modal').addEventListener('click', e => { if(e.target.id==='modal') closeModal(); });
/* Feedback in een close-up: fb('#id', 'tekst', 'good' | 'bad' | ''). */
function fb(sel, text, cls){ const el = $(sel); if(!el) return; el.className = 'feedback' + (cls ? ' ' + cls : ''); el.textContent = text; }
/* Een opgeloste puzzel: even laten zien dat het goed is, dan de close-up dicht en verder met het verhaal. */
function solved(then, ms = 1300){ chord([523,659,784,1046]); setTimeout(() => { closeModal(); then && then(); }, ms); }
