// Hoofdstuk 1: de stoomboot vaart naar Grave, op 14 november. Hier staat ook H, de tabel met klikvlakken die elk
// hoofdstuk aanvult. Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

Object.assign(ITEMS, {
  mijter: { name:'De mijter', desc:'De hoge rode mijter van Sinterklaas, met een gouden kruis. Hij hoort op het hoofd van Sint, niet op het jouwe.',
    svg:'<svg viewBox="0 0 44 44"><path d="M11 38 L13 12 Q22 2 31 12 L33 38Z" fill="#c21f2b" stroke="#f2b631" stroke-width="2.5"/><path d="M22 14v14M16 20h12" stroke="#f2b631" stroke-width="3"/></svg>' },
  emmer: { name:'Voeremmer', desc:'Een emmer met wortels, hooi en een appel. Gezond paardenvoer.',
    svg:'<svg viewBox="0 0 44 44"><path d="M9 18h26l-3 20H12z" fill="#7b8086" stroke="#3b3f45" stroke-width="2"/><path d="M9 18q13 -16 26 0" stroke="#3b3f45" stroke-width="2" fill="none"/><path d="M14 18l-2 -9M20 18l1 -10" stroke="#e8902e" stroke-width="4" stroke-linecap="round"/><path d="M24 18q4 -10 10 -4" stroke="#e5c86a" stroke-width="4" fill="none"/><circle cx="30" cy="15" r="4" fill="#c4302b"/></svg>' }
});

/* ---------- de kamer tekenen ---------- */
function buildBoot(){
  // vlaggetjes langs de twee lijnen van de mast naar voor- en achtersteven
  const cols = ['#d6242f', '#fff', '#1f4fa8', '#f2b631'];
  let g = '';
  [[400, 528], [1555, 528]].forEach(([ex, ey], side) => {
    for(let i = 1; i < 12; i++){
      const t = i / 12, x = 1001 + (ex - 1001) * t, y = 96 + (ey - 96) * t;
      g += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l12 2 l-8 16z" fill="${cols[(i + side) % 4]}" class="sb-pennant" style="animation-delay:-${(i * .3).toFixed(1)}s"/>`;
    }
  });
  $('#sb-flagline').innerHTML = g;
}
function applyBoot(){
  const f = S.f, show = vis, sailing = f.engine && !f.lock;
  show('#sb-bg-river', !f.engine); show('#sb-bg-lock', f.engine && !f.lock); show('#sb-bg-quay', !!f.lock);
  show('#sb-hit-river', !f.engine); show('#sb-hit-lock', f.engine && !f.lock); show('#sb-hit-quay', !!f.lock);
  show('#sb-smoke', !!f.engine); show('#sb-fire', !!f.engine);
  $('#sc-boot').classList.toggle('sb-sailing', !!sailing);
  show('#sb-mitre', !!f.mijter); show('#sb-hair', !f.mijter); show('#sb-staff', true);
  show('#sb-boxlock', !f.box);
  show('#sb-koek', !f.koekTaken); show('#hit-koek', !f.koekTaken);
  show('#sb-gangway', !!f.plank);
  show('#sb-confetti', !!f.out1);
  $('#sc-boot').classList.toggle('sb-out', !!f.out1);
  show('#hit-gangway', !!f.plank);
  $('#sc-boot').classList.toggle('sb-fed', !!f.voer);
  $('#sb-lockred').setAttribute('fill', f.lock ? '#4a1a16' : '#e2483d');
  $('#sb-lockgreen').setAttribute('fill', f.lock ? '#5fd36a' : '#244a2a');
  const k = S.ktl || { w: 0, t: 20 };
  $('#sb-needle').setAttribute('d', `M826 630 L${(826 - 15 * Math.cos(Math.PI * Math.min(k.t, 100) / 100)).toFixed(1)} ${(630 - 15 * Math.sin(Math.PI * Math.min(k.t, 100) / 100)).toFixed(1)}`);
  $('#sb-gaugewater').setAttribute('y', 692 - k.w * 7); $('#sb-gaugewater').setAttribute('height', Math.max(1, k.w * 7));
}
/* Wat er nog moet gebeuren voordat Sint aan wal kan. */
const TODO1 = [['engine', 'De stoommachine weer aan de praat'], ['lock', 'Door de sluis bij Grave'], ['mijter', 'De mijter op het hoofd van Sint'], ['voer', 'Ozosnel rustig'], ['plank', 'Een veilige loopplank naar de kade']];
const ready1 = () => TODO1.every(([k]) => S.f[k]);

/* Elk hoofdstuk heeft zijn eigen speculaaspop om te vinden (klikvlak "koek"); dit zeg je als je hem pakt. */
const KOEK_SAY = {
  1: ["Een speculaaspop op de tafel van Sint. Hij heeft een glimlach van amandel en kijkt heel wijs.",
      ['hoofd', "Die mag je hebben, Hulppiet. Hij weet altijd raad. Als je vastzit, laat je hem iets zien."],
      "Je stopt de speculaaspop voorzichtig in je zak. Niet opeten, hoe lekker hij ook ruikt."]
};

