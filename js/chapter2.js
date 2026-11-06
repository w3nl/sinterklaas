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
const TODO2 = [['maat', 'je eigen schoen pakken'], ['plek', 'je schoen bij de kachel zetten'], ['wortelIn', 'een wortel voor Ozosnel in je schoen'], ['tekeningIn', 'een tekening voor Sint erbij'], ['bakken', 'pepernoten bakken voor Piet'], ['oven', 'de kookwekker zetten'], ['brief', 'Anne-Lieves brief verbeteren'], ['liedje', 'een liedje zingen bij de kachel'], ['nachten', 'uitrekenen hoeveel nachtjes het nog is']];
const ready2 = () => TODO2.every(([k]) => S.f[k]);
/* De trap in de gang: in hoofdstuk 2 ga je daar naar bed. */
function toBed2(){
  if(S.f.out2) return startCh3();
  if(ready2()) return win2();
  say([['mama', "(uit de kamer) Nog niet naar bed, lieverd? Of wel? Kijk eerst even of alles klaar is."], ['mama', tx('Wat er nog moet: {list}.', { list: TODO2.filter(([k]) => !S.f[k]).map(([, t]) => t).join(', ') })]]);
}

KOEK_SAY[2] = ["Een speculaaspop op de plank, naast de chocoladeletters. Hij lijkt precies op die van de boot.",
  "Op zijn rug zit een briefje: \"Voor Hulppiet. Voor als je vastzit. Groetjes, Hoofdpiet.\"", "Je stopt hem in je zak."];

