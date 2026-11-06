// Hoofdstuk 3: op de daken met Klimpiet, in de nacht van 4 december.
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

Object.assign(ITEMS, {
  touw: { name:'Touw', desc:'Een lange rol stevig touw, met knopen om de meter. Om pakjes mee door de schoorsteen te laten zakken.',
    svg:'<svg viewBox="0 0 44 44"><ellipse cx="22" cy="26" rx="16" ry="9" fill="none" stroke="#c9a467" stroke-width="4"/><ellipse cx="22" cy="23" rx="11" ry="6" fill="none" stroke="#b8935a" stroke-width="4"/><path d="M36 24 q6 -10 0 -18" stroke="#c9a467" stroke-width="4" fill="none"/></svg>' },
  pakjes: { name:'Pakjes voor Noor', desc:'De pakjes die door de schoorsteen passen. De rest brengt Sint morgen gewoon langs.',
    svg:'<svg viewBox="0 0 44 44"><rect x="6" y="18" width="16" height="18" fill="#c21f2b"/><rect x="24" y="10" width="14" height="26" fill="#1f4fa8"/><path d="M14 18v18M6 27h16M31 10v26M24 22h14" stroke="#f2b631" stroke-width="2.5"/></svg>' }
});

function buildDak(){
  let s = '';
  [[60,40],[140,110],[300,60],[420,150],[520,40],[660,90],[780,30],[880,140],[980,60],[1100,120],[1200,40],[1520,60],[1560,220],[90,260],[700,210],[1000,250],[460,260],[1240,200]].forEach(([x, y], i) =>
    s += `<circle class="tw${i % 2 ? ' b' : ''}" cx="${x}" cy="${y}" r="${1.2 + (i % 3) * .6}" style="animation-delay:-${(i * .37).toFixed(2)}s"/>`);
  $('#dk-stars').innerHTML = s;
}
function applyDak(){
  const f = S.f, show = vis;
  show('#dk-koek', !f.koekTaken); show('#hit-koek3', !f.koekTaken);
  show('#dk-rope', !f.touwTaken); show('#hit-rope', !f.touwTaken);
  show('#dk-sacklock', !f.code); show('#dk-gifts', !!f.code && !f.past);
  show('#dk-ropein', !!f.touw);
  show('#dk-cap', !f.gust || !!f.wind); show('#dk-flycap', !!f.gust && !f.wind);
  $('#sc-dak').classList.toggle('dk-gust', !!f.gust && !f.wind);
}
KOEK_SAY[3] = ["Op het dak, tussen de dakpannen, ligt een speculaaspop. Hoe komt die hier?", ['piet', "Oeps, die is uit mijn zak gevallen. Hou jij hem maar, Hulppiet. Hij helpt je als je vastzit!"]];

