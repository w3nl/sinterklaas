// Hoofdstuk 4: het Grote Boek is zoek! 5 december, 's ochtends, in het Pakjeshuis. Het Pepernotennieuws meldt dat
// pakjesavond misschien niet doorgaat. Twee kamers: de werkkamer van Sint (`werk`) en het pakjesmagazijn (`magazijn`).
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

KOEK_SAY[4] = ["Op het bureau van Sint, naast de inktpot, staat een speculaaspop. Hij kijkt een beetje ongerust.", ['sint', "Neem hem maar mee, beste Hulppiet. Vandaag kunnen we alle wijsheid gebruiken."], "Je stopt hem in je zak."];
const TODO4 = [['logboek', 'uitzoeken wie er vannacht in de werkkamer was'], ['maat4', 'het juiste pakje vinden'], ['robot', 'het pakje met de grijparm naar Sint sturen'], ['uitgepakt', 'het pakje openmaken'], ['route', 'uitrekenen hoe laat Sint moet vertrekken']];

function applyWerk(){
  const f = S.f, show = vis;
  show('#wr-doorlock', !f.logboek);
  show('#wr-dust', !f.uitgepakt); show('#wr-book', !!f.uitgepakt);
  show('#wr-parcel', !!f.robot && !f.uitgepakt); show('#wr-hit-parcel', !!f.robot && !f.uitgepakt);
  show('#wr-paper', !!f.uitgepakt);
  show('#wr-koek', !f.koekTaken); show('#hit-koekw', !f.koekTaken);
  show('#wr-hooray', !!f.out4);
  $('#sc-werk').classList.toggle('wr-found', !!f.uitgepakt);
  $('#wr-tickertxt').textContent = f.out4 ? 'GOED NIEUWS: HET GROTE BOEK IS TERUG · PAKJESAVOND GAAT DOOR! · INPAKPIET: "IK PAK NOOIT MEER EEN BOEK IN" ·'
    : f.uitgepakt ? 'LAATSTE NIEUWS: HET GROTE BOEK IS GEVONDEN! · MAAR HAALT SINT HET NOG OP TIJD? ·'
    : 'SPOED: HET GROTE BOEK VAN SINTERKLAAS IS ZOEK · GAAT PAKJESAVOND WEL DOOR? · HOOFDPIET: "IK BEN HET OVERAL KWIJT" ·';
}
function applyMagazijn(){
  const f = S.f;
  $('#sc-magazijn').classList.toggle('mg-found', !!f.maat4 && !f.robot);
  vis('#mg-pkB', !f.robot);
}

/* ---------- het Pepernotennieuws ---------- */
const NIEUWS4 = {
  spoed: { head: 'SPOEDNIEUWS', title: 'Het Grote Boek is zoek!', lines: [
    "Goedemorgen, hier is het Pepernotennieuws, met Vera. Het is 5 december, en we hebben slecht nieuws.",
    "Het Grote Boek van Sinterklaas is verdwenen! Het lag gisteravond nog op de lessenaar in de werkkamer, en vanochtend was het weg.",
    "In het Grote Boek staat wie er lief is geweest, en welk cadeautje iedereen krijgt. Zonder het boek weet Sint niet welk pakje voor wie is.",
    "Gaat pakjesavond vanavond wel door? We houden u op de hoogte."] },
  goed: { head: 'GOED NIEUWS', title: 'Pakjesavond gaat door!', lines: [
    "Hier is het Pepernotennieuws met goed nieuws: het Grote Boek is terug!",
    "Het was niet gestolen. Inpakpiet had het vannacht per ongeluk ingepakt, als cadeautje. Een Hulppiet heeft het met de grijparm teruggevonden.",
    "Sinterklaas vertrekt vanmiddag om vier uur, en is om zes uur in Grave. Pakjesavond gaat door!",
    "Dat was het nieuws. Zet uw schoen maar niet meer: vanavond komt de zak!"] }
};
function openNieuws(kind, then){
  const n = NIEUWS4[kind];
  openModal('Het Pepernotennieuws', n.head, `
    <div class="tv4${kind === 'goed' ? ' good' : ''}">
      <div class="tv4-bar"><b>PEPERNOTEN<span>NIEUWS</span></b><i>LIVE</i></div>
      <div class="tv4-body"><img src="portraits/vera.svg" alt="Vera, de verslaggever"><div><h4>${n.title}</h4>${n.lines.map(l => `<p>${l}</p>`).join('')}</div></div>
      <div class="tv4-ticker"><span>${kind === 'goed' ? 'PAKJESAVOND GAAT DOOR! · HET GROTE BOEK IS TERUG · ' : 'GAAT PAKJESAVOND WEL DOOR? · HET GROTE BOEK IS ZOEK · '}</span></div>
    </div>`, null, then);
}

