// Hoofdstuk 5: pakjesavond, 5 december. Er wordt op de deur gebonsd!
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
  show('#pa-sack', !!f.zak && !f.out5); show('#pa-hit-sack', !!f.zak && !f.out5);
  show('#pa-gifts', !!f.zak); show('#pa-hit-gifts', !!f.zak);
  show('#pa-surprise', !!f.net);
  show('#pa-big', !!f.speur); show('#pa-hit-big', !!f.speur && !f.out5);
  show('#pa-wave', !!f.out5);
  show('#pa-paper', !!f.namen); show('#pa-pepers', !!f.zak && !f.delen); show('#pa-confetti', !!f.out5);
  show('#pa-hit-floor', !!f.zak && !f.delen); show('#pa-saab', !!f.zak); show('#pa-hit-saab', !!f.zak);
}
KOEK_SAY[5] = ["Tussen de pepernoten op tafel staat een speculaaspop. Je kent hem wel!", ['mama', "Die heeft iemand vanochtend in je schoen gestopt. Raad eens wie?"], "Je stopt hem in je zak. Ook op pakjesavond kan een beetje wijsheid geen kwaad."];
const TODO5 = [['zak', 'de jutezak naar binnen halen'], ['delen', 'de pepernoten eerlijk verdelen'], ['namen', 'uitzoeken van wie de pakjes zijn'], ['gedicht', 'het gedicht voor Oma afmaken'], ['lootjes', 'de lootjes van Sint uitzoeken'], ['net', 'de surprise vouwen'], ['speur', 'het grootste pakje vinden']];
function applyGang(){ vis('#ga-envelope', S.ch === 5 && !!S.f.gedicht && !S.f.lootjes); vis('#ga-garland', S.ch === 5); }

