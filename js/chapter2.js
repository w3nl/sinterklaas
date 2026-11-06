// Hoofdstuk 2: thuis, op de avond van 14 november. Je mag je schoen zetten bij de houtkachel.
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

const UNLOCK_KEY = n => KEY + '-ch' + n;
function unlocked(n){ if(n <= 1) return true; try{ return localStorage.getItem(UNLOCK_KEY(n)) === '1'; }catch(e){ return false; } }
function setUnlocked(n){ try{ localStorage.setItem(UNLOCK_KEY(n), '1'); }catch(e){} }

Object.assign(ITEMS, {
  schoen: { name:'Je schoen', desc:'Je groene schoen, maat 30. Precies goed voor jouw voet, en voor een klein cadeautje.',
    svg:'<svg viewBox="0 0 44 44"><path d="M5 32 q-2 -18 12 -19 h9 q5 0 6 8 l8 3 q6 2 5 8z" fill="#4f9a4a" stroke="#2e6a2e" stroke-width="2"/><path d="M18 18l7 2M17 23l8 2" stroke="#fff" stroke-width="2"/></svg>' },
  wortel: { name:'Wortel', desc:'Een dikke oranje wortel uit de koelkast. Voor Ozosnel.',
    svg:'<svg viewBox="0 0 44 44"><path d="M30 12 L10 38 L6 34 Z" fill="#e8902e" stroke="#b5641a" stroke-width="2" stroke-linejoin="round"/><path d="M30 12l4 -8M30 12l8 -2M30 12l8 4" stroke="#4f9a4a" stroke-width="3" stroke-linecap="round"/><path d="M16 28l4 2M20 22l3 2" stroke="#b5641a" stroke-width="1.5"/></svg>' },
  tekening: { name:'Je tekening', desc:'Een tekening van een mijter, links en rechts precies hetzelfde. Voor Sinterklaas.',
    svg:'<svg viewBox="0 0 44 44"><rect x="7" y="6" width="30" height="34" fill="#fffaf0" stroke="#ccc"/><path d="M14 34 L16 16 Q22 9 28 16 L30 34Z" fill="#c21f2b"/><path d="M22 18v10M18 22h8" stroke="#f2b631" stroke-width="2.5"/></svg>' }
});

function applyKamer(){
  const f = S.f, show = vis;
  show('#wk-koek', !f.koekTaken); show('#hit-koek2', !f.koekTaken);
  show('#wk-shoe', !!f.plek); show('#hit-shoe', !!f.plek);
  show('#wk-carrot', !!f.wortelIn); show('#wk-drawing', !!f.tekeningIn);
  show('#wk-notes', !!f.liedje && !f.out2);
}
/* Wat er vanavond allemaal moet (mama's lijstje). */
const TODO2 = [['maat', 'je eigen schoen pakken'], ['plek', 'je schoen bij de kachel zetten'], ['wortelIn', 'een wortel voor Ozosnel in je schoen'], ['tekeningIn', 'een tekening voor Sint erbij'], ['liedje', 'een liedje zingen bij de kachel'], ['nachten', 'uitrekenen hoeveel nachtjes het nog is']];
const ready2 = () => TODO2.every(([k]) => S.f[k]);

KOEK_SAY[2] = ["Een speculaaspop op de plank, naast de chocoladeletters. Hij lijkt precies op die van de boot.",
  "Op zijn rug zit een briefje: \"Voor Hulppiet. Voor als je vastzit. Groetjes, Hoofdpiet.\"", "Je stopt hem in je zak."];