/* ---------- de klikvlakken ---------- */
Object.assign(H, {
  /* de werkkamer */
  naarmag(){
    if(!S.f.logboek) return say([['hoofd', "Het magazijn zit op slot! Sinds het boek weg is, mag daar niemand meer in."], ['hoofd', "Eerst wil ik weten wie er vannacht in de werkkamer was. Het staat allemaal in het logboek, naast de deur."]]);
    go('magazijn');
  },
  wklok(){ say("De klok boven de deur: negen uur 's ochtends. Nog negen uur tot Sint in Grave moet zijn."); },
  logboek(){ if(S.f.logboek) return say("Het logboek. Inpakpiet was er van vijf over tien tot twintig over tien. Precies toen het boek verdween."); openLogboek(); },
  wraam(){ if(gag('#wr-horse', 'neigh', 1600)){ gagText($('#wr-horse'), 'Hihihi!'); beep(620, .3, 'sawtooth', .03); setTimeout(() => beep(520, .35, 'sawtooth', .03), 200); }
    say(["Buiten sneeuwt het. Ozosnel drukt zijn neus tegen het raam en blaast een rondje op het glas.", "Hij vindt het ook spannend, zie je wel."]); },
  boekenkast(){ say(["Sints boekenkast. Oude boeken met gouden letters: Pepernoten bakken in 100 stappen, Daken van Nederland, Paarden en hun hoeven.", "Maar het Grote Boek is er niet bij. Dat is veel groter, en rood."]); },
  lessenaar(){
    if(S.f.uitgepakt) return say([['sint', "Daar ligt hij weer, op zijn eigen plekje. Ik laat hem nooit meer los, beste Hulppiet. Nou ja, behalve om in te schrijven."]]);
    say(["De lessenaar waar het Grote Boek altijd ligt. Hij is leeg.", "In het stof zie je nog een rechthoek waar het boek lag. Een groot boek: veertig centimeter lang en dertig breed."]);
  },
  sint4(){
    if(S.f.out4) return say([['sint', "Wel, wel, wel. Wat een ochtend! Ga maar gauw naar huis, beste Hulppiet. Vanavond kom ik langs."]]);
    if(S.f.uitgepakt) return say([['sint', "Het boek is terug! Maar nu moet ik op tijd in Grave zijn. Hoofdpiet heeft de kaart."]]);
    if(!S.f.logboek) return say([['sint', "Ach, beste Hulppiet. Gisteravond om tien uur heb ik het boek nog op de lessenaar gelegd. Toen ben ik gaan slapen."], ['sint', "En om half elf kwam Hoofdpiet me wakker maken: het boek was weg! Wie zou er in dat halfuurtje in mijn kamer zijn geweest?"]]);
    say([['sint', "Inpakpiet? Die zou nooit iets stelen. Maar hij pakt wel alles in wat hij tegenkomt. Kijk eens in het magazijn."]]);
  },
  tv(){
    S.f.zap = (S.f.zap || 0) + 1; save();
    if(S.f.zap === 3){ S.ach.tv = true; save(); gag('#wr-tv', 'zap', 900); beep(1800, .05, 'square', .02);
      return say(["Je zapt naar een andere zender. Een kookprogramma: \"Vandaag maken we pepernoten.\" Nog een zender: een tekenfilm over een paard op een dak.", "Je zapt weer terug naar het nieuws. Hoofdpiet kijkt je streng aan."]); }
    openNieuws(S.f.out4 ? 'goed' : 'spoed');
  },
  glijbaan(){ say(S.f.robot ? "De glijbaan uit het magazijn. Daar is het pakje uit gekomen, met een flinke bonk." : ["Een glijbaan van glimmend metaal, die uit de muur komt en op het bureau eindigt.", "Hier glijden de pakjes uit het magazijn naar Sint, zodat hij kan zien of ze mooi zijn ingepakt."]); },
  bureau4(){ say(["Het bureau van Sint. Een inktpot met een ganzenveer, stapels brieven van kinderen, en een rode telefoon.", "Op een briefje staat in Sints krullende handschrift: \"Niet vergeten: om 18:00 in Grave!\""]); },
  telefoon(){ if(gag('#wr-phone', 'ring', 1500)){ beep(880, .1, 'square', .03); setTimeout(() => beep(880, .1, 'square', .03), 180); setTimeout(() => beep(880, .1, 'square', .03), 360); }
    say([['hoofd', "(neemt op) Pakjeshuis, met Hoofdpiet. … Nee, mevrouw, we weten nog niet of pakjesavond doorgaat. … Ja, mevrouw, uw zoon is heel lief geweest. Denk ik. Het staat in het boek."], ['hoofd', "Dat is al de dertigste vandaag!"]]); },
  kaart(){
    if(!S.f.uitgepakt) return say(["Een kaart met een rode stippellijn: van het Pakjeshuis naar Grave, 24 kilometer.", ['hoofd', "Dat is de route van vanavond. Áls pakjesavond doorgaat…"]]);
    if(S.f.route) return say("De route naar Grave: 24 kilometer, twee uur draven. Om vier uur vertrekken, om zes uur in Grave.");
    openRoute();
  },
  hoofd4(){
    if(S.f.out4) return say([['hoofd', "Alles van mijn lijstje is afgevinkt. Vandaag hoef ik niet meer te rennen. Denk ik."]]);
    const left = TODO4.filter(([k]) => !S.f[k]).map(([, t]) => t);
    if(!S.f.logboek) return say([['hoofd', "Dit is een ramp, Hulppiet! Een RAMP! Zonder boek geen pakjesavond!"], ['hoofd', "In het logboek naast de deur schrijft elke Piet op wanneer hij binnenkomt en weggaat. Daar moeten we beginnen."]]);
    say([['hoofd', tx('Volgens mijn lijstje moet er nog: {list}.', { list: left.join(', ') })]]);
  },
  pakje4(){ if(S.f.uitgepakt || !S.f.robot) return; unwrap4(); },
  uitgang4(){
    if(S.f.out4) return startCh5();
    say(["De voordeur van het Pakjeshuis. Buiten ligt sneeuw, en Ozosnel staat te trappelen.", ['hoofd', "Niemand gaat naar buiten tot het boek terug is! Zeker jij niet, Hulppiet: we hebben je nodig."]]);
  },
  /* het magazijn */
  naarwerk(){ go('werk'); },
  stelling(){ say(S.f.robot ? "Bovenin de stelling is een gat waar pakje B lag. De grijparm heeft het weggehaald." : S.f.maat4 ? "Pakje B ligt helemaal bovenin, tussen de andere pakjes van vannacht. Er staat een zware kist voor. Daar kun je niet bij klimmen. Gebruik de grijparm!" : ["Bovenin de stelling liggen de pakjes die Inpakpiet vannacht heeft ingepakt. Ze hebben een kaartje met een letter: A, B, C, D en E.", "Welke zou het boek kunnen zijn? Ze zijn allemaal anders van grootte."]); },
  stelling2(){ say("Duizenden pakjes, in alle kleuren, tot aan het plafond. Elk pakje heeft een naamkaartje. Behalve die van vannacht: die moeten nog een naam krijgen. Uit het Grote Boek."); },
  klimpiet4(){ const k = $('#mg-klim'); if(gag(k, 'toss', 1200)){ gagText(k, 'Hap!'); beep(700, .08); }
    say(S.f.robot ? [['piet', "Ik zag het pakje voorbij zoeven! Ik heb er nog naar gegooid, met een pepernoot. Mis."]] : [['piet', "Hé Hulppiet! Ik zit hier al de hele ochtend. Hier boven ziet niemand dat ik pepernoten eet."], ['piet', "Ik kan overal bij, maar die pakjes van vannacht liggen achter de zware kist. Daar klim zelfs ik niet langs. Daar is de grijparm voor."]]); },
  inpakpiet(){
    if(S.f.uitgepakt) return say([['inpak', "Het spijt me zo, Sint! Ik dacht dat het een cadeautje was. Het lag op tafel, het was groot en rood… en ik pak álles in."], ['inpak', "Vanaf nu pak ik nooit meer iets in zonder het eerst te vragen. Behalve pepernoten. Die mag ik altijd inpakken."]]);
    if(S.f.maat4) return say([['inpak', "Pakje B, helemaal bovenin. Ik kan er niet meer bij, er staat een zware kist voor. Met de grijparm lukt het. Het paneel staat naast de lopende band."]]);
    say([['inpak', "Goeiemorgen! Ik ben Inpakpiet. Ik pak alles in: pakjes, pepernoten, en één keer per ongeluk Klimpiet."], ['inpak', "Vannacht? Ja, toen was ik even in de werkkamer, om tien uur. Daar lag nog van alles op tafel. Dat heb ik allemaal ingepakt en bovenin de stelling gelegd: pakje A tot en met E."], ['inpak', "Maar welke welke was… Ik heb de maten op mijn werkbon gezet. Kijk maar, op de tafel."]]);
  },
  werkbon(){ if(S.f.maat4) return say("De werkbon van Inpakpiet. Bij pakje B staat nu een dikke rode cirkel."); openMaten(); },
  noppen(){
    const left = [...document.querySelectorAll('#sc-magazijn .mg-bub:not(.popped)')];
    if(!left.length) return say("Alle noppen zijn geknapt. Inpakpiet kijkt er een beetje treurig naar.");
    const b = left[0]; b.classList.add('popped'); gagText(b, 'Plop!'); beep(1200 + Math.random() * 300, .03, 'square', .03);
    S.f.noppen = (S.f.noppen || 0) + 1; save();
    if(left.length === 1){ S.ach.noppen = true; save(); return say([['inpak', "Hé! Dat was mijn laatste noppenfolie! Nou ja… het is ook wel het leukste van mijn werk."]]); }
    if(S.f.noppen === 1) say("Noppenfolie! Je knijpt in een nopje. PLOP. Dat is heel lekker.");
  },
  papier(){ if(gag('#sc-magazijn .mg-roll2', 'unroll', 1600)) beep(400, .2, 'triangle', .03);
    say("Rollen cadeaupapier: rood met gouden sterren, blauw met mijters, groen met pepernoten. Inpakpiet heeft er duizend meter van, zegt hij."); },
  zakken4(){ say("Een jutezak, nog leeg. Vanavond zit hij vol pakjes, en dan staat hij bij jou op de stoep."); },
  paneel(){
    if(S.f.robot) return say("Het paneel van de grijparm. Op het schermpje staat: KLAAR. PAKJE B AFGELEVERD.");
    if(!S.f.maat4) return say(["Het bedieningspaneel van de grijparm. Met pijltjes vertel je de arm stap voor stap waar hij heen moet.", "Maar welk pakje moet hij pakken? Dat weet je nog niet."]);
    openRobot();
  },
  band(){ say("De lopende band rolt en rolt. Alles wat erop ligt, gaat door het gat in de muur naar de werkkamer van Sint."); },
  grijparm(){ say("Een gele grijparm die langs een rail onder het plafond rijdt. Hij kan overal bij, maar alleen als je hem precies vertelt hoe."); },
  mgraam(){ say("Een hoog raampje. Buiten sneeuwt het. Vanavond is het pakjesavond. Als het boek op tijd terug is."); }
});

