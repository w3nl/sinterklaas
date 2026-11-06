// Hoofdstuk 4: pakjesavond, 5 december. Er wordt op de deur gebonsd!
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

function buildFeest(){
  // slingers van gekleurde vlaggetjes langs het plafond
  const cols = ['#d6242f', '#f2b631', '#1f4fa8', '#4f9a4a', '#fff'];
  let g = '';
  [[40, 1560, 40, 130]].forEach(([x0, x1, y0, sag]) => {
    g += `<path d="M${x0} ${y0} Q800 ${y0 + sag * 2} ${x1} ${y0}" stroke="#e9dcc0" stroke-width="2" fill="none"/>`;
    for(let i = 1; i < 30; i++){
      const t = i / 30, x = x0 + (x1 - x0) * t, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * (y0 + sag * 2) + t * t * y0;
      g += `<path class="pa-pennant" style="animation-delay:-${(i * .23).toFixed(2)}s" d="M${x.toFixed(0)} ${y.toFixed(0)} l18 0 l-9 22z" fill="${cols[i % cols.length]}"/>`;
    }
  });
  $('#pa-garland').innerHTML = g;
}
function applyFeest(){
  const f = S.f, show = vis;
  show('#pa-koek', !f.koekTaken); show('#hit-koek4', !f.koekTaken);
  show('#pa-sack', !!f.zak && !f.out4); show('#pa-hit-sack', !!f.zak && !f.out4);
  show('#pa-gifts', !!f.zak); show('#pa-hit-gifts', !!f.zak);
  show('#pa-surprise', !!f.net);
  show('#pa-big', !!f.speur); show('#pa-hit-big', !!f.speur && !f.out4);
  show('#pa-wave', !!f.out4);
  show('#pa-paper', !!f.namen); show('#pa-pepers', !!f.zak); show('#pa-confetti', !!f.out4);
}
KOEK_SAY[4] = ["Tussen de pepernoten op tafel staat een speculaaspop. Je kent hem wel!", ['mama', "Die heeft iemand vanochtend in je schoen gestopt. Raad eens wie?"], "Je stopt hem in je zak. Ook op pakjesavond kan een beetje wijsheid geen kwaad."];
const TODO4 = [['zak', 'de jutezak naar binnen halen'], ['namen', 'uitzoeken van wie de pakjes zijn'], ['gedicht', 'het gedicht voor Oma afmaken'], ['net', 'de surprise vouwen'], ['speur', 'het grootste pakje vinden']];