Object.assign(H, {
  deur(){
    if(S.f.out2) return startCh3();
    if(ready2()) return win2();
    say([['mama', "Nog niet naar bed, lieverd? Of wel? Kijk eerst even of alles klaar is."], ['mama', tx('Wat er nog moet: {list}.', { list: TODO2.filter(([k]) => !S.f[k]).map(([, t]) => t).join(', ') })]]);
  },
  rek(){ if(S.f.maat) return say("Het schoenenrek. Jouw schoen heb je al gepakt."); openRek(); },
  kal(){ if(S.f.nachten) return say("Je hebt het uitgerekend: nog 21 nachtjes slapen tot pakjesavond."); openKal(); },
  mama(){
    if(!S.f.introDone2) return;
    if(ready2()) return say([['mama', "Alles is klaar! Tijd voor bed, Hulppiet. De trap op, en lekker slapen."]]);
    if(!S.f.maat) return say([['mama', "Pak eerst je eigen schoen van het rek. Niet die van Papa, daar past een heel paard in."], ['mama', "Weet je je maat niet meer? Ik heb vanmiddag je voet getekend, op het papier op tafel."]]);
    if(!S.f.nachten) return say([['mama', "Zeg, slimmerik: hoeveel nachtjes is het nog tot pakjesavond? Kijk maar op de kalender."]]);
    say([['mama', tx('Wat er nog moet: {list}.', { list: TODO2.filter(([k]) => !S.f[k]).map(([, t]) => t).join(', ') })]]);
  },
  thermo(){ say(["Een thermometer aan de muur. Hier, een paar meter van de kachel, is het 21 °C.", "Hoe dichter bij de kachel, hoe warmer het wordt."]); },
  kachel(){ if(S.f.plek) return say("De kachel brandt. Je schoen staat op een veilige afstand, waar het niet te warm is."); if(has('schoen')) return openPlek(); say(["De houtkachel snort en knispert. Hij is lekker warm.", "Hier zet je vanavond je schoen neer. Dan kan Piet er iets in stoppen, als hij door de schoorsteen komt."]); },
  pijp(){
    if(S.f.liedje) return say("Je hebt al gezongen. Boven in de schoorsteen hoor je de wind zachtjes fluiten. Of is het Piet?");
    if(!S.f.plek || !S.f.wortelIn || !S.f.tekeningIn) return say(["De kachelpijp gaat door het plafond, naar de schoorsteen op het dak.", ['mama', "Als je schoen klaarstaat, zing je een liedje. Dan horen de Pieten op het dak dat je eraan gedacht hebt."]]);
    say("Zingen kun je zelf, maar met de xylofoon klinkt het veel mooier.");
  },
  letters(){ say(["Twee chocoladeletters op de plank: een rode B en een blauwe A. Van Papa en Mama, voor straks.", "Op de wikkel staat: \"Bewaren op een koele plek, onder 20 °C. Chocolade smelt al bij ongeveer 34 °C.\"", "Dat is nog kouder dan jouw mond: daarom smelt chocolade op je tong!"]); },
  raam(){ S.f.raamTaps = (S.f.raamTaps || 0) + 1; save();
    say(S.f.raamTaps >= 3 ? (S.ach.paardmaan = true, save(), ["Je drukt je neus tegen het raam en wacht…", "Daar! Voor de maan schiet een schaduw voorbij: een paard met een ruiter. Op het dák!", ['mama', "Zag je dat? Zou dat…?"]]) : ["Buiten is het donker. De maan schijnt op de daken en de schoorstenen.", "Ergens op die daken lopen vannacht de Pieten. Je kijkt goed, maar je ziet niks. Nog niet."]); },
  tekentafel(){ if(S.f.tekening) return say("Je tekening is klaar. Je hebt hem al meegenomen."); openTeken(); },
  voet(){ openVoet(); },
  keuken(){ if(S.f.wortel) return say("De keuken. De wortel heb je al."); S.f.wortel = true; give('wortel');
    say(["Je loopt de keuken in en doet de koelkast open. In de groentela liggen dikke oranje wortels.", "Je pakt de mooiste. Paarden zijn dol op wortels, en Ozosnel heeft het vast druk vannacht."]); },
  xylo(){ if(S.f.liedje) return say("Pling plong. Je hebt je liedje al gespeeld."); openXylo(); },
  kat(){ S.f.katTaps = (S.f.katTaps || 0) + 1; save();
    if(S.f.katTaps >= 3){ S.ach.kat = true; save(); return say(["Je kriebelt Poes achter haar oren. Ze rolt op haar rug en spint als een stoomboot.", "Prrrrrr. Puf, puf."]); }
    say("Poes ligt op het kleed bij de kachel. Ze doet één oog open, kijkt je aan, en doet het weer dicht."); },
  schoen(){ if(!S.f.wortelIn || !S.f.tekeningIn) return say(["Je schoen staat bij de kachel, op een veilig plekje.", "Er hoort nog iets in: een wortel voor het paard, en een tekening voor Sint."]); say("Je schoen staat klaar, met een wortel en een tekening erin. Mooi zo."); },
  hout(){ say("De houtmand. Papa hakt elke zaterdag hout. Hij zegt dat het goed is voor zijn spieren."); },
  klok(){ say(["Een Friese staartklok, van Oma gekregen. Tik, tak, tik, tak. De slinger zwaait heen en weer.", "Het is kwart over zeven. Nog een uurtje, dan moet je naar bed."]); },
  stokpaard(){ say(["Het stokpaardje van je broertje Sem. Het heet Ozosnel.", "Sem galoppeert er de hele dag mee door het huis en roept: \"Hihihi!\""]); },
  kast(){ say(["Een boekenkastje vol prentenboeken. Onderin staat de speelgoedkist.", "Op een rug staat: \"Het Grote Sinterklaasboek\". Niet te verwarren met het Grote Boek van Sint zelf."]); }
});