/* ---------- puzzel 1: het logboek (klokkijken, en welke tijd valt tussen twee andere) ---------- */
const LOG4 = [
  ['Pepernotenpiet', [21, 10], [21, 40], 'Pepernotenpiet ging om tien over half tien al weg. Om tien uur legde Sint het boek nog op de lessenaar.'],
  ['Klimpiet', [21, 50], [21, 55], 'Klimpiet was er maar vijf minuten, van tien voor tien tot vijf voor tien. Daarna legde Sint het boek pas neer.'],
  ['Inpakpiet', [22, 5], [22, 20], ''],
  ['Hoofdpiet', [22, 35], [22, 50], 'Hoofdpiet kwam om vijf over half elf binnen. Toen was het boek al weg: hij heeft het ontdekt!'],
  ['Strooipiet', [23, 0], [23, 30], 'Strooipiet kwam pas om elf uur. Toen was het boek al lang weg.']
];
function clock4(h, m){
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  const hand = (a, len, w, c) => `<path d="M30 30 L${(30 + len * Math.sin(a * Math.PI / 180)).toFixed(1)} ${(30 - len * Math.cos(a * Math.PI / 180)).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 60 60" class="lb-clock" role="img" aria-label="${tx('{h} uur {m}', { h: h % 12 || 12, m: String(m).padStart(2, '0') })}"><circle cx="30" cy="30" r="26" fill="#fffaf0" stroke="#8a5a2a" stroke-width="3"/>`
    + Array.from({ length: 12 }, (_, i) => `<circle cx="${(30 + 21 * Math.sin(i * Math.PI / 6)).toFixed(1)}" cy="${(30 - 21 * Math.cos(i * Math.PI / 6)).toFixed(1)}" r="${i % 3 ? 1.2 : 2}" fill="#3a2a1a"/>`).join('')
    + hand(ha, 13, 3.4, '#3a2a1a') + hand(ma, 20, 2.2, '#3a2a1a') + '<circle cx="30" cy="30" r="2.4" fill="#c21f2b"/></svg>';
}
function openLogboek(){
  openModal('Het logboek', 'Wie was er gisteravond in de werkkamer?', `
    <div class="lb">
      <div class="lb-notes"><p><b>Sint:</b> "Om <b>10 uur</b> 's avonds lag het boek nog op de lessenaar."</p><p><b>Hoofdpiet:</b> "Om <b>half 11</b> was het weg!"</p></div>
      <div class="lb-wrap"><table class="lb-table"><thead><tr><th>Piet</th><th>Binnen</th><th>Weg</th><th></th></tr></thead><tbody>
        ${LOG4.map(([who, a, b], i) => `<tr><td>${who}</td><td>${clock4(...a)}</td><td>${clock4(...b)}</td><td><button type="button" class="btn ghost lb-pick" data-i="${i}">Deze Piet!</button></td></tr>`).join('')}
      </tbody></table></div>
      <p class="lb-tip">Alle tijden zijn 's avonds. De kleine wijzer wijst het uur aan, de grote wijzer de minuten.</p>
      <div class="feedback" id="lb-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.lb-pick').forEach(b => b.onclick = () => {
      const [who, , , why] = LOG4[+b.dataset.i];
      if(why){ nope(); return fb('#lb-fb', why, 'bad'); }
      S.f.logboek = true; save(); applyVisuals();
      fb('#lb-fb', tx('{who} kwam om vijf over tien binnen en ging om twintig over tien weg. Dat is precies tussen tien uur en half elf!', { who }), 'good');
      solved(() => say([['hoofd', "Inpakpiet! Natuurlijk! Die pakt alles in wat hij tegenkomt. Ik doe het magazijn open."], ['sys', "Hoofdpiet haalt een enorme sleutelbos tevoorschijn. Klik. De deur naar het magazijn is open."]]), 2600);
    });
  });
}

/* ---------- puzzel 2: de werkbon (maten omrekenen: mm, cm, dm en m) ---------- */
const MATEN4 = [
  ['A', '40 mm × 30 mm × 8 mm', '40 mm is maar 4 centimeter! Dat pakje is zo groot als een luciferdoosje.'],
  ['B', '0,4 m × 3 dm × 80 mm', ''],
  ['C', '4 dm × 30 cm × 8 dm', '8 dm is 80 centimeter dik! Dat pakje is dikker dan het boek lang is.'],
  ['D', '400 cm × 300 cm × 8 cm', '400 cm is 4 meter! Dat pakje is groter dan Ozosnel.'],
  ['E', '40 cm × 3 cm × 8 cm', '3 cm breed? Dan is het een liniaal, geen boek.']
];
function openMaten(){
  openModal('De werkbon van Inpakpiet', 'Wat zit er in welk pakje?', `
    <div class="mt">
      <div class="mt-sint">Sint: <i>"Mijn Grote Boek is <b>40 cm</b> lang, <b>30 cm</b> breed en <b>8 cm</b> dik."</i></div>
      <div class="mt-bon"><h4>Werkbon · vannacht ingepakt</h4>
        ${MATEN4.map(([k, m]) => `<button type="button" class="mt-row" data-k="${k}"><b>${k}</b><span>${m}</span></button>`).join('')}
        <small>Inpakpiet: "Ik had een rolmaat in millimeters, een liniaal in centimeters en een meetlint in meters. Ik heb gewoon gepakt wat ik zag."</small></div>
      <div class="mt-card"><b>Omrekenen</b><span>1 m = 10 dm = 100 cm = 1000 mm</span><span>1 dm = 10 cm · 1 cm = 10 mm</span></div>
      <div class="feedback" id="mt-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.mt-row').forEach(b => b.onclick = () => {
      const [, , why] = MATEN4.find(m => m[0] === b.dataset.k);
      if(why){ nope(); return fb('#mt-fb', why, 'bad'); }
      S.f.maat4 = true; save(); applyVisuals();
      fb('#mt-fb', 'Pakje B! 0,4 m is 40 cm, 3 dm is 30 cm en 80 mm is 8 cm. Precies het Grote Boek!', 'good');
      solved(() => say([['inpak', "Pakje B! Dat heb ik helemaal bovenin gelegd. O jee, en daarna hebben ze er de zware kist voor gezet."], ['inpak', "Met de grijparm kun je erbij. Het paneel staat naast de lopende band. Vertel hem precies waar hij heen moet!"]]), 2400);
    });
  });
}