Object.assign(H, {
  voordeur(){
    if(!S.f.zak){ moment('feest', 'pa-strooi', 2600); vis('#pa-knock', true); setTimeout(() => vis('#pa-knock', false), 1600); beep(110, .12, 'square', .06); setTimeout(() => beep(110, .12, 'square', .06), 220); setTimeout(() => beep(110, .12, 'square', .06), 440);
      return say(["Je rent naar de voordeur en trekt hem open. Er is niemand! Alleen voetstappen in het natte gras, en het geluid van hoefjes in de verte.", "Maar op de stoep staat een enorme jutezak. Er hangt een label aan: VOOR DE FAMILIE VAN HULPPIET."], openZak); }
    say("De voordeur. Buiten is het donker en stil. Sint en de Pieten zijn al verder, naar het volgende huis.");
  },
  zak4(){
    if(!S.f.namen) return say([['papa', "Eerst de pakjes uitdelen! Maar ik zie geen namen. Hoe weten we nou van wie ze zijn?"]]);
    if(!S.f.gedicht) return say("Onderin de zak voel je nog iets. Maar eerst het gedicht voor Oma: zij zit met haar pakje op schoot te wachten.");
    if(!S.f.net) return openNet();
    if(!S.f.speur) return openSpeur();
    say("De zak is leeg. Je kruipt er even in. Het ruikt naar pepernoten en dakpannen.");
  },
  pakjes(){ if(S.f.namen) return say("Iedereen heeft zijn pakje: de bal voor Sem, het boek voor Oma, de hengel voor Papa en de sjaal voor Mama."); openNamen(); },
  papa(){
    if(!S.f.introDone4) return;
    if(S.f.namen) return say([['papa', "Een hengel! Hoe wist Sint dat ik zo graag vis? Nou ja, Sint weet alles."]]);
    say([['papa', "Ik heb een mijter van de krant op, zie je dat? Zelf gevouwen."], ['papa', TODO4.filter(([k]) => !S.f[k]).length ? tx('Wat er nog moet: {list}.', { list: TODO4.filter(([k]) => !S.f[k]).map(([, t]) => t).join(', ') }) : "Wat een avond!"]]);
  },
  oma(){
    if(!S.f.namen) return say([['oma', "Ik brei al mijn sjaals zelf, lieverd. Ik heb er drieënveertig. Ik hoop dat Sint dat weet."]]);
    if(S.f.gedicht) return say([['oma', "Wat een mooi gedicht. Stoel en doel, bank en dank: het rijmt als een klok!"]]);
    openGedicht();
  },
  mama(){ say(S.f.namen ? [['mama', "Een zachte sjaal! Precies wat ik nodig had. Oma breit ze alleen nog maar voor zichzelf."]] : [['mama', "Wat een spanning! Wie haalt de zak binnen?"]]); },
  sem(){ S.f.semTaps = (S.f.semTaps || 0) + 1; save();
    if(S.f.semTaps >= 3){ S.ach.sem = true; save(); return say([['sem', "Sinterkaas! Sinterkaas! Piet piet piet!"], "Sem zingt het hele liedje. Twee keer. Met de verkeerde woorden, maar heel hard."]); }
    say([['sem', S.f.namen ? "BAL! Mijn bal!" : "Pakjes? Pakjes!"], "Je broertje Sem huppelt op en neer van opwinding."]); },
  kachel4(){ say("De houtkachel brandt. Je schoen staat er niet meer: vanavond komen de pakjes niet in je schoen, maar in een zak!"); },
  raam4(){ say(S.f.out4 ? "Daar, op het dak aan de overkant! Sinterklaas en Klimpiet zwaaien naar je. Je zwaait terug met beide handen." : "Buiten is het donker. Je ziet niemand. Toch voel je dat er iemand kijkt…"); },
  pepernoten(){ S.f.pep = (S.f.pep || 0) + 1; save();
    if(S.f.pep >= 5){ S.ach.pepernoot = true; save(); return say(["Je pakt nog een handje pepernoten. En nog een. En nog een.", ['mama', "Hé! Bewaar er ook nog wat voor de rest!"]]); }
    say("Je eet een pepernoot. Kruidig en knapperig. Mmm."); },
  choco(){ say("Twee bekers warme chocolademelk. Met een snor van schuim, als je drinkt. Net een kleine Sinterklaas."); },
  spandoek(){ say("WELKOM SINTERKLAAS! Mama heeft het geschilderd, Sem heeft de handafdrukken gezet. Overal. Ook op de bank."); },
  groot(){ if(S.f.speur) return win4(); }
});

/* ---------- puzzel 1: de zware zak (wielen maken trekken veel makkelijker) ---------- */
const MOVE4 = [['til', 'Optillen', 'Je zakt door je knieën en tilt… de zak komt geen centimeter omhoog. Hij weegt minstens zo veel als Papa!'],
  ['sleep', 'Over de vloer slepen', 'Je trekt en trekt. De zak schuurt over de stoep en komt bijna niet vooruit. Dat schuren heet wrijving: het remt alles af.'],
  ['skate', 'Op het skateboard van Sem zetten', ''],
  ['roep', 'Hard om hulp roepen', 'Papa komt helpen, en samen tillen jullie… au, zijn rug! "Er moet een slimmere manier zijn," kreunt hij.']];