/* ---------- puzzel 1: welke schoen is van jou? (schoenmaat ≈ voetlengte × 1,5) ---------- */
function openVoet(){
  openModal('Je voetafdruk', 'Mama heeft je voet vanmiddag omgetrokken', `
    <div class="voetpap">
      <svg viewBox="0 0 330 120" aria-label="Een voetafdruk naast een liniaal">
        <path d="M30 60 q0 -34 40 -36 q90 -8 190 4 q34 6 30 30 q-4 26 -40 30 q-100 12 -180 4 q-40 -4 -40 -32z" fill="#f3e2c4" stroke="#8a6a4a" stroke-width="3"/>
        <g fill="#f3e2c4" stroke="#8a6a4a" stroke-width="2"><circle cx="290" cy="40" r="10"/><circle cx="293" cy="62" r="8"/><circle cx="290" cy="80" r="7"/></g>
        <rect x="20" y="96" width="290" height="22" fill="#f2c94c" stroke="#a87618" stroke-width="2"/>
        ${Array.from({ length: 22 }, (_, i) => `<path d="M${30 + i * 13.5} 96 v${i % 5 === 0 ? 10 : 6}" stroke="#4a3a1a" stroke-width="1.5"/>${i % 5 === 0 ? `<text x="${30 + i * 13.5}" y="116" text-anchor="middle" font-size="8" font-family="IBM Plex Mono, monospace" fill="#4a3a1a">${i}</text>` : ''}`).join('')}
        <path d="M30 20 v76 M300 20 v76" stroke="#c21f2b" stroke-width="2" stroke-dasharray="4 3"/>
      </svg>
      <p>Je voet is van je hiel tot je grote teen <b>20 centimeter</b> lang.</p>
      <p class="vp-box">Op een oude schoenendoos staat: <i>"Weet je je maat niet? Schoenmaat ≈ lengte van je voet in centimeters × 1,5."</i></p>
    </div>`);
}
const SHOES = [[24, 'Een klein rood schoentje', 'Je tenen zitten klem! Dit is het schoentje van je broertje Sem.'], [30, 'Een groene schoen', ''], [38, 'Een zwarte laars', 'Je glijdt erin rond als in een bootje. Dit is de laars van Mama.'], [44, 'Een grote bruine schoen', 'Daar past jouw voet wel twee keer in! Dit is de schoen van Papa.']];
function openRek(){
  openModal('Het schoenenrek', 'Welke schoen is van jou?', `
    <div class="rek">
      <div class="rk-row">${SHOES.map(([m, n]) => `<button type="button" class="rk-shoe" data-m="${m}"><span class="rk-pic rk-${m}"></span><b>${n}</b><small>${tx('maat {m}', { m })}</small></button>`).join('')}</div>
      <div class="feedback" id="rk-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.rk-shoe').forEach(b => b.onclick = () => {
      const [m, , msg] = SHOES.find(s => s[0] === +b.dataset.m);
      if(m !== 30){ nope(); return fb('#rk-fb', msg + ' Welke maat heb jij? Kijk eens naar je voetafdruk op tafel.', 'bad'); }
      S.f.maat = true; give('schoen'); save();
      fb('#rk-fb', 'Je voet is 20 cm, en 20 × 1,5 = 30. Maat 30! Hij past precies, met nog een klein beetje ruimte voor je tenen.', 'good');
      solved(() => say("Je hebt je eigen schoen. Nu nog een goed plekje bij de kachel."), 2200);
    });
  });
}

/* ---------- puzzel 2: waar zet je je schoen? (chocolade smelt bij ongeveer 34 °C) ---------- */
const SPOTS = [['op', 'Bovenop de kachel', 250], ['tegen', 'Tegen de kachel aan', 70], ['half', 'Een halve meter ervandaan', 38], ['ver', 'Anderhalve meter ervandaan', 21]];
function openPlek(){
  openModal('Waar zet je je schoen?', 'Bij de kachel, maar waar precies?', `
    <div class="plek">
      <svg viewBox="0 0 340 110" class="plek-svg" aria-hidden="true">
        <rect x="10" y="20" width="60" height="70" rx="6" fill="#1d1d1d"/><rect x="22" y="34" width="36" height="30" rx="4" fill="#ff8a2e"/><rect x="34" y="0" width="12" height="20" fill="#1d1d1d"/>
        <rect x="0" y="90" width="340" height="20" fill="#7a4a26"/>
        ${[['op', 40, 14], ['tegen', 86, 84], ['half', 170, 84], ['ver', 300, 84]].map(([k, x, y]) => `<g><circle cx="${x}" cy="${y}" r="9" fill="#f2b631"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#24120a">${'ABCD'['op tegen half ver'.split(' ').indexOf(k)]}</text></g>`).join('')}
      </svg>
      <div class="pk-list">${SPOTS.map(([k, n, t], i) => `<button type="button" class="btn ghost pk-spot" data-k="${k}"><b>${'ABCD'[i]}</b> ${n}<small>${t} °C</small></button>`).join('')}</div>
      <p class="pk-q">Vannacht stopt Piet er misschien chocolade in. Die moet er morgenochtend nog heel uitzien!</p>
      <div class="feedback" id="pk-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.pk-spot').forEach(b => b.onclick = () => {
      const [k, , t] = SPOTS.find(s => s[0] === b.dataset.k);
      if(k === 'op'){ nope(); return fb('#pk-fb', 'Bovenop de kachel? Dan smelt de chocolade, én het cadeautje, én je schoen! 250 °C is heter dan een oven.', 'bad'); }
      if(k === 'tegen'){ nope(); return fb('#pk-fb', '70 °C! Daar wordt een chocoladeletter een chocoladeplasje. Chocolade smelt al bij ongeveer 34 °C.', 'bad'); }
      if(k === 'half'){ nope(); return fb('#pk-fb', '38 °C is nog steeds warmer dan 34 °C. Morgen vind je een slap chocoladeletterje dat aan je schoen plakt. Iets verder weg?', 'bad'); }
      S.f.plek = true; take('schoen'); save(); applyVisuals();
      fb('#pk-fb', tx('{t} °C: lekker dichtbij de schoorsteen, maar koel genoeg. Chocolade smelt pas bij ongeveer 34 °C, dus hier blijft hij heel.', { t }), 'good');
      solved(() => say("Je schoen staat klaar. Er moet nog wat in: een wortel voor Ozosnel en een tekening voor Sinterklaas."), 2400);
    });
  });
}