/* ---------- puzzel 3: de grijparm (een programma: stap voor stap, in de goede volgorde) ---------- */
/* Het rooster: 6 vakjes breed, 4 hoog, gezien van voren. De arm begint boven de lopende band (6,4). Pakje B ligt op
   (2,1). De zware kist staat op (4,1) en (4,2), en er staat een stapel dozen op (3,4). */
const RB_W = 6, RB_H = 4, RB_START = [6, 4], RB_DROP = [6, 4];
const RB_PKG = { '1,1': 'A', '2,1': 'B', '3,1': 'C', '5,1': 'D', '6,1': 'E' };
const RB_BLOCK = { '4,1': 'de zware kist', '4,2': 'de zware kist', '3,4': 'de stapel dozen' };
const RB_CMD = { up: ['▲', 'omhoog', 0, -1], down: ['▼', 'omlaag', 0, 1], left: ['◀', 'naar links', -1, 0], right: ['▶', 'naar rechts', 1, 0], pak: ['✊', 'pak', 0, 0], los: ['✋', 'laat los', 0, 0] };
/* Voert een programma uit en geeft { ok, msg, at } terug; at is de stap waar het misging. */
function runRobot(prog){
  let [x, y] = RB_START, held = null;
  const path = [[x, y, null]];
  for(let i = 0; i < prog.length; i++){
    const k = prog[i], [, , dx, dy] = RB_CMD[k];
    if(k === 'pak'){
      const pk = RB_PKG[x + ',' + y];
      if(held) return { msg: 'De grijper zit al vol!', at: i, path };
      if(!pk) return { msg: 'De grijper grijpt in het niets. Hier ligt geen pakje.', at: i, path };
      if(pk !== 'B') return { msg: tx('Dat is pakje {pk}! We zoeken pakje B.', { pk }), at: i, path };
      held = 'B';
    } else if(k === 'los'){
      if(!held) return { msg: 'Er zit niks in de grijper om los te laten.', at: i, path };
      if(x !== RB_DROP[0] || y !== RB_DROP[1]) return { msg: 'PLOF! Het pakje valt op de grond in plaats van op de lopende band. Laat het los boven de band.', at: i, path };
      return { ok: true, path };
    } else {
      const nx = x + dx, ny = y + dy;
      if(nx < 1 || nx > RB_W || ny < 1 || ny > RB_H) return { msg: 'BONK! Daar houdt de rail op.', at: i, path };
      const bl = RB_BLOCK[nx + ',' + ny]; if(bl) return { msg: tx('BONK! De arm botst tegen {bl}.', { bl }), at: i, path };
      x = nx; y = ny;
    }
    path.push([x, y, held]);
  }
  return { msg: held ? 'Het programma is op, maar het pakje hangt nog in de grijper. Laat het los boven de band!' : 'Het programma is op, maar de arm heeft niks opgehaald.', at: prog.length, path };
}
function openRobot(){
  const prog = S.rb || (S.rb = []);
  let running = false;
  const cellHtml = (x, y) => { const k = x + ',' + y, pk = RB_PKG[k], bl = RB_BLOCK[k], drop = x === RB_DROP[0] && y === RB_DROP[1];
    return `<div class="rb-cell${bl ? ' block' : ''}${drop ? ' drop' : ''}">${pk ? `<span class="rb-pk${pk === 'B' ? ' b' : ''}">${pk}</span>` : ''}${bl ? '<span class="rb-bl" aria-hidden="true"></span>' : ''}${drop ? '<span class="rb-drop">band</span>' : ''}</div>`; };
  openModal('De grijparm', 'Maak een programma: de arm doet precies wat jij zegt, stap voor stap', `
    <div class="rb">
      <div class="rb-grid" id="rb-grid">${Array.from({ length: RB_H }, (_, y) => Array.from({ length: RB_W }, (_, x) => cellHtml(x + 1, y + 1)).join('')).join('')}<div class="rb-arm" id="rb-arm"><span>✊</span></div></div>
      <p class="rb-tip">Haal <b>pakje B</b> op en laat het los boven de <b>lopende band</b>. De arm kan niet door de zware kist of de stapel dozen heen.</p>
      <div class="rb-btns">${Object.entries(RB_CMD).map(([k, [ic, nm]]) => `<button type="button" class="rb-cmd" data-k="${k}" aria-label="${nm}"><b>${ic}</b><small>${nm}</small></button>`).join('')}</div>
      <div class="rb-prog" id="rb-prog" aria-label="Het programma"></div>
      <div class="rb-run"><button type="button" class="btn" id="rb-go">Start</button><button type="button" class="btn ghost" id="rb-undo">Laatste weg</button><button type="button" class="btn ghost" id="rb-clear">Alles wissen</button></div>
      <div class="feedback" id="rb-fb"></div>
    </div>`, body => {
    const arm = $('#rb-arm');
    const place = (x, y, held) => { arm.style.left = ((x - 1) / RB_W * 100) + '%'; arm.style.top = ((y - 1) / RB_H * 100) + '%'; arm.classList.toggle('held', !!held); arm.querySelector('span').textContent = held || '✊'; };
    const showProg = () => { $('#rb-prog').innerHTML = prog.length ? prog.map((k, i) => `<span class="rb-step" data-i="${i}">${RB_CMD[k][0]}</span>`).join('') : '<em>Nog leeg. Klik op de knoppen hierboven.</em>'; };
    place(...RB_START); showProg();
    body.querySelectorAll('.rb-cmd').forEach(b => b.onclick = () => { if(running) return; if(prog.length >= 24) return fb('#rb-fb', 'Zo lang hoeft het programma niet te zijn!', 'bad'); prog.push(b.dataset.k); save(); showProg(); beep(600, .03); });
    $('#rb-undo').onclick = () => { if(running) return; prog.pop(); save(); showProg(); };
    $('#rb-clear').onclick = () => { if(running) return; prog.length = 0; save(); showProg(); place(...RB_START); fb('#rb-fb', ''); };
    $('#rb-go').onclick = () => {
      if(running || !prog.length) return;
      running = true; fb('#rb-fb', '');
      const res = runRobot(prog);
      let i = 0;
      const step = () => {
        if(!$('#rb-arm')){ running = false; return; }   // de close-up is dichtgegaan
        if(i < res.path.length){
          const [x, y, held] = res.path[i]; place(x, y, held); if(i) beep(300 + y * 40, .03);
          body.querySelectorAll('.rb-step').forEach(s => s.classList.toggle('now', +s.dataset.i === i - 1));
          i++; return setTimeout(step, reducedMotion() ? 40 : 360);
        }
        running = false;
        if(!res.ok){ nope(); fb('#rb-fb', res.msg, 'bad'); const st = body.querySelector(`.rb-step[data-i="${res.at}"]`); st && st.classList.add('bad'); return; }
        S.f.robot = true; save(); applyVisuals(); moment('magazijn', 'mg-send', 4200);
        fb('#rb-fb', 'Het pakje valt precies op de lopende band! Een programma is een reeks stappen in de goede volgorde: de arm doet precies wat jij zegt, niet meer en niet minder.', 'good');
        solved(() => say([['sys', "Het pakje rijdt over de lopende band en verdwijnt door het gat in de muur. Uit de werkkamer klinkt een flinke BONK."], ['inpak', "Het is aangekomen! Snel, naar de werkkamer!"]]), 3200);
      };
      setTimeout(step, 150);
    };
  });
}