function openZak(){
  openModal('De jutezak', 'Op de stoep · hoe krijg je hem naar binnen?', `
    <div class="zak4">
      <p>De zak is loodzwaar. In de gang staan Sems speelgoed en het skateboard van Sem. Hoe krijg je hem naar binnen?</p>
      <div class="zk-btns">${MOVE4.map(([k, n]) => `<button type="button" class="btn ghost" data-k="${k}">${n}</button>`).join('')}</div>
      <div class="feedback" id="zk-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.zk-btns .btn').forEach(b => b.onclick = () => {
      const [k, , msg] = MOVE4.find(m => m[0] === b.dataset.k);
      if(k !== 'skate'){ nope(); return fb('#zk-fb', msg, 'bad'); }
      S.f.zak = true; save();
      fb('#zk-fb', 'Je rolt de zak op het skateboard, en hij glijdt zo de kamer in! Wielen rollen in plaats van schuren: daardoor is er veel minder wrijving. Daarom hebben karren, auto\'s en koffers wielen.', 'good');
      solved(() => { applyVisuals();
        say([['sys', "Iedereen juicht. Je maakt de zak open: hij zit vol pakjes! Maar wat raar: er staan geen namen op."],
             ['papa', "Hier ligt een briefje van Sint."],
             ['sint', "(op het briefje) Beste familie. Klimpiet heeft de naamkaartjes per ongeluk opgegeten. Gelukkig heb ik een paar aanwijzingen opgeschreven."]]); }, 3000);
    });
  });
}

/* ---------- puzzel 2: van wie is welk pakje? (logisch redeneren) ---------- */
const PEOPLE4 = ['Papa', 'Mama', 'Oma', 'Sem'];
const GIFTS4 = [['rond', 'Het ronde pakje', 'Sem'], ['plat', 'Het platte pakje', 'Oma'], ['lang', 'Het lange pakje', 'Papa'], ['zacht', 'Het zachte pakje', 'Mama']];
function openNamen(){
  const a = S.nm || (S.nm = {});
  openModal('Van wie is welk pakje?', 'Het briefje van Sinterklaas', `
    <div class="namen">
      <ol class="nm-clues">
        <li>Het <b>ronde</b> pakje is voor de <b>jongste</b> van de familie.</li>
        <li>Oma breit haar sjaals zelf. Zij krijgt iets wat <b>niet zacht</b> is.</li>
        <li>Het <b>lange</b> pakje is <b>niet</b> voor een vrouw.</li>
        <li>Elk pakje is voor iemand anders.</li>
      </ol>
      <div class="nm-grid">${GIFTS4.map(([k, n]) => `<label class="nm-row"><span class="nm-pic nm-${k}"></span><b>${n}</b><select data-k="${k}" aria-label="${tx('{n} is voor', { n })}"><option value="">is voor…</option>${PEOPLE4.map(p => `<option${a[k] === p ? ' selected' : ''}>${p}</option>`).join('')}</select></label>`).join('')}</div>
      <button type="button" class="btn" id="nm-go">Uitdelen!</button>
      <div class="feedback" id="nm-fb"></div>
    </div>`, body => {
    body.querySelectorAll('select').forEach(s => s.onchange = () => { a[s.dataset.k] = s.value; save(); });
    $('#nm-go').onclick = () => {
      if(GIFTS4.some(([k]) => !a[k])) return fb('#nm-fb', 'Kies voor elk pakje voor wie het is.', 'bad');
      const who = GIFTS4.map(([k]) => a[k]);
      if(new Set(who).size < 4){ nope(); return fb('#nm-fb', 'Iemand krijgt nu twee pakjes, en iemand anders niks! Aanwijzing 4: elk pakje is voor iemand anders.', 'bad'); }
      const wrong = GIFTS4.find(([k, , p]) => a[k] !== p);
      if(wrong){ nope();
        return fb('#nm-fb', a.rond !== 'Sem' ? 'Wie is de jongste van de familie? Begin bij aanwijzing 1.'
          : a.zacht === 'Oma' ? 'Oma krijgt iets wat niet zacht is (aanwijzing 2).'
          : a.lang !== 'Papa' ? 'Het lange pakje is niet voor een vrouw. Wie blijft er dan over, nu Sem al het ronde pakje heeft?'
          : 'Bijna! Als Sem het ronde en Papa het lange pakje heeft, wat kan Oma dan nog krijgen als het niet zacht mag zijn?', 'bad'); }
      S.f.namen = true; save();
      fb('#nm-fb', 'Sem is de jongste: het ronde pakje. Het lange is niet voor een vrouw en Sem heeft er al een, dus Papa. Oma mag niets zachts: het platte pakje. Dan blijft het zachte over voor Mama!', 'good');
      solved(() => say([['sys', "Iedereen pakt uit. Een bal voor Sem, een hengel voor Papa, een zachte sjaal voor Mama, en een boek voor Oma."],
        ['oma', "Er zit een gedicht bij mijn pakje! Maar er zit een vlek chocolademelk op, er missen woorden. Help je me even, lieverd?"]]), 3200);
    };
  });
}

/* ---------- puzzel 3: het gedicht voor Oma (rijm: dezelfde klank aan het eind) ---------- */
const POEM4 = [['Sinterklaas zat diep na te denken in zijn stoel:', null], ['wat geef ik Oma? Wat is mijn', ['plan', 'doel', 'idee']], ['Ze leest zo graag, in bed of op de bank,', null], ['dus krijgt ze dit boek. Zeg Sint maar', ['bedankt', 'hoi', 'dank']]];
const POEM4_OK = { 1: 'doel', 3: 'dank' };
function openGedicht(){
  const pick = S.gd || (S.gd = {});
  openModal('Het gedicht voor Oma', 'Met een chocoladevlek', `
    <div class="gedicht">
      <div class="gd-paper">${POEM4.map(([line, opts], i) => `<p>${line}${opts ? ` <span class="gd-gap">${opts.map(o => `<button type="button" class="gd-opt${pick[i] === o ? ' on' : ''}" data-i="${i}" data-w="${o}">${o}</button>`).join('')}</span>${i === 1 ? '?' : '!'}` : ''}</p>`).join('')}<div class="gd-sig">— Sint en Piet</div><span class="gd-stain"></span></div>
      <p class="gd-tip">Een sinterklaasgedicht <b>rijmt</b>: de laatste woorden van twee regels klinken aan het eind hetzelfde, zoals <i>Piet</i> en <i>niet</i>.</p>
      <button type="button" class="btn" id="gd-go">Voorlezen!</button>
      <div class="feedback" id="gd-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.gd-opt').forEach(b => b.onclick = () => { pick[b.dataset.i] = b.dataset.w; save(); body.querySelectorAll(`.gd-opt[data-i="${b.dataset.i}"]`).forEach(x => x.classList.toggle('on', x === b)); beep(650, .04); });
    $('#gd-go').onclick = () => {
      if(!pick[1] || !pick[3]) return fb('#gd-fb', 'Kies voor elk gat een woord.', 'bad');
      if(pick[1] !== POEM4_OK[1]){ nope(); return fb('#gd-fb', tx('"Stoel" en "{w}"… dat rijmt niet. Welk woord eindigt op dezelfde klank als stoel: -oel?', { w: pick[1] }), 'bad'); }
      if(pick[3] !== POEM4_OK[3]){ nope(); return fb('#gd-fb', pick[3] === 'bedankt' ? '"Bedankt" betekent hetzelfde, maar "bank" en "bedankt" rijmen niet. Welk woord eindigt op -ank?' : tx('"Bank" en "{w}" rijmen niet. Welk woord eindigt op -ank?', { w: pick[3] }), 'bad'); }
      S.f.gedicht = true; save();
      fb('#gd-fb', 'Stoel en doel, bank en dank: dat rijmt! Oma klapt in haar handen.', 'good');
      solved(() => say([['oma', "Prachtig voorgelezen! Daar krijg ik zin van om zelf een gedicht te maken."], ['oma', "Er zit nog iets in de zak, geloof ik. Iets plats, van karton."]]), 2400);
    };
  });
}