/* ---------- klikvlakken ---------- */
const H = {
  koek(){ S.f.koekTaken = true; give('koek'); applyVisuals(); say(KOEK_SAY[S.ch] || KOEK_SAY[1]); },
  ketel(){ if(S.f.engine) return say(["De ketel sist tevreden. De vuurkist gloeit en de stoom duwt de zuiger heen en weer.", ['hoofd', "Niet meer aankomen, Hulppiet. Hij doet het precies goed."]]); openKetel(); },
  fluit(){
    if(!S.f.engine) return say(["De stoomfluit op de schoorsteen. Je trekt aan het touwtje… pfff. Er komt niks uit.", "Zonder stoom geen fluit. En geen varen."]);
    S.f.toet = (S.f.toet || 0) + 1; save(); beep(330, .5, 'sawtooth', .05); setTimeout(() => beep(392, .7, 'sawtooth', .05), 250);
    vis('#sb-whistle', true); setTimeout(() => vis('#sb-whistle', false), 1200);
    if(S.f.toet >= 3){ S.ach.toet = true; save(); return say([['sint', "Wel, wel, wel. Iedereen in Grave weet nu dat wij eraan komen, beste Hulppiet."]]); }
    say("TOEEET! Het geluid rolt over de Maas.");
  },
  sint(){
    if(S.f.out1) return say([['sint', "Wat een welkom, beste Hulppiet! Kijk eens hoeveel kinderen er zijn. Ik zwaai nog even, en dan gaan we naar het kasteel."]]);
    if(ready1()) return win1();
    if(!S.f.engine) return say([['sint', "Ach, beste Hulppiet. Daar liggen we, stil op de Maas, en heel Grave staat op ons te wachten."], ['sint', "Wil jij eens in de machinekamer kijken? Ik ben goed in heel veel dingen, maar niet in stoommachines."]]);
    if(!S.f.mijter) return say([['sint', "Weet jij waar mijn mijter is? Ik heb hem gisteravond in de hoedendoos gelegd, op slot, zodat Klimpiet er niet mee gaat voetballen."], ['sint', "Alleen weet ik de code niet meer. Iets met mijn leeftijd. Hoe oud word ik ook alweer?"]]);
    if(!S.f.lock) return say([['sint', "Mijn mijter zit weer waar hij hoort. Nu de sluis nog, dan zijn we er bijna."]]);
    if(!S.f.voer) return say([['sint', "Hoor je Ozosnel stampen? Hij houdt van de kinderen, maar al die muziek maakt hem onrustig. Een lekker hapje helpt altijd."]]);
    say([['sint', "Ik ben er klaar voor. Maar hoe kom ik van dit hoge dek af, op mijn leeftijd? En Ozosnel moet er ook af."]]);
  },
  hoofd(){
    const left = TODO1.filter(([k]) => !S.f[k]).map(([, t]) => t);
    if(!left.length) return say([['hoofd', "Alles staat op mijn lijstje afgevinkt! Klik maar op Sinterklaas: hij kan aan wal."]]);
    say([['hoofd', "Volgens mijn lijstje moeten we om elf uur in Grave zijn. Het is al vijf voor!"], ['hoofd', tx('Wat er nog moet: {list}.', { list: left.join(', ').toLowerCase() })]]);
  },
  zakken(){ S.f.zakTaps = (S.f.zakTaps || 0) + 1; save();
    say(S.f.zakTaps > 2 ? ["Je knijpt nog eens in een zak. Er piept iets. Een piepend pakje? Je krijgt het niet te zien."] : ["Jutezakken vol pakjes, en een paar losse pakjes in glanzend papier. Op één label staat: NIET SCHUDDEN.", ['hoofd', "Handen thuis, Hulppiet! Die zijn voor 5 december."]]); },
  doos(){ if(S.f.box) return say("De hoedendoos is leeg. De mijter heb je al gevonden."); openHatbox(); },
  boek(){ S.ach.boek = true; save();
    say(["Het Grote Boek van Sinterklaas. Er staan duizenden namen in, met kleine aantekeningen ernaast.",
         "Je bladert stiekem naar de letter van je eigen naam. Er staat: \"Heel behulpzaam. Wil graag Hulppiet zijn.\"",
         ['sint', "Ahum. Het Grote Boek is van mij, beste Hulppiet. Maar ja, dat klopt wel, hè?"]]); },
  oorkonde(){ openOorkonde(); },
  kalender(){ say(["Een scheurkalender: ZATERDAG 14 NOVEMBER 2026. Met rode letters: Intocht in Grave!", "Iemand heeft er met pen bij geschreven: \"Sint jarig? Nee, dat is pas op 6 december. Maar oud is hij wel!\""]); },
  cijfers(){ openRomeins(); },
  planken(){ if(!S.f.lock) return say(["Vier loopplanken van verschillende lengte, op het dak van de hut.", ['hoofd', "Die hebben we pas nodig als we bij de kade liggen."]]); openPlank(); },
  paard(){
    if(S.f.voer) return say([['paard', "Mmmh. Hihihi."], "Ozosnel kauwt tevreden op zijn hooi. Hij is helemaal rustig."]);
    S.f.horseTaps = (S.f.horseTaps || 0) + 1; save();
    say([['paard', "Hiiihihi!"], S.f.lock ? "Ozosnel stampt met zijn hoeven. Al die muziek en zwaaiende kinderen maken hem zenuwachtig. Hij snuffelt aan de voerkist." : "Ozosnel, het schimmelpaard van Sinterklaas. Hij schudt zijn manen en snuffelt aan de voerkist."]);
  },
  voer(){ if(S.f.voer) return say("De voerkist. Ozosnel heeft al gegeten."); if(has('emmer')) return say("Je hebt de emmer al gevuld. Geef hem aan Ozosnel."); openVoer(); },
  vlag(){ say(["Bovenin de mast wappert de vlag van Sinterklaas: rood met een witte mijter.", "Achterop wappert de Nederlandse vlag: rood, wit en blauw, van boven naar beneden."]); },
  rad(){ say(S.f.engine && !S.f.lock ? "Het schoepenrad draait en spat het water van de Maas in het rond." : ["Het grote schoepenrad aan de zijkant. Als de stoommachine draait, draait het rad, en de schoepen duwen het water naar achteren.", "Zo duwt de boot zichzelf vooruit."]); },
  oever(){ say(["Knotwilgen, koeien en in de verte een molen. Het is stil op de Maas.", "Te stil: de stoomboot ligt stil. Er komt geen rook meer uit de schoorsteen."]); },
  sluis(){ if(S.f.lock) return; openSluis(); },
  kade(){ S.ach.zwaai = true; save(); say(["Honderden kinderen op de kade! Ze zwaaien met vlaggetjes en dragen papieren mijters en Pietenmutsen.", "Je zwaait terug. Een klein meisje gilt: \"Kijk, een Hulppiet!\""]); },
  burg(){ say([['burg', "Welkom in Grave! Ik heb een hele toespraak geschreven. Vier kantjes."], ['burg', "Maar ik zie dat Sinterklaas nog niet van de boot af kan. Ik oefen nog even."]]); },
  kerk(){ say("De toren van de Sint-Elisabethkerk in Grave. Het is bijna elf uur."); },
  mast(){ say([['piet', "Hoi Hulppiet! Ik ben Klimpiet. Vanaf hier zie ik heel Grave al liggen!"], ['piet', "Ik klim overal op: masten, daken, schoorstenen. Behalve op Ozosnel. Die vindt dat niet leuk."]]); },
  loopplank(){ if(S.f.out1) return startCh2(); if(ready1()) return win1(); say("De loopplank ligt klaar. Maar is alles op het lijstje van Hoofdpiet al gedaan?"); }
};