Object.assign(H, {
  voordeur(){
    if(!S.f.zak){ moment('feest', 'pa-strooi', 2600); vis('#pa-knock', true); setTimeout(() => vis('#pa-knock', false), 1600); beep(110, .12, 'square', .06); setTimeout(() => beep(110, .12, 'square', .06), 220); setTimeout(() => beep(110, .12, 'square', .06), 440);
      return say(["Je doet de kamerdeur op een kier, en meteen vliegt er een handvol pepernoten naar binnen! Ze rollen over de hele vloer.", "Wie gooit er nou…? Je rent de gang in, naar de voordeur."], () => go('gang')); }
    go('gang');
  },
  /* de gang (in hoofdstuk 2 ga je hier alleen de trap op) */
  buitendeur(){
    if(S.ch === 2) return say(["De voordeur. Hij zit op slot, en buiten is het donker en koud.", ['mama', "(uit de kamer) Daar ga je nu niet meer naar buiten, lieverd. Het is bijna bedtijd!"]]);
    if(!S.f.zak) return say(["Je trekt de voordeur open. Er is niemand! Alleen voetstappen in het natte gras, en het geluid van hoefjes in de verte.", "Maar op de stoep staat een enorme jutezak. Er hangt een label aan: VOOR DE FAMILIE VAN HULPPIET."], openZak);
    say("De voordeur. Buiten is het donker en stil. Sint en de Pieten zijn al verder, naar het volgende huis.");
  },
  brievenbus(){
    if(S.ch === 2) return say("De brievenbus. Er zit een folder in van de speelgoedwinkel. Anne-Lieve heeft al overal kruisjes gezet.");
    if(S.f.lootjes) return say("De brievenbus. Er zit niks meer in. Alleen een pepernoot. Hoe komt die daar nou?");
    if(S.f.gedicht) return openLootjes();
    say("Een koperen brievenbus. Er zit niks in. Nog niet.");
  },
  trap4(){ if(S.ch === 2) return toBed2(); say(["De trap naar boven, naar de slaapkamers.", "Niet nu! Het is pakjesavond. Naar bed gaan kan altijd nog."]); },
  kapstok(){ const m = $('#ga-mitre'); if(gag(m, 'fall', 5000)){ gagText(m, 'Oeps!'); beep(500, .2, 'triangle', .04); }
    say(["De kapstok. De blauwe jas van Papa, de paarse jas van Oma en een oranje sjaal. Natuurlijk zelf gebreid.", "Er valt een mijter van krantenpapier naar beneden. Papa heeft er een heleboel."]); },
  kaars(h){ const c = h.dataset.c; if(!gag('#pa-c' + c, 'out', 3500)) return; gag('#pa-g' + c, 'out', 3500); gagText($('#pa-c' + c), 'Pfff!'); beep(300, .25, 'sine', .03);
    S.f.kaarsTaps = (S.f.kaarsTaps || 0) + 1; save(); if(S.f.kaarsTaps === 2) setTimeout(() => say([['sem', "Nog een keer! Nog een keer! Ik ben jarig!"], ['oma', "Je bent niet jarig, Anne-Lieve. Sinterklaas is jarig."]]), 800); },
  skate(){ say(S.ch === 5 && S.f.zak ? "Het skateboard van Silvie. Het heeft de zak naar binnen gereden. Silvie is er heel trots op." : "Het skateboard van Silvie. Het staat tegen de muur, naast de voordeur."); },
  terug4(){ go(S.ch === 2 ? 'kamer' : 'feest'); },
  /* de woonkamer */
  strooigoed(){ if(S.f.delen) return; openDelen(); },
  saab4(){
    const c = $('#pa-saab');
    if(gag(c, 'broem', 2400)){ gagText(c, 'BROEM BROEM!'); [90, 110, 140, 120, 160, 200].forEach((f, i) => setTimeout(() => beep(f, .16, 'sawtooth', .05), i * 140)); }
    if(S.ach.saab) return;
    S.ach.saab = true; save();
    setTimeout(() => say(["Een klein rood autootje met een lange neus en een rond dak. Een Saab 900!", ['papa', "Hee, die is van mij! Die heb ik al sinds ik zo oud was als Anne-Lieve. Sint vond vast dat hij een nieuw doosje verdiende."], ['oma', "Je vader wilde vroeger alleen maar Saab rijden. Hij reed door de kamer en riep: BROEM BROEM, hier komt de Saab!"], ['sem', "Broem broem! Broem broem!"]]), 1200); },
  zak4(){
    if(!S.f.namen) return say([['papa', "Eerst de pakjes uitdelen! Maar ik zie geen namen. Hoe weten we nou van wie ze zijn?"]]);
    if(!S.f.gedicht) return say("Onderin de zak voel je nog iets. Maar eerst het gedicht voor Oma: zij zit met haar pakje op schoot te wachten.");
    if(!S.f.lootjes) return say("Onderin de zak voel je nog iets plats, van karton. Maar eerst: wat viel er door de brievenbus?");
    if(!S.f.net) return openNet();
    if(!S.f.speur) return openSpeur();
    say("De zak is leeg. Je kruipt er even in. Het ruikt naar pepernoten en dakpannen.");
  },
  pakjes(){ if(S.f.namen) return say("Iedereen heeft een pakje: de bal voor Anne-Lieve, het kettinkje voor Silvie, het boek voor Oma, de hengel voor Papa en de sjaal voor Mama."); openNamen(); },
  papa(){
    if(!S.f.introDone5) return;
    if(S.f.namen) return say([['papa', "Een hengel! Hoe wist Sint dat ik zo graag vis? Nou ja, Sint weet alles."]]);
    say([['papa', "Ik heb een mijter van de krant op, zie je dat? Zelf gevouwen."], ['papa', TODO5.filter(([k]) => !S.f[k]).length ? tx('Wat er nog moet: {list}.', { list: TODO5.filter(([k]) => !S.f[k]).map(([, t]) => t).join(', ') }) : "Wat een avond!"]]);
  },
  oma(){
    if(!S.f.namen) return say([['oma', "Ik brei al mijn sjaals zelf, lieverd. Ik heb er drieënveertig. Ik hoop dat Sint dat weet."]]);
    if(S.f.gedicht) return say([['oma', "Wat een mooi gedicht. Stoel en doel, bank en dank: het rijmt als een klok!"]]);
    openGedicht();
  },
  mama(){ say(S.f.namen ? [['mama', "Een zachte sjaal! Precies wat ik nodig had. Oma breit ze alleen nog maar voor zichzelf."]] : [['mama', "Wat een spanning! Wie haalt de zak binnen?"]]); },
  sem(){ S.f.semTaps = (S.f.semTaps || 0) + 1; save();
    if(S.f.semTaps >= 3){ S.ach.sem = true; save(); return say([['sem', "♪ Sinterklaasje, bonne, bonne, bonne, gooi wat in mijn… eh… BAL, BAL, BAL! ♪", 'bonne'], "Anne-Lieve zingt het hele liedje. Twee keer. Met de verkeerde woorden, maar heel hard."]); }
    say([['sem', S.f.namen ? "BAL! Mijn bal!" : "Pakjes? Pakjes!"], "Je zusje Anne-Lieve huppelt op en neer van opwinding."]); },
  silvie(){ S.f.silvieTaps = (S.f.silvieTaps || 0) + 1; save();
    if(S.f.namen) return say([['silvie', S.f.silvieTaps % 2 ? "Een kettinkje met een S! Sint weet echt alles." : "Doe niet zo gek, ik ben echt niet te oud voor pakjesavond. Niemand is te oud voor pakjesavond."]]);
    say([['silvie', S.f.silvieTaps % 2 ? "Ik ben je grote zus, dus ik weet alles over Sinterklaas. Maar ik zeg niks!" : "Anne-Lieve, ga nou eens zitten. Je maakt me duizelig."]]); },
  kachel4(){ say("De houtkachel brandt. Je schoen staat er niet meer: vanavond komen de pakjes niet in je schoen, maar in een zak!"); },
  raam4(){ say(S.f.out5 ? "Daar, op het dak aan de overkant! Sinterklaas en Klimpiet zwaaien naar je. Je zwaait terug met beide handen." : "Buiten is het donker. Je ziet niemand. Toch voel je dat er iemand kijkt…"); },
  pepernoten(){ S.f.pep = (S.f.pep || 0) + 1; save();
    if(S.f.pep >= 5){ S.ach.pepernoot = true; save(); return say(["Je pakt nog een handje pepernoten. En nog een. En nog een.", ['mama', "Hé! Bewaar er ook nog wat voor de rest!"]]); }
    say("Je eet een pepernoot. Kruidig en knapperig. Mmm."); },
  choco(){ say("Twee bekers warme chocolademelk. Met een snor van schuim, als je drinkt. Net een kleine Sinterklaas."); },
  spandoek(){ const b = $('#sc-feest .pa-banner'); if(gag(b, 'droop', 5000)){ gagText(b, 'Oeps!'); beep(400, .3, 'triangle', .04); setTimeout(() => beep(140, .2, 'sawtooth', .04), 500); }
    say(["WELKOM SINTERKLAAS! De linkerkant laat los, en het spandoek zwaait naar beneden. Het hangt nog maar aan één punaise.", "Mama heeft het geschilderd, Anne-Lieve heeft de handafdrukken gezet. Overal. Ook op de bank.", ['papa', "Ik hang hem zo wel weer op. Waar is het plakband?"]]); },
  groot(){ if(S.f.speur) return win5(); }
});