Object.assign(H, {
  deur(){ go('gang'); },
  rek(){ if(S.f.maat) return say("Het schoenenrek. Jouw schoen heb je al gepakt."); openRek(); },
  kal(){ if(S.ch === 4) return say("De kalender staat op december. De 5 is rood omcirkeld: vandaag!"); if(S.f.nachten) return say("Je hebt het uitgerekend: nog 21 nachtjes slapen tot pakjesavond."); openKal(); },
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
  keuken(){ go('keuken'); if(!S.f.keukenSeen){ S.f.keukenSeen = true; save();
    setTimeout(() => say(S.ch === 4 ? ["Je loopt even de keuken in. Hier hoef je vanavond niks te doen: alle pepernoten liggen al in de kamer.", ['oma', "(uit de kamer) Neem je nog een pakje melk mee, lieverd?"]]
      : ["Je loopt de keuken in. Het ruikt naar speculaaskruiden.", ['mama', "(uit de kamer) Het recept voor pepernoten ligt al klaar, lieverd! Dan heeft Piet vannacht ook wat lekkers."]]), 400); } },
  /* de keuken (in hoofdstuk 4 zijn er alleen grapjes) */
  terugkamer(){ go(S.ch === 4 ? 'feest' : 'kamer'); },
  koelkast(){ if(S.ch === 4) return say("De koelkast. Een grote slagroomtaart voor straks, met een marsepeinen mijter erop. Niet aankomen!");
    if(S.f.wortel) return say("De koelkast. Melk, kaas, een halve chocoladeletter van Papa. De wortel heb je al."); S.f.wortel = true; give('wortel');
    say(["Je doet de koelkast open. In de groentela liggen dikke oranje wortels.", "Je pakt de mooiste. Paarden zijn dol op wortels, en Ozosnel heeft het vast druk vannacht."]); },
  recept(){ if(S.ch === 4) return say("Het receptenboek, open bij de pepernoten. Er zitten nog vingerafdrukken van meel op, van 14 november.");
    if(S.f.bakken) return say("Het deeg is klaar en ligt in de oven. Het receptenboek zit onder het meel."); openBakken(); },
  oven(){ if(S.ch === 4) return say("De oven is uit. Achterin ligt nog één pepernoot, zwart verbrand. Die is vast van Klimpiet.");
    if(!S.f.bakken) return say(["De oven is al warm. Maar er ligt nog niks in.", "Eerst het deeg maken. Het recept ligt naast de mengkom."]); if(S.f.oven) return say("De pepernoten zijn klaar. De keuken ruikt naar Sinterklaas."); openOven(); },
  keukenklok(){ if(S.ch === 4) return say("De keukenklok. Het is precies acht uur, 5 december. Pakjesavond!"); say(["De keukenklok. De kleine wijzer staat net voorbij de 7, de grote wijzer op de 3.", "Het is kwart over zeven."]); },
  kkraam(){ say(["Buiten is het donker en stil. De maan schijnt op de daken van de buren.", "Op de vensterbank staat een potje speculaaskruiden: kaneel, kruidnagel, nootmuskaat en gember."]); },
  brief(){ if(S.ch === 4) return say("Een kopie van Anne-Lieves brief aan Sint, met de verbeteringen erin. Onderaan staat in grote letters: BAL!!!");
    if(S.f.brief) return say("Anne-Lieves brief is helemaal goed. Hij ligt klaar voor Sint, naast haar laarsje bij de kachel."); openBrief(); },
  etensbak(){ say("Het etensbakje van Poes. Leeg, natuurlijk. Poes vindt dat het altijd leeg is."); },
  wekker(){ const w = $('#kk-timer'); if(!gag(w, 'ring', 1500)) return; gagText(w, 'TRRRING!'); for(let i = 0; i < 10; i++) setTimeout(() => beep(1800, .05, 'square', .04), i * 120);
    if(!S.f.wekkerTaps){ S.f.wekkerTaps = 1; save(); setTimeout(() => say(S.ch === 4 ? [['sem', "(uit de kamer) Is Sinterklaas er?! Was dat de bel?"]] : [['mama', "(uit de kamer) Zijn de pepernoten al klaar? O, het was de wekker maar."]]), 1400); } },
  plantje(){ const p = $('#sc-kamer .wk-plant'); if(!gag(p, 'shake', 1200)) return; gagText(p, 'Ritsel!'); beep(3000, .08, 'sawtooth', .015); },
  kruiden(){ const k = $('#sc-keuken [data-hs="kruiden"]'); gagText(k, 'HATSJOE!'); beep(500, .05, 'square', .05); setTimeout(() => beep(160, .3, 'sawtooth', .06), 300);
    if(!S.f.niesTaps){ S.f.niesTaps = 1; save(); setTimeout(() => say(["Je ruikt aan het potje speculaaskruiden. Kaneel, kruidnagel, nootmuskaat\u2026 en peper. Veel peper.", ['mama', "(uit de kamer) Gezondheid!"]]), 700); } },
  lamp2(){ const l = $(`#sc-${S.scene} .wk-lamp`); if(!gag(l, 'swing', 2600)) return; gagText(l, 'BOING!'); beep(220, .3, 'triangle', .05);
    S.f.lampTaps = (S.f.lampTaps || 0) + 1; save(); if(S.f.lampTaps === 3) setTimeout(() => say([['mama', "Niet aan de lamp hangen, Hulppiet! Je bent geen Klimpiet."]]), 900); },
  xylo(){ if(S.f.liedje) return say("Pling plong. Je hebt je liedje al gespeeld."); openXylo(); },
  kat(){ S.f.katTaps = (S.f.katTaps || 0) + 1; save();
    const c = $(S.ch === 4 ? '#pa-cat' : '#wk-cat');
    if(gag(c, 'purr', 2200)){ gagText(c, 'Prrrrr…'); for(let i = 0; i < 12; i++) setTimeout(() => beep(i % 2 ? 70 : 85, .12, 'sawtooth', .03), i * 160); }
    if(S.f.katTaps >= 3){ S.ach.kat = true; save(); return say(S.ch === 4 ? ["Je kriebelt Poes achter haar oren. Ze spint zo hard dat het kastje ervan trilt.", ['oma', "Die poes is slimmer dan wij allemaal. Zij ligt lekker hoog, waar Anne-Lieve niet bij kan."]] : ["Je kriebelt Poes achter haar oren. Ze rolt op haar rug en spint als een stoomboot.", "Prrrrrr. Puf, puf."]); }
    say(S.ch === 4 ? "Poes ligt boven op het boekenkastje. Daar is het warm, en daar kan Anne-Lieve niet bij." : "Poes ligt op het kleed bij de kachel. Ze doet één oog open, kijkt je aan, en doet het weer dicht."); },
  schoen(){ if(!S.f.wortelIn || !S.f.tekeningIn) return say(["Je schoen staat bij de kachel, op een veilig plekje.", "Er hoort nog iets in: een wortel voor het paard, en een tekening voor Sint."]); say("Je schoen staat klaar, met een wortel en een tekening erin. Mooi zo."); },
  hout(){ say("De houtmand. Papa hakt elke zaterdag hout. Hij zegt dat het goed is voor zijn spieren."); },
  klok(){ if(S.ch === 4) return say("De Friese staartklok van Oma. Tik, tak: acht uur. Vanavond mag je opblijven tot alle pakjes open zijn!"); say(["Een Friese staartklok, van Oma gekregen. Tik, tak, tik, tak. De slinger zwaait heen en weer.", "Het is kwart over zeven. Nog een uurtje, dan moet je naar bed."]); },
  stokpaard(){ say(["Het stokpaardje van je zusje Anne-Lieve. Het heet Ozosnel.", "Anne-Lieve galoppeert er de hele dag mee door het huis en roept: \"Hihihi!\""]); },
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
const SHOES = [[24, 'Een klein rood schoentje', 'Je tenen zitten klem! Dit is het schoentje van je zusje Anne-Lieve.'], [30, 'Een groene schoen', ''], [38, 'Een zwarte laars', 'Je glijdt erin rond als in een bootje. Dit is de laars van je grote zus Silvie.'], [44, 'Een grote bruine schoen', 'Daar past jouw voet wel twee keer in! Dit is de schoen van Papa.']];
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
/* Het liedje is "Sinterklaas kapoentje" uit js/liedjes.js, op de xylofoon: vier regels van zes noten.
   C4 … B4 zijn de staafjes C … B, en C5 is het hoge C-staafje (C2). Alleen noten zonder kruis of mol passen. */
const SONG2_PART = parseSong(SONGS.kapoentje.noten).filter(n => n.note !== 'R');
const SONG2 = SONG2_PART.map(n => n.note === 'C5' ? 'C2' : n.note[0]);
const SONG2_LINES = [...new Set(SONG2_PART.map(n => n.line))].map(l => SONG2.filter((x, i) => SONG2_PART[i].line === l).map(x => x === 'C2' ? 'C' : x).join(' '));
/* Waar een noot op de notenbalk staat: E op de onderste lijn; elke stap omhoog is een halve lijnafstand. */
const NOTE_Y = { C: 80, D: 75, E: 70, F: 65, G: 60, A: 55, B: 50, C2: 45 };
function openXylo(){
  if(!S.f.plek || !S.f.wortelIn || !S.f.tekeningIn) return say(["De xylofoon met het liedjesboek. Daarop speel je straks een liedje bij de kachel.", "Maar eerst moet je schoen klaarstaan, met een wortel en een tekening erin."]);
  let played = [];
  // labels: onder elke noot de naam (de sleutel) of de lettergreep (het liedje); from: het nummer van de eerste noot
  const staff = (notes, labels, small, from = 0) => { const step = small ? 28 : 24, w = 56 + notes.length * step;
    return `<svg viewBox="0 0 ${w} 114" class="xy-staff${small ? ' small' : ''}" aria-label="${small ? 'De noten van laag naar hoog, met hun namen' : 'Het liedje op de notenbalk'}">
      ${[0, 1, 2, 3, 4].map(i => `<path d="M10 ${70 - i * 10} H${w - 10}" stroke="#3a2a1a" stroke-width="1.4"/>`).join('')}
      <text x="14" y="66" font-size="40" font-family="serif" fill="#3a2a1a">𝄞</text>
      ${notes.map((n, i) => { const x = (small ? 66 : 54) + i * step, y = NOTE_Y[n], l = labels ? String(labels[i]) : ''; return `${y >= 80 ? `<path d="M${x - 11} 80 h22" stroke="#3a2a1a" stroke-width="1.4"/>` : ''}<ellipse class="xy-note" data-i="${small ? '' : from + i}" cx="${x}" cy="${y}" rx="7" ry="5.2" fill="#3a2a1a" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 6.5} ${y - 1} v-28" stroke="#3a2a1a" stroke-width="1.6"/>${l ? `<text x="${x}" y="106" text-anchor="middle" font-size="${small ? 13 : 10}" font-weight="700" font-family="${small ? 'IBM Plex Mono, monospace' : 'Fredoka, sans-serif'}" fill="${small ? '#c21f2b' : '#3a2a1a'}"${!small && l.length > 4 ? ` textLength="${step - 3}" lengthAdjust="spacingAndGlyphs"` : ''}>${esc(l)}</text>` : ''}`; }).join('')}
    </svg>`; };
  const half = Math.ceil(SONG2.length / 2), syl = SONG2_PART.map(n => n.syl);
  openModal('Het liedjesboek', '"Sinterklaas kapoentje" · een oud liedje voor bij de kachel', `
    <div class="xylo">
      ${staff(SONG2.slice(0, half), syl.slice(0, half))}
      ${staff(SONG2.slice(half), syl.slice(half), false, half)}
      <div class="xy-key">
        <span>Welke noot is het? De noten van laag naar hoog:</span>
        ${staff(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'], ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], true)}
      </div>
      <div class="xy-bars">${XYLO.map(([n, , c], i) => `<button type="button" class="xy-bar" data-n="${n}" style="background:${c};height:${118 - i * 7}px">${n === 'C2' ? 'C' : n}</button>`).join('')}</div>
      <div class="xy-played" id="xy-played">♪</div>
      <div class="feedback" id="xy-fb"></div>
    </div>`, body => {
    const show = () => {
      body.querySelectorAll('.xy-note[data-i]:not([data-i=""])').forEach(e => e.setAttribute('fill', +e.dataset.i < played.length ? '#c21f2b' : '#3a2a1a'));
      $('#xy-played').textContent = '♪ ' + syl.slice(0, played.length).join(' ');
    };
    body.querySelectorAll('.xy-bar').forEach(b => b.onclick = () => {
      const n = b.dataset.n, [, hz] = XYLO.find(x => x[0] === n);
      beep(hz, .35, 'sine', .08);
      b.classList.remove('hit-bar'); void b.offsetWidth; b.classList.add('hit-bar');
      if(SONG2[played.length] !== n){
        // een valse noot: alleen deze regel van het liedje opnieuw
        const line = SONG2_PART[played.length].line;
        played = played.slice(0, SONG2_PART.findIndex(p => p.line === line)); show();
        nope(); return fb('#xy-fb', 'Oei, dat klinkt vals! Begin deze regel maar opnieuw. Kijk goed: hoe hoger de noot op de balk staat, hoe hoger de toon, en hoe korter het staafje.', 'bad');
      }
      played.push(n); show();
      fb('#xy-fb', '');
      if(played.length === SONG2.length){
        S.f.liedje = true; save();
        fb('#xy-fb', 'Het hele liedje, zonder één valse noot! Boven in de schoorsteen klinkt een zacht "Bravo!". Of was dat de wind?', 'good');
        solved(() => say([['sys', "En nu met z'n allen: ♪ Sinterklaas kapoentje, gooi wat in mijn schoentje, gooi wat in mijn laarsje, dank u Sinterklaasje! ♪", 'kapoentje'],
          ['mama', "Prachtig! En nog eentje. Die zong Oma vroeger altijd:"],
          ['mama', "♪ Sinterklaasje, bonne, bonne, bonne, gooi wat in mijn lege, lege tonne… ♪", 'bonne'],
          ['mama', "Dat hebben ze op het dak vast gehoord."], ...(S.f.nachten ? [] : [['mama', "Nog één ding, slimmerik: hoeveel nachtjes nog tot pakjesavond? Kijk maar op de kalender."]])]), 2400);
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
       ['mama', "Pak je eigen schoen, zet hem op een goed plekje, doe er een wortel voor Ozosnel in en een tekening voor Sint, en zing een liedje. Dan naar bed!"],
       ['mama', "O, en in de keuken ligt het recept voor pepernoten. Een schaaltje bij je schoen, voor Piet, dat vindt hij altijd fijn."]], () => { S.f.introDone2 = true; save(); });
}
function applyKeuken(){ vis('#kk-pepers', !!S.f.oven || S.ch === 4); vis('#kk-hands2', S.ch !== 4); vis('#kk-hands4', S.ch === 4); }

/* ---------- extra puzzel: pepernoten bakken (een recept drie keer zo groot maken) ---------- */
const RECIPE2 = [['meel', 'bloem', 100, 'gram'], ['suiker', 'bruine suiker', 50, 'gram'], ['boter', 'boter', 40, 'gram'], ['kruiden', 'speculaaskruiden', 2, 'theelepels']];
function openBakken(){
  const v = S.bk || (S.bk = {});
  openModal('Pepernoten bakken', 'Oma\'s receptenboek, met vlekken van vroeger', `
    <div class="bakken">
      <div class="bk-card"><b>Pepernoten (voor 20 stuks)</b>${RECIPE2.map(([, n, a, u]) => `<span>${a} ${u} ${n}</span>`).join('')}<i>Kneden, balletjes rollen, 25 minuten in de oven.</i></div>
      <div class="bk-side">
        <p>Twintig pepernoten is veel te weinig! Vannacht komen er misschien wel drie Pieten langs. Je wilt er <b>60</b> bakken. Hoeveel heb je dan nodig?</p>
        ${RECIPE2.map(([k, n, , u]) => `<label class="bk-row"><span>${n}</span><input type="number" inputmode="numeric" min="0" id="bk-${k}" value="${v[k] ?? ''}"><small>${u}</small></label>`).join('')}
        <button type="button" class="btn" id="bk-go">Kneden!</button>
        <div class="feedback" id="bk-fb"></div>
      </div>
    </div>`, body => {
    body.querySelectorAll('input').forEach(i => i.oninput = () => { v[i.id.slice(3)] = i.value; save(); });
    $('#bk-go').onclick = () => {
      const got = RECIPE2.map(([k, n, a]) => [n, a, +($('#bk-' + k).value || 0)]);
      if(got.some(([, , x]) => !x)) return fb('#bk-fb', 'Vul bij alles in hoeveel je nodig hebt.', 'bad');
      const bad = got.find(([, a, x]) => x !== a * 3);
      if(bad){ nope(); const [n, a, x] = bad;
        return fb('#bk-fb', x === a * 2 ? tx('Met {x} {n} krijg je 40 pepernoten, niet 60. 20 past drie keer in 60!', { x, n })
          : x === a + 40 || x === a + 60 ? tx('{x} {n}? Je hebt er iets bij opgeteld. Maar je wilt niet 40 pepernoten meer, je wilt er drie keer zoveel. Dan heb je ook van alles drie keer zoveel nodig.', { x, n })
          : x > a * 3 ? tx('Dat is te veel {n}! Dan krijg je een berg deeg zo groot als Ozosnel.', { n }) : tx('Te weinig {n}. Hoe vaak past 20 in 60?', { n }), 'bad'); }
      S.f.bakken = true; save();
      fb('#bk-fb', '60 is 3 keer 20, dus van alles 3 keer zoveel: 300 gram bloem, 150 gram suiker, 120 gram boter en 6 theelepels kruiden. Kneden maar!', 'good');
      solved(() => say(["Je kneedt, je rolt, je rolt nog meer. Zestig balletjes deeg op de bakplaat. Nou ja, negenenvijftig. Eentje proefde je.", "De bakplaat gaat de oven in. Nu moet je nog weten wanneer ze klaar zijn."]), 3000);
    };
  });
}

/* ---------- extra puzzel: de kookwekker (klokkijken: 25 minuten later) ---------- */
function openOven(){
  let m = S.ovm ?? 15;   // minuten na 7 uur
  const hand = (deg, len, w, c) => `<path d="M100 100 L${(100 + len * Math.sin(deg * Math.PI / 180)).toFixed(1)} ${(100 - len * Math.cos(deg * Math.PI / 180)).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const face = () => `<svg viewBox="0 0 200 200" class="ov-clock" aria-label="${tx('De kookwekker staat op {t}', { t: time() })}"><circle cx="100" cy="100" r="92" fill="#fffaf0" stroke="#f2b631" stroke-width="8"/>
      ${Array.from({ length: 12 }, (_, i) => `<text x="${(100 + 72 * Math.sin((i + 1) * Math.PI / 6)).toFixed(1)}" y="${(106 - 72 * Math.cos((i + 1) * Math.PI / 6)).toFixed(1)}" text-anchor="middle" font-size="16" font-family="Fredoka, sans-serif" fill="#3a2a1a">${i + 1}</text>`).join('')}
      ${hand((7 + m / 60) * 30, 46, 7, '#3a2a1a')}${hand(m * 6, 66, 4, '#c21f2b')}<circle cx="100" cy="100" r="5" fill="#3a2a1a"/></svg>`;
  const time = () => { const h = 7 + Math.floor(m / 60), mm = ((m % 60) + 60) % 60; return `${h}:${String(mm).padStart(2, '0')}`; };
  openModal('De kookwekker', 'De pepernoten moeten 25 minuten in de oven', `
    <div class="oven2">
      <div id="ov-face">${face()}</div>
      <div class="ov-side">
        <p>De pepernoten gingen de oven in om <b>kwart over zeven</b> (kijk maar op de keukenklok). Ze moeten er <b>25 minuten</b> in blijven. Zet de wijzers op de tijd dat ze klaar zijn.</p>
        <div class="ov-btns"><button type="button" class="btn ghost" id="ov-min">− 5 minuten</button><button type="button" class="btn ghost" id="ov-plus">+ 5 minuten</button></div>
        <div class="ov-time" id="ov-time">${time()}</div>
        <button type="button" class="btn" id="ov-go">Wekker zetten</button>
        <div class="feedback" id="ov-fb"></div>
      </div>
    </div>`, () => {
    const draw = () => { S.ovm = m; save(); $('#ov-face').innerHTML = face(); $('#ov-time').textContent = time(); beep(900, .02); };
    $('#ov-min').onclick = () => { if(m > 0){ m -= 5; draw(); } };
    $('#ov-plus').onclick = () => { if(m < 115){ m += 5; draw(); } };
    $('#ov-go').onclick = () => {
      if(m === 15){ nope(); return fb('#ov-fb', 'Dan gaat de wekker nu meteen af, en zijn de pepernoten nog rauw! Draai de grote wijzer 25 minuten verder.', 'bad'); }
      if(m !== 40){ nope(); return fb('#ov-fb', m < 40 ? tx('Om {t} zijn ze nog niet gaar. Van kwart over zeven tot {t} is maar {d} minuten.', { t: time(), d: m - 15 }) : tx('Om {t} zijn ze zwart als roet! Dat is {d} minuten na kwart over zeven.', { t: time(), d: m - 15 }), 'bad'); }
      S.f.oven = true; save(); applyVisuals();
      fb('#ov-fb', 'Van kwart over zeven nog 25 minuten verder: tien over half acht, 7:40. Elke 5 minuten schuift de grote wijzer één cijfer op, dus 25 minuten is 5 cijfers: van de 3 naar de 8.', 'good');
      solved(() => say(["TRRRING! Om tien over half acht gaat de wekker. De pepernoten zijn precies goed: bruin en knapperig.", "Je doet er een handje van in een schaaltje voor Piet. De rest is voor morgen. Een paar zijn voor nu."]), 3000);
    };
  });
}

/* ---------- extra puzzel: de brief van Anne-Lieve (spelling) ---------- */
const BRIEF2 = [['Liefe', 'Lieve', 'Je hoort een v: lie-ve. Net als bij "lief" en "lieve": aan het eind een f, maar ervoor een v.'],
  ['Sinterklaas,'], ['ik'], ['wil'], ['grag', 'graag', 'In "graag" hoor je een lange a, en de lettergreep eindigt op een medeklinker. Dan schrijf je twee a\'s.'], ['een'],
  ['stokpaart.', 'stokpaard.', 'Maak het woord langer: paarden. Hoor je een d? Dan schrijf je ook paard met een d.'],
  ['Ik'], ['bent', 'ben', 'Bij "ik" komt er geen t achter: ik ben, ik loop, ik zing.'], ['heel'], ['lief'], ['geweest.'], ['En'], ['Poes'], ['ook.'], ['Groetjes'], ['van'], ['Anne-Lieve']];
function openBrief(){
  const fixed = new Set(S.br || []);
  const words = () => BRIEF2.map(([w, ok], i) => `<button type="button" class="br-w${fixed.has(i) ? ' fixed' : ''}" data-i="${i}">${fixed.has(i) ? ok : w}</button>`).join(' ');
  openModal('De brief van Anne-Lieve', 'Je kleine zusje heeft hem helemaal zelf geschreven', `
    <div class="brief2">
      <div class="br-paper" id="br-paper">${words()}</div>
      <p>Er staan <b>4 foutjes</b> in. Klik op een woord dat fout geschreven is, dan verbeter je het. Sint kan alles lezen, maar Anne-Lieve wil het graag netjes.</p>
      <div class="feedback" id="br-fb"></div>
    </div>`, body => {
    const bind = () => body.querySelectorAll('.br-w').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, [w, ok, why] = BRIEF2[i];
      if(fixed.has(i)) return;
      if(!ok){ nope(); return fb('#br-fb', tx('"{w}" is goed geschreven! Zoek nog eens.', { w: w.replace(/[.,]/g, '') }), 'bad'); }
      fixed.add(i); S.br = [...fixed]; save(); beep(760, .06);
      $('#br-paper').innerHTML = words(); bind();
      if(fixed.size < 4) return fb('#br-fb', tx('{w} wordt {ok}. {why}', { w: w.replace(/[.,]/g, ''), ok: ok.replace(/[.,]/g, ''), why }), 'good');
      S.f.brief = true; save();
      fb('#br-fb', tx('{w} wordt {ok}. {why} Alle vier verbeterd!', { w: w.replace(/[.,]/g, ''), ok: ok.replace(/[.,]/g, ''), why }), 'good');
      solved(() => say(["Lieve Sinterklaas, ik wil graag een stokpaard. Ik ben heel lief geweest. En Poes ook. Groetjes van Anne-Lieve.", "Je legt de brief bij Anne-Lieves laarsje, naast jouw schoen. Ze heeft al een stokpaardje, maar dat hoeft Sint niet te weten."]), 3200);
    });
    bind();
  });
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