/* ---------- puzzel 1: de stoomketel (water kookt bij 100 °C en wordt stoom) ---------- */
function openKetel(){
  const k = S.ktl || (S.ktl = { w: 0, t: 20 });
  const draw = () => {
    const lvl = 120 - k.w * 18;
    return `<svg viewBox="0 0 320 170" class="ketel-svg" aria-hidden="true">
      <rect x="20" y="20" width="200" height="120" rx="58" fill="#555c66" stroke="#2e3238" stroke-width="5"/>
      <clipPath id="ketClip"><rect x="22" y="22" width="196" height="116" rx="56"/></clipPath>
      <rect x="20" y="${30 + (5 - k.w) * 20}" width="200" height="140" fill="${k.t >= 100 ? '#7fb6e0' : '#3d8fd0'}" clip-path="url(#ketClip)" opacity=".85"/>
      ${k.t >= 100 && k.w ? [50,90,130,170].map((x, i) => `<circle class="ket-bub" style="animation-delay:-${i * .4}s" cx="${x}" cy="120" r="5" fill="#d9eefb"/>`).join('') : ''}
      <rect x="60" y="140" width="120" height="22" fill="#2a2a2a"/>
      ${S.ktl.lit ? '<ellipse class="flame" cx="120" cy="152" rx="40" ry="9" fill="#ff8a2e"/>' : ''}
      <rect x="240" y="22" width="22" height="120" rx="4" fill="#e9f3f7" stroke="#7b8086" stroke-width="3"/>
      <rect x="244" y="${lvl + 20}" width="14" height="${142 - lvl - 22}" fill="#3d8fd0"/>
      <path d="M236 ${120 - 2 * 18 + 20} h30 M236 ${120 - 4 * 18 + 20} h30" stroke="#c4302b" stroke-width="3"/>
      <text x="270" y="${120 - 4 * 18 + 24}" font-size="11" fill="#f6ead2" font-family="IBM Plex Mono, monospace">MAX</text>
      <text x="270" y="${120 - 2 * 18 + 24}" font-size="11" fill="#f6ead2" font-family="IBM Plex Mono, monospace">MIN</text>
    </svg>`;
  };
  openModal('De stoomketel', 'Machinekamer · de machine is stilgevallen', `
    <div class="ketel">
      <div class="ket-top">${draw()}<div class="ket-thermo"><b id="ket-t">${k.t} °C</b><span>water in de ketel</span></div></div>
      <div class="ket-card">Zo werkt het: het vuur maakt het water heet. Bij <b>100 °C</b> kookt het water en wordt het <b>stoom</b>. Stoom neemt veel meer ruimte in dan water en duwt de zuiger: zo draait het schoepenrad. Houd het water tussen <b>MIN</b> en <b>MAX</b>!</div>
      <div class="ket-btns">
        <button type="button" class="btn ghost" id="ket-pomp">Water pompen</button>
        <button type="button" class="btn ghost" id="ket-tap">Water aftappen</button>
        <button type="button" class="btn ghost" id="ket-kolen">Kolen scheppen</button>
        <button type="button" class="btn" id="ket-kraan">Stoomkraan open</button>
      </div>
      <div class="feedback" id="ket-fb"></div>
    </div>`, body => {
    const redraw = () => { body.querySelector('.ket-top svg').outerHTML = draw(); $('#ket-t').textContent = k.t + ' °C'; applyVisuals(); save(); };
    $('#ket-pomp').onclick = () => { if(k.w >= 5){ nope(); return fb('#ket-fb', 'De ketel is tot bovenaan vol. Meer kan er niet in.', 'bad'); }
      k.w++; beep(300 + k.w * 40, .06); redraw(); fb('#ket-fb', k.w >= 5 ? 'Helemaal vol, tot bovenaan het peilglas. Boven MAX!' : k.w >= 2 ? (k.w > 4 ? '' : 'Het water staat tussen MIN en MAX.') : 'Er komt water in de ketel. Nog niet genoeg: het staat onder MIN.'); };
    $('#ket-tap').onclick = () => { if(k.w <= 0) return fb('#ket-fb', 'De ketel is al leeg.'); k.w--; beep(260, .06); redraw(); fb('#ket-fb', tx('Je tapt wat water af. Het peil staat nu op {n} van de 5 streepjes.', { n: k.w })); };
    $('#ket-kolen').onclick = () => {
      if(k.w < 2){ nope(); return fb('#ket-fb', 'Ho! Er zit bijna geen water in de ketel. Een lege ketel wordt gloeiend heet en kan kapotgaan. Eerst water erin, tot tussen MIN en MAX.', 'bad'); }
      k.lit = true; beep(160, .1, 'square', .03);
      if(k.t >= 100){ S.f.boilSeen = true; redraw(); return fb('#ket-fb', 'De thermometer blijft op 100 °C staan! Kokend water wordt niet heter: alle extra warmte maakt er stoom van. Je hoort het borrelen.'); }
      k.t = Math.min(100, k.t + 20); redraw();
      fb('#ket-fb', k.t >= 100 ? 'Het water borrelt en bruist: 100 °C. Het kookt!' : tx('Het vuur gloeit. Het water is nu {t} °C.', { t: k.t }));
    };
    $('#ket-kraan').onclick = () => {
      if(k.w >= 5){ nope(); return fb('#ket-fb', 'Er spuit water uit de stoompijp in plaats van stoom! De ketel is te vol: boven het water moet ruimte blijven voor de stoom. Tap wat af.', 'bad'); }
      if(k.w < 2){ nope(); return fb('#ket-fb', 'Er komt niets. Zonder water geen stoom.', 'bad'); }
      if(k.t < 100){ nope(); return fb('#ket-fb', tx('Er komt alleen een zuchtje warme lucht. Het water is {t} °C: warm, maar het kookt nog niet. Water wordt pas stoom bij 100 °C.', { t: k.t }), 'bad'); }
      S.f.engine = true; save();
      fb('#ket-fb', 'Psssssst! De stoom duwt de zuiger heen en weer, en het schoepenrad gaat draaien. Stoom neemt wel 1700 keer zoveel ruimte in als het water waar het van gemaakt is: daarom duwt het zo hard!', 'good');
      solved(() => { applyVisuals(); moment('boot', 'sb-arrive', 4000);
        say([['sys', "Puf, puf, puf. Er komt weer rook uit de schoorsteen en de stoomboot vaart verder over de Maas."],
             ['hoofd', "Hoera! Maar kijk: de sluis bij Grave. Het water achter die deuren staat veel hoger dan hier. Hoe komen we daar ooit?"],
             ['hoofd', "Vraag het de sluiswachter, in het huisje op de kant."]]); }, 2200);
    };
  });
}