Object.assign(H, {
  piet(){
    if(S.f.gust && !S.f.wind) return say([['piet', "Mijn muts! Mijn mooiste muts, met de gouden veer!"], ['piet', "Kijk naar de windhaan op de kerktoren, Hulppiet. Die weet waar de wind vandaan komt."]]);
    if(!S.f.code) return say([['piet', "Hé Hulppiet! Welkom op het dak. Niet naar beneden kijken, gewoon naar mij."], ['piet', "De pakjes zitten in mijn zak, maar die zit op slot. Het wachtwoord staat op het label, in Pietencode. Dan kan niemand het lezen. Ik ook niet meer, haha!"]]);
    if(!S.f.adres) return say([['piet', "Op het lijstje uit de zak staan drie kinderen. Maar welke huizen zijn het? Het is zo donker dat je de nummers niet kunt lezen."], ['piet', "Op het straatnaambord bij de lantaarnpaal staat iets over de nummers. Volgens mij."]]);
    if(!S.f.past) return say([['piet', "We zitten op het dak van nummer 8, het huis van Noor. Kijk in de zak welke pakjes van haar door de schoorsteen passen."]]);
    if(!S.f.touw) return say([['piet', "Pakjes erin, touw eraan, en dan zachtjes naar beneden laten zakken, tot vlak boven haar schoen. Niet gooien! Ik heb dat één keer gedaan, met een theeservies."]]);
    say([['piet', "Wat een nacht! Dank je, Hulppiet."]]);
  },
  zak(){
    if(!S.f.code) return openCode();
    if(!S.f.adres) return openAdres();
    if(!S.f.past) return openPast();
    say("De jutezak. Er zitten nog heel veel pakjes in, voor morgen: pakjesavond!");
  },
  bord(){ say(["Een blauw bord: PEPERNOTENSTRAAT.", "Eronder, kleiner: ← 1 – 13 (oneven) aan de linkerkant · 2 – 14 (even) aan de rechterkant →", "In Nederland staan de oneven nummers meestal aan de ene kant van de straat en de even nummers aan de andere kant."]); },
  touw(){ S.f.touwTaken = true; give('touw'); applyVisuals(); say(["Een lange rol touw. Er zit om de meter een knoop in: zo kun je zien hoe lang het is.", "Je neemt het mee."]); },
  schoorsteen(){
    if(S.f.touw) return say("Je kijkt in de schoorsteen. Beneden is het donker en stil. Noor slaapt. Morgen vindt ze haar pakjes!");
    if(!S.f.past) return say(["Een brede schoorsteen. Er komt warme lucht uit, maar geen rook: het vuur in de open haard van Noor is uit. Gelukkig!", ['piet', "Het gat is 32 bij 32 centimeter. Ik heb het gemeten met mijn muts."]]);
    if(!has('touw')) return say("De pakjes passen erin, maar je kunt ze toch niet gewoon laten vallen? Je hebt iets nodig om ze te laten zakken.");
    openTouw();
  },
  windhaan(){ if(!S.f.gust) return say(["Een gouden windhaan op de punt van de kerktoren. Hij draait met de wind mee.", "Zijn kop wijst altijd naar de kant waar de wind vandaan komt."]); if(S.f.wind) return say("De windhaan wijst nog steeds naar het westen. De wind komt uit het westen."); openWind(); },
  kerk3(){ say("De kerktoren. De klok staat op tien voor twaalf. Bijna middernacht, en dan is het 5 december: pakjesavond!"); },
  sint3(){ S.ach.sint3 = true; save(); say(["Daar, op een dak in het maanlicht: Sinterklaas op Ozosnel! Ozosnel stapt van nok naar nok, zo licht als een veertje.", ['sint', "Goedenavond, Hulppiet! Pas goed op, daar boven. Klimpiet, jij ook!"]]); },
  maan(){ say("Een bijna volle maan. Handig: zo zien de Pieten waar ze lopen."); },
  huizen(){ say(["De huizen aan de overkant. Uit twee schoorstenen komt rook: daar branden de kachels nog.", "De rook waait allemaal dezelfde kant op: naar rechts."]); },
  uil(){ say(["Een uil zit op de rand van de kerktoren. Hij kijkt je aan met grote gele ogen.", "Oehoe. Hij doet een oog dicht, en dan het andere. Uilen houden de hele nacht de wacht."]); },
  kat3(){ say([['piet', "Dat is Zwartje, de kat van nummer 6. Die zit hier elke nacht."], ['piet', "Ze vertelt nooit aan iemand dat ze de Pieten heeft gezien. Katten kunnen een geheim bewaren."]]); },
  ladder(){ if(S.f.out3) return startCh4(); say([['piet', "Daar zijn we naar boven geklommen. Pas als alles klaar is gaan we weer naar beneden."]]); }
});

