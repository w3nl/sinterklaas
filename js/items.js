// Dingen uit je zakken gebruiken op iets in de kamer (useItem), voor alle hoofdstukken.
// Geladen op volgorde door js/boot.js; alle spelbestanden delen dezelfde globale ruimte.

function useItem(item, hs){
  if(item === 'koek'){
    const st = stage_(), arr = HINTS[st];
    if(chapterDone() || !arr) return say([['koek', "…"], "De speculaaspop zegt niets. Hij kijkt heel tevreden naar je."]);
    S.ach.koek = true; save();
    return say([['koek', "Psst…"], ['sys', tx('De speculaaspop fluistert: {hint}', { hint: arr[0] })]]);
  }
  /* hoofdstuk 1 */
  if(item === 'mijter'){
    if(hs !== 'sint') return say(hs === 'paard' ? "Ozosnel snuffelt aan de mijter en niest. Die is niet voor hem." : hs === 'hoofd' ? [['hoofd', "Voor mij? Nee hoor, ik heb mijn eigen muts. Die is voor Sint!"]] : "Een mijter hoort op het hoofd van één iemand. En dat ben jij niet.");
    take('mijter'); S.f.mijter = true; save(); applyVisuals(); chord([523,659,784]);
    return say([['sint', "Mijn mijter! Dank je wel, beste Hulppiet. Nu voel ik me pas echt Sinterklaas."], ['hoofd', "En nu herkent iedereen hem weer!"]]);
  }
  if(item === 'emmer'){
    if(hs !== 'paard') return say(hs === 'sint' ? [['sint', "Wortels en hooi? Dank je, maar ik houd het bij pepernoten. Die emmer is voor Ozosnel."]] : "Die emmer met voer is voor Ozosnel.");
    take('emmer'); S.f.voer = true; save(); applyVisuals(); chord([523,659,784]);
    return say([['paard', "Hihihi! Mmmh."], "Ozosnel steekt zijn neus in de emmer en kauwt. Hij zwiept met zijn staart en houdt op met stampen. Helemaal rustig.", ['sint', "Zie je wel? Met een volle buik is iedereen rustig. Paarden ook."]]);
  }
  /* hoofdstuk 2 */
  if(item === 'schoen'){
    if(hs === 'kachel' || hs === 'pijp') return openPlek();
    return say("Je schoen hoort bij de kachel. Daar komt Piet vannacht langs, door de schoorsteen.");
  }
  if(item === 'wortel'){
    if(hs === 'kat') return say("Poes ruikt aan de wortel en kijkt je beledigd aan. Ze is een kat, geen paard.");
    if(!S.f.plek) return say("De wortel gaat in je schoen. Zet je schoen eerst op een goede plek bij de kachel.");
    if(hs !== 'schoen' && hs !== 'kachel') return say("Die wortel is voor Ozosnel. Stop hem in je schoen bij de kachel.");
    take('wortel'); S.f.wortelIn = true; save(); applyVisuals(); beep(600, .06);
    return say("Je stopt de wortel in je schoen. Ozosnel heeft vannacht vast honger, na al dat lopen over de daken.");
  }
  if(item === 'tekening'){
    if(!S.f.plek) return say("De tekening gaat bij je schoen. Zet je schoen eerst op een goede plek bij de kachel.");
    if(hs !== 'schoen' && hs !== 'kachel') return say(hs === 'mama' ? [['mama', "Wat mooi! Precies symmetrisch. Maar hij is voor Sint, hoor: leg hem bij je schoen."]] : "Leg de tekening bij je schoen, voor Sinterklaas.");
    take('tekening'); S.f.tekeningIn = true; save(); applyVisuals(); beep(600, .06);
    return say(S.f.wortelIn ? "Je zet de tekening rechtop in je schoen, naast de wortel. Nu nog een liedje zingen bij de kachel!" : "Je zet de tekening rechtop in je schoen. Er mist nog iets voor het paard.");
  }
  /* hoofdstuk 3 */
  if(item === 'touw' || item === 'pakjes'){
    if(hs === 'schoorsteen'){
      if(!S.f.past) return say("Eerst moet je weten welke pakjes er door de schoorsteen passen.");
      if(!has('touw')) return say("Gooi de pakjes niet naar beneden! Bind ze aan een touw en laat ze zakken.");
      return openTouw();
    }
    if(hs === 'piet') return say([['piet', "Niet aan mij geven, aan de schoorsteen!"]]);
    return say(item === 'touw' ? "Een touw om pakjes door de schoorsteen te laten zakken." : "Deze pakjes moeten door de schoorsteen van Noor.");
  }
  say(hs === 'paard' ? "Ozosnel snuffelt eraan en schudt zijn hoofd. Nee, dank je." : "Dat werkt hier niet. Probeer het ergens anders.");
}