/* ---------- puzzel 3: een tekening voor Sint (spiegelsymmetrie) ---------- */
const MIJTER_HALF = ['...R', '..RR', '..RY', '.RYY', '.RRY', '.RRY', 'RRRR', 'YYYY'];   // de linkerhelft; de rechterhelft is het spiegelbeeld
const MIJTER_COLS = { R: '#c21f2b', Y: '#f2b631', '.': '' };
function openTeken(){
  const right = S.tk || (S.tk = MIJTER_HALF.map(() => '....'));
  let pen = S.tkPen || 'R';
  const cell = (r, c, v, mine) => `<button type="button" class="tk-c${mine ? ' mine' : ''}" data-r="${r}" data-c="${c}" style="${v !== '.' ? `background:${MIJTER_COLS[v]}` : ''}" aria-label="${tx('Rij {r}, vakje {c}', { r: r + 1, c: c + 1 })}" ${mine ? '' : 'disabled'}></button>`;
  const grid = () => MIJTER_HALF.map((half, r) => [...half].map((v, c) => cell(r, c, v, false)).join('') + [...right[r]].map((v, c) => cell(r, c + 4, v, true)).join('')).join('');
  openModal('Een tekening voor Sinterklaas', 'Maak de mijter af', `
    <div class="teken">
      <p>Je bent begonnen aan een mijter, maar alleen de linkerkant is af. Een mijter is <b>symmetrisch</b>: de rechterkant is het spiegelbeeld van de linkerkant. Kleur de rechterkant.</p>
      <div class="tk-wrap"><div class="tk-grid" id="tk-grid">${grid()}</div><div class="tk-mirror" aria-hidden="true"></div></div>
      <div class="tk-pens">${['R', 'Y', '.'].map(p => `<button type="button" class="tk-pen${pen === p ? ' on' : ''}" data-p="${p}">${p === 'R' ? 'Rood' : p === 'Y' ? 'Goud' : 'Gum'}</button>`).join('')}
        <button type="button" class="btn" id="tk-done">Klaar!</button></div>
      <div class="feedback" id="tk-fb"></div>
    </div>`, body => {
    const bind = () => body.querySelectorAll('.tk-c.mine').forEach(b => b.onclick = () => {
      const r = +b.dataset.r, c = +b.dataset.c - 4, row = [...right[r]]; row[c] = pen; right[r] = row.join(''); save();
      b.style.background = pen === '.' ? '' : MIJTER_COLS[pen]; beep(700 + c * 60, .03);
    });
    bind();
    body.querySelectorAll('.tk-pen').forEach(b => b.onclick = () => { pen = S.tkPen = b.dataset.p; body.querySelectorAll('.tk-pen').forEach(x => x.classList.toggle('on', x === b)); });
    $('#tk-done').onclick = () => {
      const wrong = MIJTER_HALF.reduce((n, half, r) => n + [...half].reverse().filter((v, c) => right[r][c] !== v).length, 0);
      if(wrong){ nope(); const copied = MIJTER_HALF.every((h, r) => right[r] === h);
        return fb('#tk-fb', copied ? 'Je hebt de linkerkant precies nagetekend, maar in een spiegel draait alles om: wat links aan de buitenkant zit, zit rechts óók aan de buitenkant.' : tx('Nog {n} vakjes kloppen niet. Houd een denkbeeldige spiegel op de streep in het midden: elk vakje rechts is hetzelfde als het vakje er precies tegenover, links.', { n: wrong }), 'bad'); }
      S.f.tekening = true; give('tekening'); save();
      fb('#tk-fb', 'Prachtig! Links en rechts zijn elkaars spiegelbeeld. Sinterklaas gaat hem vast ophangen.', 'good');
      solved(() => say("Je tekening is klaar. Die gaat in je schoen, naast de wortel."), 2200);
    };
  });
}