/* ---------- puzzel 1: de Pietencode (elke letter één stap opgeschoven) ---------- */
const PIET_WORD = 'PEPERNOOT';
const shift = (w, n) => w.replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0) - 65 + n + 26) % 26 + 65));
function openCode(){
  openModal('Het slot van de jutezak', 'Een label aan het touw van de zak', `
    <div class="code3">
      <div class="cd-label">Wachtwoord, in <b>Pietencode</b>:<span class="cd-word">${shift(PIET_WORD, 1)}</span><small>Pietencode: elke letter is één stap <b>verder</b> in het alfabet geschoven. Schuif terug om het te lezen! — Klimpiet</small></div>
      <div class="cd-abc">${[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(c => `<span>${c}</span>`).join('')}</div>
      <div class="kl-in"><input type="text" id="cd-in" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Wachtwoord" value="${esc(S.cdi || '')}"><button type="button" class="btn" id="cd-go">Open</button></div>
      <div class="feedback" id="cd-fb"></div>
    </div>`, () => {
    const inp = $('#cd-in'); inp.oninput = () => { S.cdi = inp.value; save(); };
    const go = () => {
      const w = inp.value.toUpperCase().replace(/[^A-Z]/g, '');
      if(w === PIET_WORD){
        S.f.code = true; save(); applyVisuals();
        fb('#cd-fb', 'Q wordt P, F wordt E… PEPERNOOT! Klik, het slot springt open.', 'good');
        return solved(() => say([['piet', "PEPERNOOT! Natuurlijk. Wat zou het anders zijn?"], "Bovenin de zak zit een lijstje: Noor, nummer 8 · Daan, nummer 11 · Lotte, nummer 4.", ['piet', "Drie kinderen in deze straat. Maar welke huizen zijn dat? Je kunt de nummers niet lezen in het donker."]]), 2200);
      }
      nope();
      fb('#cd-fb', w === shift(PIET_WORD, 2) ? 'Je bent de verkeerde kant op geschoven! Q moet een stap terug in het alfabet: Q wordt P.' : 'Dat werkt niet. Zoek elke letter op in het alfabet en neem de letter die er net vóór staat. Q wordt P, F wordt…', 'bad');
    };
    $('#cd-go').onclick = go; inp.onkeydown = e => { if(e.key === 'Enter') go(); };
  });
}

/* ---------- puzzel 2: de huisnummers (even en oneven) ---------- */
const DELIVER3 = [['Noor', 8], ['Daan', 11], ['Lotte', 4]];
function openAdres(){
  const done = S.adr || (S.adr = []);
  const house = n => `<button type="button" class="ad-h${done.includes(n) ? ' done' : ''}" data-n="${n}" aria-label="${n <= 2 ? tx('Huis nummer {n}', { n }) : 'Een huis zonder zichtbaar nummer'}"><span class="ad-roof"></span><span class="ad-num">${n <= 2 || done.includes(n) ? n : '?'}</span></button>`;
  openModal('De Pepernotenstraat', 'Van bovenaf, vanaf het dak gezien', `
    <div class="adres">
      <p class="ad-who" id="ad-who"></p>
      <div class="ad-street">
        <div class="ad-col">${[1, 3, 5, 7, 9, 11, 13].map(house).join('')}</div>
        <div class="ad-road"><span>Pepernotenstraat</span></div>
        <div class="ad-col">${[2, 4, 6, 8, 10, 12, 14].map(house).join('')}</div>
      </div>
      <div class="feedback" id="ad-fb"></div>
    </div>`, body => {
    const who = () => { const nx = DELIVER3.find(([, n]) => !done.includes(n)); $('#ad-who').innerHTML = nx ? tx('Waar woont <b>{name}</b>? Op nummer <b>{n}</b>. Klik op het goede huis.', { name: nx[0], n: nx[1] }) : ''; return nx; };
    who();
    body.querySelectorAll('.ad-h').forEach(b => b.onclick = () => {
      const nx = who(); if(!nx) return;
      const n = +b.dataset.n;
      if(n !== nx[1]){ nope(); return fb('#ad-fb', (n % 2) !== (nx[1] % 2) ? tx('Dat huis staat aan de verkeerde kant van de straat! {n} is een {kind} getal.', { n: nx[1], kind: nx[1] % 2 ? 'oneven' : 'even' }) : 'Goede kant van de straat, maar niet het goede huis. Tel in sprongen van 2 vanaf het huis met het nummer erop.', 'bad'); }
      done.push(n); save(); beep(700, .06); b.classList.add('done'); b.querySelector('.ad-num').textContent = n;
      if(who()) return fb('#ad-fb', tx('Ja! Daar woont {name}.', { name: nx[0] }), 'good');
      S.f.adres = true; save();
      fb('#ad-fb', 'Alle drie gevonden! Aan de ene kant 1, 3, 5, 7… en aan de andere kant 2, 4, 6, 8… Je telt steeds in sprongen van 2.', 'good');
      solved(() => say([['piet', "Kijk eens aan! En wij zitten nu op het dak van nummer 8. Het huis van Noor!"], ['piet', "Pak haar pakjes maar uit de zak."]]), 2400);
    });
  });
}