/* ---------- puzzel 2: de sluis (stappen in de goede volgorde; water zoekt zijn eigen niveau) ---------- */
function openSluis(){
  const L = S.slu || (S.slu = { pos: 0, low: false, up: false, high: false });   // pos 0 = voor de sluis, 1 = erin, 2 = erdoor
  const draw = () => {
    const lockY = L.high ? 60 : 110, shipX = [30, 150, 270][L.pos], shipY = (L.pos === 0 ? 110 : L.pos === 1 ? lockY : 60) - 22;
    return `<svg viewBox="0 0 360 170" class="sluis-svg" aria-label="De sluis van opzij">
      <rect x="0" y="110" width="110" height="60" fill="#3d8fd0"/>
      <rect x="110" y="${lockY}" width="140" height="${170 - lockY}" fill="#3d8fd0" class="sl-water"/>
      <rect x="250" y="60" width="110" height="110" fill="#3d8fd0"/>
      <rect x="0" y="150" width="360" height="20" fill="#6b5a4a"/>
      <rect x="106" y="${L.low ? 40 : 40}" width="8" height="130" fill="${L.low ? 'transparent' : '#8a5a2a'}" stroke="#5a3a1d" stroke-width="${L.low ? 2 : 0}" stroke-dasharray="${L.low ? '4 4' : ''}"/>
      <rect x="246" y="${L.up ? 20 : 20}" width="8" height="150" fill="${L.up ? 'transparent' : '#8a5a2a'}" stroke="#5a3a1d" stroke-width="${L.up ? 2 : 0}" stroke-dasharray="${L.up ? '4 4' : ''}"/>
      <g transform="translate(${shipX} ${shipY})"><path d="M0 10 h70 l-8 14 h-54z" fill="#22272f"/><rect x="18" y="-6" width="30" height="16" fill="#5a2f1e"/><rect x="50" y="-18" width="8" height="28" fill="#c4302b"/></g>
      <text x="55" y="100" text-anchor="middle" font-size="11" fill="#f6ead2" font-family="IBM Plex Mono, monospace">laag</text>
      <text x="305" y="50" text-anchor="middle" font-size="11" fill="#f6ead2" font-family="IBM Plex Mono, monospace">hoog</text>
      <text x="180" y="16" text-anchor="middle" font-size="11" fill="#f6ead2" font-family="IBM Plex Mono, monospace">sluiskolk</text>
    </svg>`;
  };
  openModal('De sluis bij Grave', 'Sluiswachtershuisje · het bedieningspaneel', `
    <div class="sluis">
      <div id="sl-pic">${draw()}</div>
      <p class="sl-say">De sluiswachter steekt zijn hoofd uit het raam: "Ik heb griep, Hulppiet. Wil jij de knoppen doen? Het water aan de kant van Grave staat hoger dan bij jullie. Als je het goed doet, tilt het water de boot vanzelf omhoog."</p>
      <div class="sl-btns">
        <button type="button" class="btn ghost" id="sl-low">${L.low ? 'Benedendeuren dicht' : 'Benedendeuren open'}</button>
        <button type="button" class="btn ghost" id="sl-fill">Water erin laten</button>
        <button type="button" class="btn ghost" id="sl-drain">Water eruit laten</button>
        <button type="button" class="btn ghost" id="sl-up">${L.up ? 'Bovendeuren dicht' : 'Bovendeuren open'}</button>
        <button type="button" class="btn" id="sl-go">Varen ▶</button>
      </div>
      <div class="feedback" id="sl-fb"></div>
    </div>`, body => {
    const redraw = msg => { $('#sl-pic').innerHTML = draw(); $('#sl-low').textContent = L.low ? 'Benedendeuren dicht' : 'Benedendeuren open'; $('#sl-up').textContent = L.up ? 'Bovendeuren dicht' : 'Bovendeuren open'; save(); if(msg) fb('#sl-fb', msg); };
    const stuck = 'De deuren zitten muurvast! Aan de ene kant staat het water hoger dan aan de andere, en dat duwt met duizenden kilo\'s tegen de deur. Maak het water aan allebei de kanten eerst even hoog.';
    $('#sl-low').onclick = () => { if(!L.low && L.high){ nope(); return fb('#sl-fb', stuck, 'bad'); } L.low = !L.low; beep(200, .2, 'square', .03); redraw(L.low ? 'De benedendeuren gaan open. Het water in de sluis is even laag als bij de boot.' : 'De benedendeuren gaan dicht.'); };
    $('#sl-up').onclick = () => { if(!L.up && !L.high){ nope(); return fb('#sl-fb', stuck, 'bad'); } L.up = !L.up; beep(200, .2, 'square', .03); redraw(L.up ? 'De bovendeuren gaan open. Daar ligt de weg naar Grave!' : 'De bovendeuren gaan dicht.'); };
    $('#sl-fill').onclick = () => {
      if(L.low){ nope(); return fb('#sl-fb', 'Het water stroomt de sluis in… en er aan de andere kant meteen weer uit, door de open benedendeuren. Doe eerst de deuren achter de boot dicht!', 'bad'); }
      if(L.high) return fb('#sl-fb', 'De sluis is al vol. Het water staat even hoog als aan de kant van Grave.');
      L.high = true; beep(180, .6, 'sine', .04); redraw(L.pos === 1 ? 'Het water stroomt door de schuiven naar binnen en de stoomboot gaat langzaam omhoog, als een badeendje in het bad!' : 'De sluis loopt vol tot hij even hoog staat als aan de kant van Grave.');
    };
    $('#sl-drain').onclick = () => {
      if(L.up){ nope(); return fb('#sl-fb', 'Doe eerst de bovendeuren dicht, anders loopt het water uit de hele rivier aan de kant van Grave de sluis door!', 'bad'); }
      if(!L.high) return fb('#sl-fb', 'Het water in de sluis staat al laag.');
      L.high = false; beep(180, .6, 'sine', .04); redraw('Het water loopt weg naar beneden. De sluis staat weer laag.');
    };
    $('#sl-go').onclick = () => {
      if(L.pos === 0){
        if(!L.low){ nope(); return fb('#sl-fb', 'Er zit een dichte deur voor de neus van de boot. Bonk!', 'bad'); }
        L.pos = 1; redraw('De stoomboot vaart de sluis in. Wat moet er nu achter de boot gebeuren?'); return;
      }
      if(L.pos === 1){
        if(!L.up){ nope(); return fb('#sl-fb', L.high ? 'De boot ligt nu hoog, maar de bovendeuren zijn nog dicht.' : 'Daar zit een hoge, dichte deur, en daarachter staat het water veel hoger. Zo kom je er niet door.', 'bad'); }
        L.pos = 2; redraw(); S.f.lock = true; save();
        fb('#sl-fb', 'De stoomboot vaart de sluis uit, het hoge water op. Zo werkt een sluis: deur dicht, water erin, deur open. Het water tilt de boot omhoog!', 'good');
        solved(() => { applyVisuals();
          say([['sys', "Achter de sluis ligt Grave. De kade staat vol kinderen, de muziek speelt en de klokken luiden."],
               ['sluis', "Bedankt, Hulppiet! Hatsjoe!"],
               ['hoofd', "We liggen aan de kade! Nu moet Sinterklaas nog van boord. En Ozosnel ook."]]); }, 2200);
      }
    };
  });
}