/* ---------- puzzel 4: de surprise (welke bouwplaat wordt een kubus?) ---------- */
/* Elke bouwplaat: zes vakjes [kolom, rij]. Twee worden een kubus, twee niet. */
const NETS4 = [
  ['A', [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], true],
  ['B', [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], false],
  ['C', [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], true],
  ['D', [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]], false]
];
function openNet(){
  const pick = S.nt || (S.nt = []);
  const net = cells => { const w = 4, h = 4, s = 22;
    return `<svg viewBox="0 0 ${w * s + 4} ${h * s + 4}" class="nt-svg" aria-hidden="true">${cells.map(([x, y], i) => `<rect x="${x * s + 2}" y="${y * s + 2}" width="${s}" height="${s}" fill="#f6ead2" stroke="#8a6a4a" stroke-width="2"/>${'⚀⚁⚂⚃⚄⚅'[i] ? `<text x="${x * s + 2 + s / 2}" y="${y * s + 2 + s / 2 + 5}" text-anchor="middle" font-size="12" fill="#c21f2b">${i + 1}</text>` : ''}`).join('')}</svg>`; };
  openModal('De surprise', 'Een vel karton, met een briefje: "Vouw er een dobbelsteen van, voor een spelletje!"', `
    <div class="netten">
      <p>Een kubus (zoals een dobbelsteen) heeft <b>6 vierkante vlakken</b>. Als je hem openvouwt en plat legt, heet dat een <b>bouwplaat</b>. Op het karton staan vier bouwplaten, met zes vlakjes elk. Maar niet elke vorm wordt een kubus! Kies <b>alle</b> bouwplaten die wél een kubus worden.</p>
      <div class="nt-row">${NETS4.map(([k, cells]) => `<button type="button" class="nt-card${pick.includes(k) ? ' on' : ''}" data-k="${k}">${net(cells)}<b>${k}</b></button>`).join('')}</div>
      <p class="nt-tip">Tip: stel je voor dat je het middelste vlakje op tafel legt en de andere vlakjes omhoog vouwt. Komen er twee op dezelfde plek? Dan wordt het geen kubus.</p>
      <button type="button" class="btn" id="nt-go">Vouwen!</button>
      <div class="feedback" id="nt-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.nt-card').forEach(b => b.onclick = () => { const k = b.dataset.k; if(pick.includes(k)) pick.splice(pick.indexOf(k), 1); else pick.push(k); b.classList.toggle('on', pick.includes(k)); save(); beep(600, .04); });
    $('#nt-go').onclick = () => {
      const bad = NETS4.find(([k, , ok]) => pick.includes(k) !== ok);
      if(bad){ nope();
        return fb('#nt-fb', bad[0] === 'B' ? 'Bouwplaat B is een rechthoek van 2 bij 3. Vouw je die, dan heb je een soort buisje zonder deksel en zonder bodem: geen kubus!'
          : bad[0] === 'D' ? 'Bij bouwplaat D zitten twee flapjes naast elkaar boven de rij. Vouw je ze omhoog, dan komen ze allebei op dezelfde plek: de bovenkant. En de onderkant blijft open!'
          : tx('Bouwplaat {k} wordt wél een kubus! Probeer hem in gedachten te vouwen: de rij van vier wordt de zijkanten, en de losse vlakjes worden boven en onder.', { k: bad[0] }), 'bad'); }
      S.f.net = true; save(); applyVisuals();
      fb('#nt-fb', 'A en C worden een kubus: een rij van vier rondom, met één vlakje voor boven en één voor onder. Je knipt bouwplaat A uit, vouwt hem, en tekent de stippen erop. Een dobbelsteen!', 'good');
      solved(() => say([['papa', "Een dobbelsteen! Dan kunnen we straks ganzenbord spelen."], "Als je de surprise uit de zak haalt, valt er nog een briefje uit. Het handschrift van Sinterklaas!"]), 2800);
    };
  });
}

/* ---------- puzzel 5: de speurtocht (coördinaten: eerst de letter, dan het getal) ---------- */
const COLS4 = 'ABCDEF', SPEUR_GOAL = 'F4';
function openSpeur(){
  if(!S.f.gedicht) return say("Er zit nog een briefje in de zak, maar Oma wacht eerst op haar gedicht.");
  const cell = (c, r) => `<button type="button" class="sp-c" data-c="${c}${r}" aria-label="${c}${r}"></button>`;
  const PLAN = { A4: 'deur', B1: 'kachel', D3: 'bank', E5: 'raam', A1: 'kast' };
  openModal('De speurtocht', 'Het laatste briefje van Sinterklaas', `
    <div class="speur">
      <div class="sp-note">Beste Hulppiet,<br>het mooiste pakje heb ik verstopt. Begin bij de <b>kachel</b>. Loop <b>4 vakjes naar rechts</b> en dan <b>3 vakjes omhoog</b>. Daar ligt het!<br><i>— Sint</i></div>
      <div class="sp-plan">
        <div class="sp-rows">${[5, 4, 3, 2, 1].map(r => `<span>${r}</span>`).join('')}</div>
        <div class="sp-grid">${[5, 4, 3, 2, 1].map(r => [...COLS4].map(c => cell(c, r)).join('')).join('')}</div>
        <div class="sp-cols"><span></span>${[...COLS4].map(c => `<span>${c}</span>`).join('')}</div>
      </div>
      <p class="sp-tip">De plattegrond van de kamer. Een vakje heeft een naam: eerst de <b>letter</b> van de kolom, dan het <b>getal</b> van de rij. De kachel staat op <b>B1</b>.</p>
      <div class="feedback" id="sp-fb"></div>
    </div>`, body => {
    Object.entries(PLAN).forEach(([k, n]) => { const b = body.querySelector(`.sp-c[data-c="${k}"]`); if(b){ b.classList.add('sp-' + n); b.title = n; } });
    body.querySelectorAll('.sp-c').forEach(b => b.onclick = () => {
      const c = b.dataset.c;
      if(c !== SPEUR_GOAL){ nope(); b.classList.add('miss');
        return fb('#sp-fb', c === 'E3' ? 'Bijna! Van B naar rechts: C, D, E, F. Dat zijn 4 stappen, niet 3.' : c === 'D5' || c === 'D4' ? 'Eerst 4 vakjes naar rechts (de letters), dan 3 omhoog (de getallen). Begin bij B1.' : tx('Op {c} ligt alleen een pepernoot. Begin bij de kachel op B1, tel 4 vakjes naar rechts, en dan 3 omhoog.', { c }), 'bad'); }
      S.f.speur = true; save(); b.classList.add('found'); applyVisuals();
      fb('#sp-fb', 'Van B1 vier vakjes naar rechts: C1, D1, E1, F1. Dan drie omhoog: F2, F3, F4. Op F4, achter de gordijnen, staat het grootste pakje van allemaal!', 'good');
      solved(() => say(["Achter de gordijnen staat een groot goudgeel pakje met een rode strik. Op het label staat jouw naam."]), 2600);
    });
  });
}

/* ---------- begin en einde ---------- */
function intro4(){
  say([['sys', "5 december. Pakjesavond! De kachel brandt, de kaarsen branden, en iedereen zit in de kamer."],
       ['papa', "Zullen we nog een liedje zingen? Misschien hoort Sinterklaas ons."],
       ['sys', "Jullie zingen zo hard dat de pepernoten op tafel trillen. En dan, midden in het liedje…"],
       ['sys', "BONK BONK BONK! Er wordt op de voordeur gebonsd!"],
       ['mama', "Hulppiet, ga jij eens kijken?"]], () => { S.f.introDone4 = true; save(); });
}
function startCh4(){
  S = Object.assign(fresh(), { ch: 4, scene: 'feest', ach: S.ach || {}, started: true }); sel = null; setUnlocked(4);
  $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro4();
}
function win4(){
  S.f.out4 = true; save(); applyVisuals(); chord([523,659,784,1046,1318,1568], 120);
  say([['sys', "Je maakt het grote pakje open. Er zit een echte Pietenmuts in, groen met een gouden veer. En een oorkonde."],
       ['sint', "(op de oorkonde) Hierbij benoem ik jou tot Officiële Hulppiet van Sinterklaas. Voor altijd. Want jij helpt, ook als het moeilijk wordt."],
       ['sys', "Je zet de muts op. Hij past precies. Sem wil hem ook, maar hij is maat 30."],
       ['sys', "Door het raam zie je iets bewegen. Op het dak aan de overkant staan Sinterklaas en Klimpiet. Ze zwaaien naar je!"],
       ['piet', "Tot volgend jaar, Hulppiet!"],
       ['sint', "Dag lieve Hulppiet. Dank je wel voor alles. Tot volgend jaar!"]], showWin);
}
