// Alle hints (twee per puzzel: eerst een duwtje, dan het antwoord) en hoe het spel bepaalt bij welke puzzel je bent.
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

const HINTS = {
  /* hoofdstuk 1 */
  ketel: ["De stoomboot ligt stil. In de machinekamer staat de stoomketel. Lees het kaartje: het water moet tussen MIN en MAX staan, en het moet koken.", "Pomp water tot het tussen MIN en MAX staat (2 tot 4 streepjes), schep vier keer kolen tot 100 °C, en draai de stoomkraan open."],
  sluis: ["Voor de boot ligt een sluis. Het water aan de kant van Grave staat hoger. Klik op het huisje van de sluiswachter.", "Benedendeuren open, varen, benedendeuren dicht, water erin laten, bovendeuren open, varen."],
  mijter: ["Sint mist zijn mijter. Die ligt in de hoedendoos in de hut, op slot met een code: zijn leeftijd. Kijk op de oorkonde, de poster en de kalender in de hut.", "Sint is geboren in CCLXX = 270 en het is 2026. 2026 − 270 = 1756. Zet het slot op 1 7 5 6 en geef de mijter aan Sint."],
  geef: ["Je hebt de mijter. Waar hoort die?", "Kies de mijter in je zakken en klik op Sinterklaas."],
  voer: ["Ozosnel is onrustig. In de voerkist naast zijn stal zit van alles. Wat is gezond voor een paard?", "Doe wortels, hooi en een appel in de emmer (geen chocolade: die is giftig voor paarden). Geef de emmer aan Ozosnel."],
  plank: ["Sint en Ozosnel moeten van het dek af. Op het dak van de hut liggen loopplanken. Lees het kaartje van Ozosnel.", "Het dek ligt 2 meter boven de kade, en Ozosnel wil 4 meter plank per meter omhoog. 2 × 4 = 8: kies de plank van 8 meter."],
  aanwal: ["Alles van het lijstje van Hoofdpiet is klaar.", "Klik op Sinterklaas: hij gaat aan wal."],
  /* hoofdstuk 2 */
  maat: ["Pak je eigen schoen van het rek. Welke maat heb je? Op tafel ligt het papier waarop Mama je voet heeft getekend.", "Je voet is 20 cm. 20 × 1,5 = 30. Kies op het schoenenrek de groene schoen, maat 30."],
  plek: ["Zet je schoen bij de kachel. Maar wat gebeurt er met chocolade als het te warm is? Lees de wikkel van de chocoladeletters op de plank.", "Kies je schoen in je zakken, klik op de kachel en kies D: anderhalve meter ervandaan (21 °C). Chocolade smelt bij ongeveer 34 °C."],
  wortel: ["Ozosnel heeft honger. Waar bewaar je groente?", "Klik op de keuken om een wortel uit de koelkast te pakken, en gebruik hem op je schoen."],
  tekening: ["Sint vindt het leuk als je een tekening maakt. Op tafel liggen papier en kleurpotloden. Een mijter is links en rechts precies hetzelfde.", "Maak de rechterkant het spiegelbeeld van de linkerkant: elk vakje rechts is hetzelfde als het vakje er precies tegenover, links van de streep. Leg de tekening daarna bij je schoen."],
  liedje: ["Je schoen is klaar. Nu nog een liedje zingen! Op de grond staat een xylofoon met een liedjesboek.", "Speel G E G A G E D C. Hoe hoger de noot op de balk, hoe hoger de toon."],
  nachten: ["Mama wil weten hoeveel nachtjes het nog is tot pakjesavond. Kijk op de kalender.", "Van 14 tot 30 november zijn het 16 nachtjes, plus 5 in december: 21."],
  bed: ["Alles is klaar voor vannacht.", "Klik op de trap om naar bed te gaan."],
  /* hoofdstuk 3 */
  code: ["De jutezak zit op slot. Het wachtwoord staat op het label, in Pietencode: elke letter is één stap opgeschoven.", "Schuif elke letter één stap terug in het alfabet: QFQFSOPPU wordt PEPERNOOT."],
  adres: ["Welke huizen horen bij de kinderen op het lijstje? Het straatnaambord vertelt aan welke kant de even en oneven nummers staan.", "Klik op de zak. Links staan 1, 3, 5, 7, 9, 11, 13 en rechts 2, 4, 6, 8, 10, 12, 14. Noor is het vierde huis rechts, Daan het zesde links, Lotte het tweede rechts."],
  past: ["Welke pakjes van Noor passen door een schoorsteen van 32 × 32 cm? Een pakje mag ook rechtop naar beneden.", "Een pakje past als de twee kleinste maten allebei kleiner zijn dan 32: de vlieger, de knuffelbeer en het skateboard."],
  touw: ["De pakjes moeten aan een touw naar beneden. Er ligt een rol touw op het dak.", "Pak het touw en gebruik het op de schoorsteen. Tel de hokjes: 9 meter. Kies het touw van 10 meter."],
  wind: ["De muts van Klimpiet is weggewaaid! De windhaan op de kerktoren wijst naar waar de wind vandaan komt.", "Klik op de windhaan. Hij wijst naar het westen, dus de wind waait naar het oosten. Kies: naar het oosten."],
  /* hoofdstuk 4 */
  deur: ["Er wordt op de deur gebonsd!", "Klik op de voordeur, en zet de zware zak op het skateboard van Sem: wielen geven minder wrijving."],
  namen: ["De pakjes hebben geen naam. Klik op de pakjes en lees de aanwijzingen van Sint.", "Rond: Sem. Lang: Papa. Plat: Oma. Zacht: Mama."],
  gedicht: ["Oma heeft een gedicht met gaten erin. Klik op Oma. Een gedicht rijmt: de laatste woorden klinken aan het eind hetzelfde.", "Stoel rijmt op doel, bank rijmt op dank."],
  net: ["Er zit nog iets in de zak: een surprise van karton. Klik op de zak.", "Kies bouwplaat A en C: een rij van vier, met één vlakje boven en één onder."],
  speur: ["Het laatste briefje van Sint in de zak: een speurtocht. Begin bij de kachel op B1.", "4 vakjes naar rechts is F1, en 3 omhoog is F4. Klik op F4."],
  groot: ["Je hebt het grootste pakje gevonden!", "Klik op het grote goudgele pakje."]
};
function stage1(){
  const f = S.f;
  if(!f.engine) return 'ketel';
  if(!f.mijter) return has('mijter') ? 'geef' : (f.lock ? 'mijter' : 'sluis');
  if(!f.lock) return 'sluis';
  if(!f.voer) return 'voer';
  if(!f.plank) return 'plank';
  return 'aanwal';
}
function stage2(){
  const f = S.f;
  if(!f.maat) return 'maat';
  if(!f.plek) return 'plek';
  if(!f.wortelIn) return 'wortel';
  if(!f.tekeningIn) return 'tekening';
  if(!f.liedje) return 'liedje';
  if(!f.nachten) return 'nachten';
  return 'bed';
}
function stage3(){
  const f = S.f;
  if(!f.code) return 'code';
  if(!f.adres) return 'adres';
  if(!f.past) return 'past';
  if(!f.touw) return 'touw';
  return 'wind';
}
function stage4(){
  const f = S.f;
  if(!f.zak) return 'deur';
  if(!f.namen) return 'namen';
  if(!f.gedicht) return 'gedicht';
  if(!f.net) return 'net';
  if(!f.speur) return 'speur';
  return 'groot';
}
function stage_(){ return [stage1, stage2, stage3, stage4][S.ch - 1](); }