/* ---------- puzzel 1: de zware zak (wielen maken trekken veel makkelijker) ---------- */
const MOVE4 = [['til', 'Optillen', 'Je zakt door je knieën en tilt… de zak komt geen centimeter omhoog. Hij weegt minstens zo veel als Papa!'],
  ['sleep', 'Over de vloer slepen', 'Je trekt en trekt. De zak schuurt over de stoep en komt bijna niet vooruit. Dat schuren heet wrijving: het remt alles af.'],
  ['skate', 'Op het skateboard van Silvie zetten', ''],
  ['roep', 'Hard om hulp roepen', 'Papa komt helpen, en samen tillen jullie… au, zijn rug! "Er moet een slimmere manier zijn," kreunt hij.']];
function openZak(){
  openModal('De jutezak', 'Op de stoep · hoe krijg je hem naar binnen?', `
    <div class="zak4">
      <p>De zak is loodzwaar. In de gang staan het speelgoed van Anne-Lieve en het skateboard van Silvie. Hoe krijg je hem naar binnen?</p>
      <div class="zk-btns">${MOVE4.map(([k, n]) => `<button type="button" class="btn ghost" data-k="${k}">${n}</button>`).join('')}</div>
      <div class="feedback" id="zk-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.zk-btns .btn').forEach(b => b.onclick = () => {
      const [k, , msg] = MOVE4.find(m => m[0] === b.dataset.k);
      if(k !== 'skate'){ nope(); return fb('#zk-fb', msg, 'bad'); }
      S.f.zak = true; save();
      fb('#zk-fb', 'Je rolt de zak op het skateboard, en hij glijdt zo de kamer in! Wielen rollen in plaats van schuren: daardoor is er veel minder wrijving. Daarom hebben karren, auto\'s en koffers wielen.', 'good');
      solved(() => { go('feest'); setTimeout(() => say([['sys', "Je rolt de zak door de gang de kamer in. Iedereen juicht. Je maakt de zak open: hij zit vol pakjes! Maar wat raar: er staan geen namen op."],
             ['papa', "Hier ligt een briefje van Sint."],
             ['sint', "(op het briefje) Beste familie. Klimpiet heeft de naamkaartjes per ongeluk opgegeten. Gelukkig heb ik een paar aanwijzingen opgeschreven."],
             ['mama', "En eerst al die pepernoten van de vloer rapen, voor iemand erop gaat staan!"]]), 450); }, 3000);
    });
  });
}

/* ---------- puzzel 2: van wie is welk pakje? (logisch redeneren) ---------- */
const PEOPLE4 = ['Papa', 'Mama', 'Oma', 'Silvie', 'Anne-Lieve'];
const GIFTS4 = [['rond', 'Het ronde pakje', 'Anne-Lieve'], ['plat', 'Het platte pakje', 'Oma'], ['klein', 'Het kleine doosje', 'Silvie'], ['lang', 'Het lange pakje', 'Papa'], ['zacht', 'Het zachte pakje', 'Mama']];
function openNamen(){
  const a = S.nm || (S.nm = {});
  openModal('Van wie is welk pakje?', 'Het briefje van Sinterklaas', `
    <div class="namen">
      <ol class="nm-clues">
        <li>Het <b>ronde</b> pakje is voor de <b>jongste</b> van de familie.</li>
        <li>Het <b>kleine doosje</b> is voor de <b>oudste</b> van de kinderen.</li>
        <li>Oma breit haar sjaals zelf. Zij krijgt iets wat <b>niet zacht</b> is.</li>
        <li>Het <b>lange</b> pakje is <b>niet</b> voor een vrouw of een meisje.</li>
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
      if(new Set(who).size < GIFTS4.length){ nope(); return fb('#nm-fb', 'Iemand krijgt nu twee pakjes, en iemand anders niks! Aanwijzing 5: elk pakje is voor iemand anders.', 'bad'); }
      const wrong = GIFTS4.find(([k, , p]) => a[k] !== p);
      if(wrong){ nope();
        return fb('#nm-fb', a.rond !== 'Anne-Lieve' ? 'Wie is de jongste van de familie? Begin bij aanwijzing 1.'
          : a.klein !== 'Silvie' ? 'Wie is de oudste van de kinderen? Kijk naar aanwijzing 2.'
          : a.zacht === 'Oma' ? 'Oma krijgt iets wat niet zacht is (aanwijzing 3).'
          : a.lang !== 'Papa' ? 'Het lange pakje is niet voor een vrouw of een meisje. Wie blijft er dan over?'
          : 'Bijna! Als Papa het lange pakje heeft, wat kan Oma dan nog krijgen als het niet zacht mag zijn?', 'bad'); }
      S.f.namen = true; save();
      fb('#nm-fb', 'Anne-Lieve is de jongste: het ronde pakje. Silvie is de oudste van de kinderen: het kleine doosje. Het lange is niet voor een vrouw of een meisje, dus voor Papa. Oma mag niets zachts: het platte pakje. Dan blijft het zachte over voor Mama!', 'good');
      solved(() => say([['sys', "Iedereen pakt uit. Een bal voor Anne-Lieve, een zilveren kettinkje met een S voor Silvie, een hengel voor Papa, een zachte sjaal voor Mama, en een boek voor Oma."],
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
      solved(() => say([['oma', "Prachtig voorgelezen! Daar krijg ik zin van om zelf een gedicht te maken."], ['sys', "KLEP! In de gang valt iets door de brievenbus."], ['oma', "Post! Op pakjesavond? Ga eens kijken, lieverd."]]), 2400);
    };
  });
}

/* ---------- puzzel 4: de surprise (welke bouwplaat wordt een kubus?) ---------- *//* Elke bouwplaat: zes vakjes [kolom, rij]. Twee worden een kubus, twee niet. */
const NETS4 = [
  ['A', [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], false],
  ['B', [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], true],
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
        return fb('#nt-fb', bad[0] === 'A' ? 'Bouwplaat A is een rechthoek van 2 bij 3. Vouw je die, dan heb je een soort buisje zonder deksel en zonder bodem: geen kubus!'
          : bad[0] === 'D' ? 'Bij bouwplaat D zitten twee flapjes naast elkaar boven de rij. Vouw je ze omhoog, dan komen ze allebei op dezelfde plek: de bovenkant. En de onderkant blijft open!'
          : tx('Bouwplaat {k} wordt wél een kubus! Probeer hem in gedachten te vouwen: de rij van vier wordt de zijkanten, en de losse vlakjes worden boven en onder.', { k: bad[0] }), 'bad'); }
      S.f.net = true; save(); applyVisuals();
      fb('#nt-fb', 'B en C worden een kubus: een rij van vier rondom, met één vlakje voor boven en één voor onder. Je knipt bouwplaat B uit, vouwt hem, en tekent de stippen erop. Een dobbelsteen!', 'good');
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
/* ---------- extra puzzel: eerlijk delen (delen met rest) ---------- */
function openDelen(){
  const v = S.dl || (S.dl = {});
  openModal('Pepernoten op de vloer', 'Je raapt ze allemaal op, ook die onder de bank', `
    <div class="delen4">
      <div class="dl-pile" aria-hidden="true">${'<i></i>'.repeat(27)}</div>
      <div class="dl-side">
        <p>Je hebt <b>27 pepernoten</b> opgeraapt. Iedereen wil er evenveel: Papa, Mama, Oma, Silvie, Anne-Lieve en jij. Dat zijn <b>6</b> mensen. Pepernoten breken doe je niet, dan worden het kruimels.</p>
        <label class="dl-row"><span>Iedereen krijgt</span><input type="number" inputmode="numeric" min="0" id="dl-each" value="${v.each ?? ''}"><small>pepernoten</small></label>
        <label class="dl-row"><span>Er blijven over</span><input type="number" inputmode="numeric" min="0" id="dl-rest" value="${v.rest ?? ''}"><small>pepernoten</small></label>
        <button type="button" class="btn" id="dl-go">Uitdelen!</button>
        <div class="feedback" id="dl-fb"></div>
      </div>
    </div>`, body => {
    body.querySelectorAll('input').forEach(i => i.oninput = () => { v[i.id.slice(3)] = i.value; save(); });
    $('#dl-go').onclick = () => {
      const e = +($('#dl-each').value || 0), r = +($('#dl-rest').value || 0);
      if(!$('#dl-each').value || $('#dl-rest').value === '') return fb('#dl-fb', 'Vul allebei in: hoeveel krijgt iedereen, en hoeveel blijven er over?', 'bad');
      if(e * 6 > 27){ nope(); return fb('#dl-fb', tx('{e} voor iedereen is {t} pepernoten, maar je hebt er maar 27! Anne-Lieve krijgt er dan geen, en dat wordt huilen.', { e, t: e * 6 }), 'bad'); }
      if(e * 6 + r !== 27){ nope(); return fb('#dl-fb', tx('Tel na: 6 × {e} = {t}, plus {r} over is {s}. Dat moet samen 27 zijn.', { e, t: e * 6, r, s: e * 6 + r }), 'bad'); }
      if(r >= 6){ nope(); return fb('#dl-fb', tx('Er blijven {r} over. Dat is genoeg om iedereen er nog één te geven!', { r }), 'bad'); }
      S.f.delen = true; save(); applyVisuals();
      fb('#dl-fb', '27 gedeeld door 6 is 4, en er blijven er 3 over: 6 × 4 = 24, en 24 + 3 = 27. De 3 die over zijn heet de rest.', 'good');
      solved(() => say(["Iedereen krijgt vier pepernoten. Anne-Lieve eet ze alle vier tegelijk op. Silvie bewaart de hare voor later.", ['papa', "En die drie die over zijn? Die zijn natuurlijk voor…"], ['mama', "Voor Sint en Piet! In het schaaltje bij de deur. Volgend jaar komen ze vast weer."]]), 2600);
    };
  });
}

/* ---------- extra puzzel: lootjes trekken (niemand mag zichzelf trekken) ---------- */
const LOT4 = ['Papa', 'Mama', 'Oma', 'Silvie', 'Anne-Lieve', 'Jij'];
const LOT4_OK = { Papa: 'Jij', Mama: 'Silvie', Oma: 'Papa', Silvie: 'Anne-Lieve', 'Anne-Lieve': 'Oma', Jij: 'Mama' };
function openLootjes(){
  const a = S.lt || (S.lt = {});
  openModal('Een envelop van Sint', 'Hij viel door de brievenbus: LOOTJES', `
    <div class="lootjes4">
      <p class="lt-note">Lieve familie, volgend jaar maken jullie surprises voor elkaar! Ik heb alvast lootjes getrokken, maar Klimpiet heeft ze door elkaar gegooid. Wie heeft wie?</p>
      <ol class="lt-clues">
        <li><b>Niemand</b> heeft zichzelf.</li>
        <li>Anne-Lieve heeft <b>Oma</b>. Dan kan Oma haar helpen knutselen.</li>
        <li>Oma heeft iemand die graag vist.</li>
        <li>Silvie heeft <b>Anne-Lieve</b>.</li>
        <li>Papa heeft <b>niet</b> Mama.</li>
        <li>Mama heeft <b>niet</b> jou.</li>
      </ol>
      <div class="lt-grid">${LOT4.map(p => `<label class="lt-row"><b>${p}</b><span>heeft</span><select data-p="${p}" aria-label="${tx('{p} heeft', { p })}"><option value="">…</option>${LOT4.map(q => `<option${a[p] === q ? ' selected' : ''}>${q}</option>`).join('')}</select></label>`).join('')}</div>
      <button type="button" class="btn" id="lt-go">Klopt het?</button>
      <div class="feedback" id="lt-fb"></div>
    </div>`, body => {
    body.querySelectorAll('select').forEach(s => s.onchange = () => { a[s.dataset.p] = s.value; save(); });
    $('#lt-go').onclick = () => {
      if(LOT4.some(p => !a[p])) return fb('#lt-fb', 'Kies bij iedereen wie hij of zij heeft.', 'bad');
      const self = LOT4.find(p => a[p] === p);
      if(self){ nope(); return fb('#lt-fb', self === 'Jij' ? 'Je hebt jezelf! Dan maak je een surprise voor jezelf. Dat is wel makkelijk, maar niet de bedoeling.' : tx('{p} heeft {p}! Iemand mag nooit zichzelf hebben.', { p: self }), 'bad'); }
      if(new Set(LOT4.map(p => a[p])).size < LOT4.length){ nope(); return fb('#lt-fb', 'Er is iemand die twee keer getrokken is, en iemand anders helemaal niet. Elk lootje is er maar één keer.', 'bad'); }
      if(a['Anne-Lieve'] !== 'Oma'){ nope(); return fb('#lt-fb', 'Kijk naar aanwijzing 2: wie heeft Anne-Lieve?', 'bad'); }
      if(a.Oma !== 'Papa'){ nope(); return fb('#lt-fb', 'Aanwijzing 3: wie in de familie vist er graag? Denk aan zijn pakje!', 'bad'); }
      if(a.Silvie !== 'Anne-Lieve'){ nope(); return fb('#lt-fb', 'Aanwijzing 4: wie heeft Silvie?', 'bad'); }
      if(a.Papa === 'Mama'){ nope(); return fb('#lt-fb', 'Aanwijzing 5: Papa heeft niet Mama.', 'bad'); }
      if(a.Mama === 'Jij'){ nope(); return fb('#lt-fb', 'Aanwijzing 6: Mama heeft niet jou.', 'bad'); }
      if(LOT4.some(p => a[p] !== LOT4_OK[p])){ nope(); return fb('#lt-fb', 'Bijna! Wie zijn er nog over, nu Anne-Lieve, Oma en Silvie klaar zijn? Mama mag niet jou en niet zichzelf hebben…', 'bad'); }
      S.f.lootjes = true; save(); applyVisuals();
      fb('#lt-fb', 'Anne-Lieve heeft Oma, Oma heeft Papa (die vist graag), en Silvie heeft Anne-Lieve. Over zijn nog Mama, Silvie en jij. Mama mag zichzelf niet en jou niet: Mama heeft Silvie. Papa mag Mama niet, dus Papa heeft jou, en jij hebt Mama!', 'good');
      solved(() => { go('feest'); setTimeout(() => say([['mama', "Ik heb Silvie! Dan weet ik al wat ik maak. Nee, ik zeg niks."], ['silvie', "En ik heb Anne-Lieve. Dat wordt iets met glitters."], ['sem', "Ik heb Oma! Oma, wat maak ik voor jou?"], ['oma', "Er zit nog iets in de zak, geloof ik. Iets plats, van karton."]]), 450); }, 3000);
    };
  });
}

/* ---------- begin en einde ---------- */
function intro5(){
  say([['sys', "5 december. Pakjesavond! De kachel brandt, de kaarsen branden, en iedereen zit in de kamer."],
       ['papa', "Zullen we nog een liedje zingen? Misschien hoort Sinterklaas ons."],
       ['sys', "♪ Zie, de maan schijnt door de bomen, makkers, staakt uw wild geraas! 't Heerlijk avondje is gekomen, 't avondje van Sinterklaas! ♪", 'maan'],
       ['sys', "Jullie zingen zo hard dat de pepernoten op tafel trillen."],
       ['oma', "Nu die van vroeger! ♪ Hoor de wind waait door de bomen, hier in huis zelfs waait de wind. Zou de goede Sint wel komen… ♪", 'wind'],
       ['sys', "BONK BONK BONK! Midden in het liedje wordt er op de voordeur gebonsd!"],
       ['sem', "♪ Hoor wie klopt daar kind'ren, hoor wie klopt daar kind'ren… ♪", 'kloppen'],
       ['mama', "Hulppiet, ga jij eens kijken?"]], () => { S.f.introDone5 = true; save(); });
}
function startCh5(){
  S = Object.assign(fresh(), { ch: 5, scene: 'feest', ach: S.ach || {}, started: true }); sel = null; setUnlocked(5);
  $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro5();
}
function win5(){
  S.f.out5 = true; save(); applyVisuals(); chord([523,659,784,1046,1318,1568], 120);
  say([['sys', "Je maakt het grote pakje open. Er zit een echte Pietenmuts in, groen met een gouden veer. En een oorkonde."],
       ['sint', "(op de oorkonde) Hierbij benoem ik jou tot Officiële Hulppiet van Sinterklaas. Voor altijd. Want jij helpt, ook als het moeilijk wordt."],
       ['sys', "Je zet de muts op. Hij past precies. Anne-Lieve wil hem ook, maar hij zakt over haar ogen."],
       ['sys', "Door het raam zie je iets bewegen. Op het dak aan de overkant staan Sinterklaas en Klimpiet. Ze zwaaien naar je!"],
       ['piet', "Tot volgend jaar, Hulppiet!"],
       ['sint', "Dag lieve Hulppiet. Dank je wel voor alles. Tot volgend jaar!"]], showWin);
}