/* ---------- puzzel 4: een liedje bij de kachel (noten lezen: hoe hoger op de balk, hoe hoger de toon) ---------- */
const XYLO = [['C', 523, '#e2483d'], ['D', 587, '#ef8a2e'], ['E', 659, '#f2c94c'], ['F', 698, '#4f9a4a'], ['G', 784, '#3aa0c8'], ['A', 880, '#1f4fa8'], ['B', 988, '#6a4fb0'], ['C2', 1046, '#c73f6d']];
const SONG2 = ['G', 'E', 'G', 'A', 'G', 'E', 'D', 'C'];
/* Waar een noot op de notenbalk staat: E op de onderste lijn; elke stap omhoog is een halve lijnafstand. */
const NOTE_Y = { C: 80, D: 75, E: 70, F: 65, G: 60, A: 55, B: 50, C2: 45 };
function openXylo(){
  if(!S.f.plek || !S.f.wortelIn || !S.f.tekeningIn) return say(["De xylofoon met het liedjesboek. Daarop speel je straks een liedje bij de kachel.", "Maar eerst moet je schoen klaarstaan, met een wortel en een tekening erin."]);
  let played = [];
  const staff = (notes, names) => `<svg viewBox="0 0 330 ${names ? 112 : 100}" class="xy-staff${names ? ' small' : ''}" aria-label="${names ? 'De noten van laag naar hoog, met hun namen' : 'Het liedje op de notenbalk'}">
      ${[0, 1, 2, 3, 4].map(i => `<path d="M10 ${70 - i * 10} H320" stroke="#3a2a1a" stroke-width="1.4"/>`).join('')}
      <text x="14" y="66" font-size="40" font-family="serif" fill="#3a2a1a">𝄞</text>
      ${notes.map((n, i) => { const x = 66 + i * 32, y = NOTE_Y[n]; return `${y >= 80 ? `<path d="M${x - 11} 80 h22" stroke="#3a2a1a" stroke-width="1.4"/>` : ''}<ellipse cx="${x}" cy="${y}" rx="7" ry="5.2" fill="#3a2a1a" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 6.5} ${y - 1} v-28" stroke="#3a2a1a" stroke-width="1.6"/>${names ? `<text x="${x}" y="106" text-anchor="middle" font-size="13" font-weight="700" font-family="IBM Plex Mono, monospace" fill="#c21f2b">${n === 'C2' ? 'C' : n}</text>` : ''}`; }).join('')}
    </svg>`;
  openModal('Het liedjesboek', '"Zachtjes, Piet, je bent op het dak" · een liedje voor bij de kachel', `
    <div class="xylo">
      ${staff(SONG2)}
      <div class="xy-key">
        <span>Welke noot is het? De noten van laag naar hoog:</span>
        ${staff(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'], true)}
      </div>
      <div class="xy-bars">${XYLO.map(([n, , c], i) => `<button type="button" class="xy-bar" data-n="${n}" style="background:${c};height:${118 - i * 7}px">${n === 'C2' ? 'C' : n}</button>`).join('')}</div>
      <div class="xy-played" id="xy-played">♪</div>
      <div class="feedback" id="xy-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.xy-bar').forEach(b => b.onclick = () => {
      const n = b.dataset.n, [, hz] = XYLO.find(x => x[0] === n);
      beep(hz, .35, 'sine', .08);
      b.classList.remove('hit-bar'); void b.offsetWidth; b.classList.add('hit-bar');
      if(SONG2[played.length] !== n){
        played = []; $('#xy-played').textContent = '♪';
        nope(); return fb('#xy-fb', 'Oei, dat klinkt vals! Begin maar weer bij de eerste noot. Kijk goed: hoe hoger de noot op de balk staat, hoe hoger de toon, en hoe korter het staafje.', 'bad');
      }
      played.push(n); $('#xy-played').textContent = '♪ ' + played.map(x => x === 'C2' ? 'C' : x).join(' ');
      fb('#xy-fb', '');
      if(played.length === SONG2.length){
        S.f.liedje = true; save();
        fb('#xy-fb', 'Het hele liedje, zonder één valse noot! Boven in de schoorsteen klinkt een zacht "Bravo!". Of was dat de wind?', 'good');
        solved(() => say([['mama', "Wat mooi! Dat hebben ze op het dak vast gehoord."], ...(S.f.nachten ? [] : [['mama', "Nog één ding, slimmerik: hoeveel nachtjes nog tot pakjesavond? Kijk maar op de kalender."]])]), 2400);
      }
    });
  });
}