/* ---------- puzzel 3: welke pakjes passen door de schoorsteen? (de kleinste kant moet door het gat) ---------- */
const GIFTS3 = [['A', 'Een bordspel', [40, 40, 6], false], ['B', 'Een vlieger, opgerold', [10, 10, 90], true], ['C', 'Een knuffelbeer', [25, 25, 35], true], ['D', 'Een poppenhuis', [45, 45, 50], false], ['E', 'Een skateboard', [20, 30, 80], true]];
function openPast(){
  const pick = S.pst || (S.pst = []);
  openModal('Welke pakjes passen?', 'De schoorsteen is 32 bij 32 centimeter', `
    <div class="past">
      <p>Dit zijn de pakjes voor Noor. Welke passen door een gat van <b>32 × 32 cm</b>? Kies ze allemaal. Tip: je mag een pakje ook rechtop door het gat laten zakken.</p>
      <div class="ps-row">${GIFTS3.map(([k, n, [a, b, c]]) => `<button type="button" class="ps-gift${pick.includes(k) ? ' on' : ''}" data-k="${k}"><span class="ps-box ps-${k}"></span><b>${n}</b><small>${a} × ${b} × ${c} cm</small></button>`).join('')}</div>
      <button type="button" class="btn" id="ps-go">Deze passen!</button>
      <div class="feedback" id="ps-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.ps-gift').forEach(b => b.onclick = () => { const k = b.dataset.k; if(pick.includes(k)) pick.splice(pick.indexOf(k), 1); else pick.push(k); b.classList.toggle('on', pick.includes(k)); save(); beep(600, .04); });
    $('#ps-go').onclick = () => {
      const bad = GIFTS3.filter(([k, , , fit]) => pick.includes(k) !== fit);
      if(bad.length){ nope(); const g = bad[0];
        return fb('#ps-fb', g[3] ? tx('{n} past wél! Kijk naar de twee kleinste maten: {a} en {b} cm. Die zijn allebei kleiner dan 32, dus rechtop gaat hij erdoor, hoe lang hij ook is.', { n: g[1], a: [...g[2]].sort((x, y) => x - y)[0], b: [...g[2]].sort((x, y) => x - y)[1] })
          : tx('{n} past niet: zelfs de kleinste kant is te groot voor het gat. Die blijft bij de deur liggen, voor morgen.', { n: g[1] }), 'bad'); }
      S.f.past = true; give('pakjes'); save(); applyVisuals();
      fb('#ps-fb', 'Precies goed! Een pakje past als de twee kleinste maten allebei door het gat kunnen. De vlieger, de beer en het skateboard gaan rechtop naar beneden.', 'good');
      solved(() => say([['piet', "En het bordspel en het poppenhuis? Die brengen we morgen gewoon. Op pakjesavond, in de grote zak!"], ['piet', "Nu de schoorsteen in ermee. Niet gooien, laten zakken!"]]), 2600);
    };
  });
}

/* ---------- puzzel 4: hoe lang moet het touw zijn? (op schaal tekenen: 1 hokje is 1 meter) ---------- */
const ROPES3 = [6, 8, 10, 12];
function openTouw(){
  const cells = (w, h) => Array.from({ length: w * h }, () => '<i></i>').join('');
  openModal('Het touw', 'Van de bovenkant van de schoorsteen tot vlak boven de schoen', `
    <div class="touw3">
      <div class="tw-pic">
        <div class="tw-grid" aria-hidden="true">${cells(8, 12)}</div>
        <svg viewBox="0 0 160 240" class="tw-house" aria-label="Een doorsnede van het huis van Noor, op ruitjespapier">
          <path d="M10 70 L80 20 L150 70" fill="none" stroke="#c21f2b" stroke-width="3"/>
          <rect x="100" y="0" width="20" height="50" fill="#8a3e2a" opacity=".85"/>
          <path d="M10 70 V230 H150 V70" fill="none" stroke="#3a2a1a" stroke-width="3"/>
          <path d="M10 150 H150" stroke="#3a2a1a" stroke-width="2"/>
          <path d="M100 50 V180 M120 50 V180" stroke="#8a3e2a" stroke-width="3"/>
          <path d="M84 230 V180 H136 V230" fill="#2a1a12" stroke="#8a3e2a" stroke-width="4"/>
          <path d="M98 226 q2 -10 12 -10 h6 q4 0 4 6 l8 2 q4 2 2 4z" fill="#4f9a4a"/>
          <path d="M110 4 V180" stroke="#f2b631" stroke-width="2" stroke-dasharray="3 4"/>
        </svg>
      </div>
      <div class="tw-side">
        <p>Op ruitjespapier is <b>1 hokje = 1 meter</b>. Het touw moet van de bovenkant van de schoorsteen recht naar beneden, door de pijp, tot vlak boven Noors schoen in de open haard.</p>
        <p>Klimpiet: <i>"Neem het kortste touw dat lang genoeg is. Anders ligt er morgen een berg touw in de kamer!"</i></p>
        <div class="tw-btns">${ROPES3.map(m => `<button type="button" class="btn ghost" data-m="${m}">${m} meter</button>`).join('')}</div>
        <div class="feedback" id="tw-fb"></div>
      </div>
    </div>`, body => {
    body.querySelectorAll('.tw-btns .btn').forEach(b => b.onclick = () => {
      const m = +b.dataset.m;
      if(m < 9){ nope(); return fb('#tw-fb', tx('Het pakje blijft halverwege hangen! Tel de hokjes van de bovenkant van de bovenkant van de schoorsteen tot vlak boven de schoen. {m} meter is te kort.', { m }), 'bad'); }
      if(m > 10){ nope(); return fb('#tw-fb', 'Dat is lang genoeg, maar er blijft heel veel touw over. Is er een korter touw dat óók lang genoeg is?', 'bad'); }
      S.f.touw = true; take('touw'); take('pakjes'); save(); moment('dak', 'dk-lower', 2600); applyVisuals();
      fb('#tw-fb', 'Van de schoorsteen tot de schoen zijn het 9 hokjes, dus 9 meter. Het touw van 10 meter is net lang genoeg! Zachtjes zakken de pakjes naar beneden…', 'good');
      solved(() => { S.f.gust = true; save(); applyVisuals(); beep(200, .8, 'sine', .04);
        say([['sys', "Plof. De pakjes staan naast Noors schoen. Je trekt het touw weer omhoog."],
             ['sys', "Dan komt er een harde windvlaag over het dak. WHOEEESH!"],
             ['piet', "Mijn muts! Mijn mooiste muts, met de gouden veer! Hij waait weg, over de daken!"],
             ['piet', "Als we weten waar de wind naartoe waait, weten we waar hij ligt. Kijk naar de windhaan op de kerktoren!"]]); }, 2600);
    });
  });
}

/* ---------- puzzel 5: de windhaan (hij wijst naar waar de wind vandaan komt) ---------- */
const DIRS3 = [['N', 'noorden'], ['O', 'oosten'], ['Z', 'zuiden'], ['W', 'westen']];
function openWind(){
  openModal('De windhaan', 'Van bovenaf gezien, met het kompas eronder', `
    <div class="wind3">
      <svg viewBox="0 0 200 200" class="wd-svg" aria-label="De windhaan wijst naar het westen">
        <circle cx="100" cy="100" r="88" fill="#1c2856" stroke="#c9a24a" stroke-width="3"/>
        <path d="M100 18 V182 M18 100 H182" stroke="#c9a24a" stroke-width="2" opacity=".6"/>
        ${[['N', 100, 12], ['O', 192, 106], ['Z', 100, 198], ['W', 8, 106]].map(([l, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="16" font-weight="700" fill="#f2b631" font-family="Fredoka, sans-serif">${l}</text>`).join('')}
        <g class="wd-rooster"><path d="M150 100 H40" stroke="#f2b631" stroke-width="5"/><path d="M40 100 l14 -9 v18z" fill="#f2b631"/>
          <path transform="translate(172 0) scale(-1 1)" d="M70 96 q-8 -22 10 -26 q6 -10 12 0 l10 2 -8 5 q6 14 -6 19z" fill="#f2b631"/><path d="M150 100 l12 -12 v24z" fill="#f2b631"/></g>
      </svg>
      <div class="wd-side">
        <p>Een windhaan draait zich met zijn kop <b>naar de wind toe</b>, net als een vis die tegen de stroom in zwemt. Zijn kop wijst dus naar waar de wind <b>vandaan komt</b>.</p>
        <p>De muts van Klimpiet waait mee met de wind. Naar welke kant is hij gewaaid?</p>
        <div class="wd-btns">${DIRS3.map(([l, n]) => `<button type="button" class="btn ghost" data-d="${l}">Naar het ${n}</button>`).join('')}</div>
        <div class="feedback" id="wd-fb"></div>
      </div>
    </div>`, body => {
    body.querySelectorAll('.wd-btns .btn').forEach(b => b.onclick = () => {
      const d = b.dataset.d;
      if(d === 'W'){ nope(); return fb('#wd-fb', 'Daar komt de wind vandáán! De muts waait de andere kant op, met de wind mee.', 'bad'); }
      if(d !== 'O'){ nope(); return fb('#wd-fb', 'De wind waait recht van het westen naar de overkant. Wat ligt er tegenover het westen?', 'bad'); }
      S.f.wind = true; save();
      fb('#wd-fb', 'Naar het oosten! De wind komt uit het westen en blaast alles naar het oosten. Kijk maar: de rook uit de schoorstenen waait ook die kant op.', 'good');
      solved(win3, 2400);
    });
  });
}

/* ---------- begin en einde ---------- */
function intro3(){
  say([['sys', "De nacht van 4 december. Bijna middernacht. Je staat op het dak, met de maan boven je en de stad onder je."],
       ['piet', "Hulppiet! Je bent gekomen! Ik ben Klimpiet. Ik klim op elk dak, elke schoorsteen en, als het moet, op elke kerktoren."],
       ['piet', "Vannacht is de laatste nacht dat de kinderen hun schoen zetten. En in deze straat moeten nog drie kinderen een cadeautje krijgen."],
       ['piet', "Kijk eens in mijn jutezak. O ja: die zit op slot. Het wachtwoord staat op het label."]], () => { S.f.introDone3 = true; save(); });
}
function startCh3(){
  S = Object.assign(fresh(), { ch: 3, scene: 'dak', ach: S.ach || {}, started: true }); sel = null; setUnlocked(3);
  $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro3();
}
function win3(){
  S.f.out3 = true; save(); applyVisuals(); chord([523,659,784,1046,1318], 120);
  say([['sys', "Klimpiet huppelt over drie daken naar het oosten en vist zijn muts uit een dakgoot. Hij zet hem met een zwaai weer op."],
       ['piet', "Hulppiet, jij bent de beste hulp die een Piet zich kan wensen!"],
       ['sint', "Goed gedaan, allebei. Het is middernacht: het is 5 december! Ga maar gauw naar bed, Hulppiet."],
       ['sint', "En vanavond… vanavond wordt het een groot feest."]], showWin);
}