/* ---------- het pakje openmaken ---------- */
function unwrap4(){
  S.f.uitgepakt = true; save(); applyVisuals(); chord([523, 659, 784, 1046, 1318], 110);
  say([['sys', "Je trekt het lint los en scheurt het papier eraf. Rood. Groot. Met gouden letters op de kaft…"],
       ['sint', "MIJN BOEK! Het Grote Boek! Wel, wel, wel!"],
       ['sys', "Sint legt het boek terug op de lessenaar en aait er even over, alsof het een poes is."],
       ['hoofd', "Hoera! Maar… kijk eens hoe laat het al is! Sint moet vanavond om zes uur in Grave zijn. Hoe laat moeten we vertrekken?"],
       ['hoofd', "De route staat op de kaart aan de muur."]]);
}

/* ---------- puzzel 4: de route (afstand, snelheid en tijd) ---------- */
const ROUTE4 = [
  { ask: 'Hoe lang doet Ozosnel over de route?', opts: ['1 uur', '2 uur', '3 uur', '12 uur'], ok: '2 uur', good: '24 kilometer, 12 kilometer per uur: 24 ÷ 12 = 2 uur.',
    bad: { '1 uur': 'In 1 uur draaft Ozosnel 12 kilometer. Hij moet er 24.', '3 uur': 'In 3 uur zou hij 36 kilometer draven. Dat is te veel.', '12 uur': '12 is zijn snelheid: 12 kilometer per uur. Hoeveel keer past 12 in 24?' } },
  { ask: 'Sint moet om 18:00 in Grave zijn. Hoe laat moet hij vertrekken?', opts: ['15:00', '16:00', '17:00', '18:00'], ok: '16:00', good: 'Twee uur reizen: 18:00 − 2 uur = 16:00. Om vier uur vertrekken!',
    bad: { '15:00': 'Dan is hij al om vijf uur in Grave. Een uur te vroeg: dan staat hij in de kou te wachten.', '17:00': 'Dan is hij pas om zeven uur in Grave. Een uur te laat!', '18:00': 'Om zes uur moet hij er al zijn! Je moet de reistijd eraf halen.' } }
];
function openRoute(){
  const R = S.rt || (S.rt = { r: 0 }), q = ROUTE4[R.r];
  openModal('De route van vanavond', 'Van het Pakjeshuis naar Grave', `
    <div class="rt">
      <svg viewBox="0 0 300 150" class="rt-map" role="img" aria-label="Een kaartje: van het Pakjeshuis naar Grave is 24 kilometer">
        <rect width="300" height="150" rx="8" fill="#f3e6c4"/>
        <path d="M40 40 C100 30 160 110 260 100" stroke="#c21f2b" stroke-width="4" stroke-dasharray="10 6" fill="none"/>
        <circle cx="40" cy="40" r="10" fill="#5b2a86"/><circle cx="260" cy="100" r="10" fill="#c21f2b"/>
        <text x="30" y="70" font-size="13" font-family="Fredoka, sans-serif" fill="#2a1a10">Pakjeshuis</text>
        <text x="230" y="130" font-size="13" font-family="Fredoka, sans-serif" fill="#2a1a10">Grave</text>
        <text x="132" y="62" font-size="16" font-weight="700" font-family="IBM Plex Mono, monospace" fill="#c21f2b">24 km</text>
      </svg>
      <div class="rt-facts"><span>Afstand: <b>24 km</b></span><span>Ozosnel draaft <b>12 km per uur</b></span><span>Aankomst in Grave: <b>18:00</b></span></div>
      <p class="rt-q">${q.ask}</p>
      <div class="rt-opts">${q.opts.map(o => `<button type="button" class="btn ghost rt-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <div class="feedback" id="rt-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.rt-opt').forEach(b => b.onclick = () => {
      const o = b.dataset.o;
      if(o !== q.ok){ nope(); return fb('#rt-fb', q.bad[o], 'bad'); }
      if(R.r === 0){ R.r = 1; save(); fb('#rt-fb', q.good, 'good'); chord([523, 659, 784]); return setTimeout(() => { if(!$('#modal').hidden){ closeModal(); openRoute(); } }, 1600); }
      S.f.route = true; save();
      fb('#rt-fb', q.good, 'good');
      solved(win4, 2400);
    });
  });
}