/* ---------- puzzel 5: hoeveel nachtjes nog? (dagen tellen over twee maanden) ---------- */
function openKal(){
  const days = (n, start, mark) => Array.from({ length: n }, (_, i) => `<span class="kl-d${mark[i + 1] ? ' ' + mark[i + 1] : ''}">${i + 1}</span>`).join('');
  openModal('De kalender', 'Hoeveel nachtjes slapen nog tot pakjesavond?', `
    <div class="kal">
      <div class="kl-months">
        <div class="kl-m"><h4>November</h4><div class="kl-grid">${'<span class="kl-pad"></span>'.repeat(6)}${days(30, 6, { 14: 'today' })}</div></div>
        <div class="kl-m"><h4>December</h4><div class="kl-grid">${'<span class="kl-pad"></span>'.repeat(1)}${days(31, 1, { 5: 'party' })}</div></div>
      </div>
      <p class="kl-rijm">Mama's rijmpje: <i>"Dertig dagen heeft september, april, juni en november."</i></p>
      <p>Vandaag is het <b>14 november</b>. Pakjesavond is op <b>5 december</b>. Hoeveel nachtjes moet je nog slapen?</p>
      <div class="kl-in"><input type="number" id="kl-n" min="0" max="99" inputmode="numeric" aria-label="Aantal nachtjes" value="${S.kln || ''}"><button type="button" class="btn" id="kl-go">Dat is het!</button></div>
      <div class="feedback" id="kl-fb"></div>
    </div>`, body => {
    const inp = $('#kl-n'); inp.oninput = () => { S.kln = inp.value; save(); };
    const go = () => {
      const n = +inp.value;
      if(n === 21){
        S.f.nachten = true; save();
        fb('#kl-fb', 'Goed zo! Van 14 tot 30 november zijn het 16 nachtjes, en dan nog 5 in december: 16 + 5 = 21. Nog 21 nachtjes slapen!', 'good');
        return solved(() => say([['mama', "Eenentwintig! Dat is nog best lang. Gelukkig mag je vaker je schoen zetten."]]), 2600);
      }
      nope();
      fb('#kl-fb', n === 16 ? 'Dat zijn alleen de nachtjes in november. December telt ook mee!'
        : n === 22 ? 'Bijna! Heeft november wel 31 dagen? Kijk naar het rijmpje van Mama.'
        : n === 20 ? 'Bijna! Tel vannacht ook mee: dat is het eerste nachtje.'
        : 'Dat klopt niet. Tel eerst hoeveel dagen er nog in november over zijn (november heeft er 30), en tel er de dagen in december bij op.', 'bad');
    };
    $('#kl-go').onclick = go; inp.onkeydown = e => { if(e.key === 'Enter') go(); };
  });
}