/* ---------- puzzel 3: de hoedendoos (Romeinse cijfers en aftrekken) ---------- */
const BOX_CODE = '1756';   // 2026 − CCLXX (270)
function openHatbox(){
  const dig = S.boxd || (S.boxd = [0, 0, 0, 0]);
  openModal('De hoedendoos', 'Rood, met een gouden rand en een cijferslot', `
    <div class="hatbox">
      <div class="hb-label">Hierin: mijn mijter.<br>De code is hoe oud ik dit jaar word.<br><i>— Sint</i></div>
      <div class="padlock">${[0,1,2,3].map(i => `<div class="wheel"><button type="button" class="up" data-w="${i}" aria-label="Wieltje ${i + 1} omhoog">▲</button><b id="bd${i}">${dig[i]}</b><button type="button" class="dn" data-w="${i}" aria-label="Wieltje ${i + 1} omlaag">▼</button></div>`).join('')}
        <button type="button" class="btn" id="box-try">Open</button></div>
      <div class="feedback" id="box-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.wheel button').forEach(b => b.onclick = () => {
      const i = +b.dataset.w; dig[i] = (dig[i] + (b.classList.contains('up') ? 1 : 9)) % 10; save();
      $('#bd' + i).textContent = dig[i]; beep(500, .02);
    });
    $('#box-try').onclick = () => {
      const code = dig.join('');
      if(code === BOX_CODE){
        S.f.box = true; save(); give('mijter'); applyVisuals();
        fb('#box-fb', 'Klik! Het slot springt open. 2026 − 270 = 1756. Sinterklaas wordt dit jaar 1756 jaar! (Ongeveer dan. Zo precies weet niemand dat.)', 'good');
        return solved(() => say(["In de doos ligt de mijter van Sinterklaas, op een rood kussentje. Je neemt hem mee.", ['hoofd', "Snel, geef hem aan Sint! Zonder mijter herkent niemand hem. Nou ja, bijna niemand."]]), 2400);
      }
      nope();
      fb('#box-fb', code === '0270' ? 'Dat is het jaar waarin Sint geboren is. Hoe oud is hij nú, in het jaar op de kalender?'
        : code === '2296' ? 'Je hebt opgeteld. Maar hoeveel jaar zit er tússen het jaar waarin hij geboren is en nu? Dat is aftrekken.'
        : code === '2026' ? 'Dat is het jaar van nu. Maar hoe lang geleden is Sint geboren?'
        : 'Het slot blijft dicht. Wanneer is Sint geboren? Kijk eens aan de muur van de hut.', 'bad');
    };
  });
}
function openOorkonde(){
  openModal('De oorkonde', 'In een houten lijstje aan de muur van de hut', `
    <div class="oorkonde">
      <div class="ok-h">OORKONDE</div>
      <p>Hierbij verklaren wij dat</p>
      <p class="ok-name">Nicolaas</p>
      <p>geboren is in de stad Myra, aan de zee,<br>in het jaar</p>
      <p class="ok-year">CCLXX</p>
      <p class="ok-small">en dat hij heel goed voor kinderen zorgt.</p>
      <div class="ok-seal">✦</div>
    </div>`);
}
function openRomeins(){
  openModal('Romeinse cijfers', 'Een poster aan de muur van de hut', `
    <div class="romeins">
      <div class="rm-grid">${[['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]].map(([l, n]) => `<div><b>${l}</b><span>${n}</span></div>`).join('')}</div>
      <p>Lang geleden schreven de Romeinen getallen met letters. Staan de letters van groot naar klein? Dan <b>tel je ze op</b>.</p>
      <p class="rm-ex">Voorbeeld: <b>MDCL</b> = 1000 + 500 + 100 + 50 = <b>1650</b></p>
      <p class="rm-small">(Staat een kleine letter vóór een grote, zoals IV, dan haal je hem eraf: IV = 5 − 1 = 4.)</p>
    </div>`);
}

/* ---------- puzzel 4: de voerkist (wat een paard wel en niet mag eten) ---------- */
const FEED = [
  ['wortel', 'Wortels', true, 'Wortels: knapperig en gezond. Ozosnel is er dol op.'],
  ['hooi', 'Hooi', true, 'Hooi: gedroogd gras. Daar zitten veel vezels in, en die heeft een paard het meest nodig.'],
  ['appel', 'Een appel', true, 'Een appel: lekker en gezond, als je hem in stukjes geeft.'],
  ['choco', 'Chocoladeletter', false, 'Nee! Chocolade is giftig voor paarden, en ook voor honden en katten. Er zit een stofje in, theobromine, dat hun hart van slag brengt. Chocolade is alleen voor mensen.'],
  ['pepernoot', 'Pepernoten', false, 'Een paar pepernoten als snoepje kan echt geen kwaad, maar een hele zak? Een paard heeft vooral vezels nodig, zoals hooi en gras. Bewaar ze voor de kinderen!'],
  ['chips', 'Een zak chips', false, 'Chips zijn zout en vet. Niks voor een paard (en eigenlijk ook niet zo goed voor jou).']
];
function openVoer(){
  const pick = S.vr || (S.vr = []);
  openModal('De voerkist', 'Wat stop je in de emmer voor Ozosnel?', `
    <div class="voer">
      <div class="vr-items">${FEED.map(([k, n]) => `<button type="button" class="vr-it${pick.includes(k) ? ' on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
      <div class="vr-card">Op de kist staat met krijt: <i>"Ozosnel eet 3 dingen. Alleen gezond paardenvoer! — Hoofdpiet"</i></div>
      <div class="vr-bucket">In de emmer: <b id="vr-in">${pick.length ? pick.map(k => FEED.find(f => f[0] === k)[1].toLowerCase()).join(', ') : 'nog niets'}</b></div>
      <button type="button" class="btn" id="vr-take" ${pick.length === 3 ? '' : 'disabled'}>Emmer meenemen</button>
      <div class="feedback" id="vr-fb"></div>
    </div>`, body => {
    const show = () => { $('#vr-in').textContent = pick.length ? pick.map(k => FEED.find(f => f[0] === k)[1].toLowerCase()).join(', ') : 'nog niets'; $('#vr-take').disabled = pick.length !== 3; save(); };
    body.querySelectorAll('.vr-it').forEach(b => b.onclick = () => {
      const [k, , ok, msg] = FEED.find(f => f[0] === b.dataset.k);
      if(!ok){ nope(); if(k === 'choco') S.f.chocoTried = true; return fb('#vr-fb', msg, 'bad'); }
      if(pick.includes(k)){ pick.splice(pick.indexOf(k), 1); b.classList.remove('on'); show(); return fb('#vr-fb', 'Je haalt het er weer uit.'); }
      pick.push(k); b.classList.add('on'); beep(600, .05); show(); fb('#vr-fb', msg, 'good');
    });
    $('#vr-take').onclick = () => { give('emmer'); closeModal(); say("Je hebt een emmer vol gezond paardenvoer. Nu nog aan Ozosnel geven."); };
  });
}

/* ---------- puzzel 5: de loopplank (hoe langer de plank, hoe minder steil) ---------- */
const PLANKS = [2, 4, 6, 8];
function openPlank(){
  const P = S.plk || (S.plk = { m: 4 });
  const draw = () => {
    const sc = 26, h = 2 * sc, len = P.m * sc, run = Math.sqrt(Math.max(0, len * len - h * h));
    const x0 = 270, y0 = 40, x1 = x0 - run, y1 = y0 + h;
    return `<svg viewBox="0 0 320 130" class="plank-svg" aria-hidden="true">
      <rect x="270" y="40" width="50" height="70" fill="#22272f"/><rect x="270" y="36" width="50" height="6" fill="#f3efe6"/>
      <rect x="0" y="${y0 + h}" width="320" height="40" fill="#a59a8a"/>
      <path d="M262 40 v${h}" stroke="#f2b631" stroke-width="2" stroke-dasharray="4 3"/><text x="248" y="${y0 + h / 2 + 4}" font-size="11" fill="#f2b631" text-anchor="end" font-family="IBM Plex Mono, monospace">2 m</text>
      <path d="M${x0} ${y0} L${x1.toFixed(1)} ${y1}" stroke="#b88449" stroke-width="7" stroke-linecap="round"/>
      <text x="${((x0 + x1) / 2).toFixed(0)}" y="${(y0 + y1) / 2 - 8}" font-size="11" fill="#f6ead2" text-anchor="middle" font-family="IBM Plex Mono, monospace">${P.m} m</text>
    </svg>`;
  };
  openModal('De loopplank', 'Van het dek naar de kade', `
    <div class="plank">
      <div id="pl-pic">${draw()}</div>
      <div class="pl-card">Op de staldeur van Ozosnel hangt een kaartje: <i>"Ozosnel loopt alleen over een plank die voor elke meter omhoog minstens <b>4 meter</b> lang is. Steiler? Dan glijdt hij uit."</i></div>
      <div class="pl-btns">${PLANKS.map(m => `<button type="button" class="btn ghost${P.m === m ? ' on' : ''}" data-m="${m}">${m} meter</button>`).join('')}</div>
      <button type="button" class="btn" id="pl-lay">Leg deze plank neer</button>
      <div class="feedback" id="pl-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.pl-btns .btn').forEach(b => b.onclick = () => { P.m = +b.dataset.m; save(); body.querySelectorAll('.pl-btns .btn').forEach(x => x.classList.toggle('on', x === b)); $('#pl-pic').innerHTML = draw(); fb('#pl-fb', ''); });
    $('#pl-lay').onclick = () => {
      if(!S.f.voer){ nope(); return fb('#pl-fb', 'Ozosnel stampt en briest. Zo zenuwachtig loopt hij over geen enkele plank. Maak hem eerst rustig.', 'bad'); }
      const per = P.m / 2;
      if(P.m < 8){ nope(); return fb('#pl-fb', P.m === 2 ? 'Een plank van 2 meter voor 2 meter hoogte? Dan staat hij recht omhoog: dat is een ladder! Paarden kunnen niet op een ladder klimmen.' : tx('Te steil! Deze plank is maar {per} meter lang voor elke meter omhoog. Ozosnel zet één hoef erop en doet een stap terug.', { per }), 'bad'); }
      S.f.plank = true; save(); applyVisuals();
      fb('#pl-fb', '8 meter voor 2 meter hoogte: dat is 4 meter plank voor elke meter omhoog. Precies goed! Hoe langer de plank, hoe minder steil hij is.', 'good');
      solved(() => say([['hoofd', "De loopplank ligt er! Alles van mijn lijstje is klaar."], ['hoofd', "Klik op Sinterklaas, dan gaat hij aan wal."]]), 2400);
    };
  });
}

/* ---------- begin en einde ---------- */
function intro1(){
  say([['sys', "Zaterdag 14 november. De stoomboot uit Spanje vaart over de Maas, op weg naar Grave."],
       ['sys', "En jij bent erbij! Je hebt de grote wedstrijd gewonnen en je mag een hele Sinterklaastijd Hulppiet zijn."],
       ['hoofd', "Welkom aan boord, Hulppiet! Ik ben Hoofdpiet. Over een uurtje zijn we in Grave, en…"],
       ['sys', "Puf… puf… pfffft. Het schoepenrad draait langzamer, en staat dan helemaal stil."],
       ['hoofd', "O nee, de stoommachine! En de hele kade van Grave wacht op ons!"],
       ['sint', "Rustig maar, Hoofdpiet. Wij hebben toch een Hulppiet? Kijk jij eens rond, beste kind. Klik maar overal op."]], () => { S.f.introDone = true; save(); });
}
function win1(){
  S.f.out1 = true; save(); moment('boot', 'sb-ashore', 6500); applyVisuals(); chord([523,659,784,1046,1318], 120);
  say([['sint', "Dank je wel, beste Hulppiet. Wat een hulp ben jij!"],
       ['sys', "Sinterklaas loopt over de loopplank, met zijn staf en zijn mijter. Ozosnel loopt rustig achter hem aan."],
       ['burg', "Welkom in Grave, Sinterklaas!"],
       ['sys', "Duizend kinderen zingen: \"Zie ginds komt de stoomboot!\" En ze zwaaien naar Sint. En naar jou."],
       ['sint', "En nu, Hulppiet, ga jij naar huis. Vanavond mag je je schoen zetten…"]], showWin);
}