/* ---------- begin en einde ---------- */
function intro4(){
  openNieuws('spoed', () => say([['sys', "5 december, negen uur 's ochtends. Je bent in het Pakjeshuis, in de werkkamer van Sinterklaas."],
    ['hoofd', "Hulppiet! Gelukkig, je bent er! Heb je het nieuws gezien? Het Grote Boek is weg!"],
    ['sint', "Wel, wel, wel. Zonder mijn boek weet ik niet wie wat krijgt, beste Hulppiet. Wil jij ons helpen zoeken?"],
    ['hoofd', "Begin bij het logboek naast de deur. Daarin schrijft elke Piet op wanneer hij binnenkomt en weggaat."]], () => { S.f.introDone4 = true; save(); }));
}
function startCh4(){
  S = Object.assign(fresh(), { ch: 4, scene: 'werk', ach: S.ach || {}, started: true }); sel = null; setUnlocked(4);
  $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro4();
}
function win4(){
  S.f.out4 = true; save(); applyVisuals(); chord([523, 659, 784, 1046, 1318, 1568], 120);
  openNieuws('goed', () => say([['vera', "En hier is de Hulppiet die het allemaal heeft opgelost! Hoe voel je je?"],
    "Eh… blij! En een beetje moe.",
    ['sint', "Dank je wel, beste Hulppiet. Ga maar gauw naar huis. Vanavond kom ik bij jou langs, met de grote zak."],
    ['sys', "♪ Zie ginds komt de stoomboot uit Spanje weer aan, hij brengt ons Sint Nicolaas, ik zie hem al staan… ♪", 'stoomboot']], showWin));
}