/* ---------- begin en einde ---------- */
function intro2(){
  say([['sys', "Diezelfde avond, thuis. De houtkachel brandt, Poes ligt op het kleed, en buiten is het donker."],
       ['mama', "Wat een dag, Hulppiet! Je hebt Sinterklaas zelf geholpen."],
       ['mama', "En weet je wat? Vanaf vanavond mag je je schoen zetten bij de kachel. Dan kan Piet er vannacht iets in stoppen, als hij door de schoorsteen komt."],
       ['mama', "Pak je eigen schoen, zet hem op een goed plekje, doe er een wortel voor Ozosnel in en een tekening voor Sint, en zing een liedje. Dan naar bed!"]], () => { S.f.introDone2 = true; save(); });
}
function startCh2(){
  S = Object.assign(fresh(), { ch: 2, scene: 'kamer', ach: S.ach || {}, started: true }); sel = null; setUnlocked(2);
  $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro2();
}
function win2(){
  S.f.out2 = true; save(); applyVisuals(); chord([523,659,784,1046,1318], 120);
  say([['mama', "Welterusten, Hulppiet."],
       ['sys', "Je slaapt meteen. Midden in de nacht hoor je iets op het dak: tik, tik, tik. Hoefjes? En gegiechel bij de schoorsteen…"],
       ['sys', "De volgende ochtend ren je de trap af. In je schoen ligt een chocoladeletter: jouw letter! De wortel is weg. En er ligt een briefje."],
       ['piet', "Lieve Hulppiet! Bedankt voor de wortel (zegt Ozosnel) en de mooie tekening (zegt Sint). Wil je me helpen op de daken, op de nacht van 4 december? Groetjes, Klimpiet."]], showWin);
}
