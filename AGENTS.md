# AGENTS.md: werken aan Sinterklaas: Het Grote Pakjesavontuur

Aantekeningen voor AI-agents en nieuwe helpers. De README vertelt wat het spel is; dit bestand vertelt wat je niet meteen uit de code haalt. Het algemene recept (gedeeld met *Hello, IT* en *Villa Kakelbont*) staat in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md).

> **Spoilers:** hieronder staan de oplossingen van alle puzzels. Die heb je nodig om te testen.

## Wat dit is

Een point-and-click escaperoom over het Sinterklaasfeest, voor kinderen van ongeveer 8 tot 12 en hun families. Elke puzzel leert één echt idee, verpakt in een grapje.

- 5 hoofdstukken met elk twee kamers: de stoomboot en het ruim (7 puzzels), de woonkamer en de keuken (9), het dak van Twan en het dak van Hidde (7), de werkkamer van Sint en het pakjesmagazijn in het Pakjeshuis (4), pakjesavond en de gang (7). Gewone HTML, CSS, JavaScript en SVG: **geen build, geen framework, geen runtime-afhankelijkheden** (alleen Google Fonts).
- **Alleen Nederlands.** Alle tekst staat direct in de code. Er is geen vertaalsysteem; `tx(tekst, { naam })` in `core.js` vult alleen `{naam}`-plekken in.
- Statische site (GitHub Pages), installeerbaar als PWA, offline speelbaar. **Moet via http(s)** draaien (`npm start`).
- `package.json` en `node_modules/` zijn er alleen voor de tests en de lokale server.

## Kaart van de repository

| Pad | Wat |
|---|---|
| `index.html` | De pagina: kop, speelveld, titel- en eindscherm, zakken, close-up |
| `css/*.css` | In deze volgorde: `base` (tokens op `:root`), `chapter1` … `chapter5`, `phone`, `animations` (als laatste: de noodstop voor beweging) |
| `scenes/*.svg` | De kamers, met ids met het voorvoegsel van de kamer: `boot` (`sb-`), `ruim` (`rm-`), `kamer` (`wk-`), `keuken` (`kk-`), `dak` (`dk-`), `dak2` (`d2-`), `werk` (`wr-`), `magazijn` (`mg-`), `feest` (`pa-`), `gang` (`ga-`); klikvlakken staan als laatste |
| `js/boot.js` | Haalt de kamers op en laadt de scripts op volgorde; `GAME_VERSION`. Lukt dat niet, dan staat op het titelscherm wélk bestand niet laadde |
| `js/core.js` | Motor: `S`, `save`/`load`, geluid, `say()`, `WHO`/`FACES`/`NARRATOR`, `ITEMS`, zakken, `vis()`, `ROOMS` + `applyVisuals()`, `go()`, `moment()`, `gag()`/`gagText()` (grapjes), klikvlakken, `setLabel()`, `openModal()`, `fb()`, `solved()`, `nope()` |
| `js/chapter1.js` | `buildBoot()`, `applyBoot()`, `applyRuim()`, `TODO1`, `KOEK_SAY`, **`H` (de tabel met klikvlakken)**, close-ups `openKetel`, `openSluis`, `openHatbox`, `openOorkonde`, `openRomeins`, `openVoer`, `openPlank`, `openDrijf`, `openBladen`; `intro1()`, `win1()` |
| `js/chapter2.js` | `unlocked(n)`/`setUnlocked(n)`, `applyKamer()`, `applyKeuken()`, `TODO2`, close-ups `openVoet`, `openRek`, `openPlek`, `openTeken`, `openXylo`, `openKal`, `openBakken`, `openOven`, `openBrief`; `intro2()`, `startCh2()`, `win2()` |
| `js/chapter3.js` | `buildDak()`, `applyDak()`, `applyDak2()`, close-ups `openCode`, `openAdres`, `openPast`, `openTouw`, `openWind`, `openWip`, `openSpiegel`; `intro3()`, `startCh3()`, `win3()` |
| `js/chapter4.js` | `applyWerk()`, `applyMagazijn()`, `TODO4`, het Pepernotennieuws (`NIEUWS4`, `openNieuws(soort, daarna)`), close-ups `openLogboek`, `openMaten`, `openRobot` (met `runRobot(programma)`), `openRoute`; `unwrap4()`, `intro4()`, `startCh4()`, `win4()` |
| `js/chapter5.js` | `buildFeest()`, `applyFeest()`, `applyGang()`, `TODO5`, close-ups `openZak`, `openNamen`, `openGedicht`, `openNet`, `openSpeur`, `openDelen`, `openLootjes`; `intro5()`, `startCh5()`, `win5()` |
| `js/items.js` | `useItem(ding, klikvlak)` |
| `js/hints.js` | `HINTS` en `stage1()` … `stage5()`, `stage_()` |
| `js/liedjes.js` | De oude Sinterklaasliedjes (`SONGS`, als "lettergreep=NOOT/tellen") en de speler: `parseSong()`, `noteHz()`, `playSong()`, `singSong()`/`stopSinging()`. De melodieën komen uit oude bladmuziek; verbeter een noot hier en hij klopt overal (achtergrondgeluid, gezongen regels, xylofoonpuzzel, hint) |
| `js/ambience.js` | Gegenereerd achtergrondgeluid per kamer (`ambKey()`, `SOUNDSCAPES`); `songLoop()` speelt liedjes: de fanfare op de kade (stoomboot), zacht gezang uit een schoorsteen op het dak (paardenvoetjes, daken) en een speeldoos op pakjesavond (maan, kloppen, kapoentje, wind) |
| `js/voice.js` | Stemmen (Web Speech API, `nl-NL`); `VOICE_STYLE` per spreker |
| `js/app.js` | `LAST_CH`, `START`, `chapterDone`, `exitLabels`, `refreshMenu`, `CH_END`, `showWin`, scores, `ACH`, knoppen, klok, titelmenu, PWA, `start()` |
| `portraits/*.svg` | `you`, `sint`, `hoofd`, `piet`, `paard`, `koek`, `mama`, `burg`, `inpak`, `vera` (120×120), gemaakt door `tools/personages.py` |
| `tools/personages.py` | Tekent alle personages (Sint, Sint te paard, de Pieten, Ozosnel, de familie, de kinderen op de kade, de burgemeester, de sluiswachter) en de portretten. Zie "Personages tekenen" |
| `sw.js`, `manifest.webmanifest`, `icons/` | De app. `icon.svg` is de bron; de PNG's zijn ervan gemaakt |
| `tests/` | Playwright: `chapter1` … `chapter5`, `progress`, `pwa`, `phone`, `motion`; `helpers.js`; `serve.js` |

## Hoe het in elkaar zit

- **Gewone scripts in één gedeelde ruimte**, geladen door `boot.js`. Elke naam moet uniek zijn over alle bestanden heen.
- **Klikvlak-ids** delen één naamruimte. Hoofdstuk 1: `ketel fluit sint zakken doos koek boek oorkonde kalender cijfers planken hoofd paard voer vlag rad mast oever sluis kade burg kerk loopplank luik`; grapjes `ballon meeuw eendjes molen reiger saab1`; het ruim: `trapop water bladen kisten poort hangmat ruimlamp visje`. Hoofdstuk 2: `deur rek kal mama thermo kachel pijp letters koek raam tekentafel voet keuken xylo kat schoen hout klok stokpaard kast lamp2 plantje`; de keuken: `terugkamer koelkast recept oven wekker keukenklok kkraam kruiden brief etensbak`. Hoofdstuk 3: `windhaan kerk3 sint3 maan huizen bord schoorsteen touw koek piet zak ladder uil kat3 naarlotte`; het dak van Hidde: `terug3 maan2 schoorsteen2 dakraam wip piet2`. Hoofdstuk 4, de werkkamer: `naarmag wklok logboek wraam boekenkast lessenaar sint4 tv glijbaan bureau4 telefoon koek kaart hoofd4 uitgang4 pakje4`; het magazijn: `naarwerk stelling stelling2 klimpiet4 inpakpiet werkbon noppen papier zakken4 paneel band grijparm mgraam`. Hoofdstuk 5: `voordeur papa oma mama sem silvie kachel4 raam4 pepernoten choco koek spandoek zak4 pakjes groot strooigoed saab4 kaars`; de gang: `buitendeur brievenbus trap4 kapstok skate terug4`. `koek` (de speculaaspop) en `mama` bestaan in meer kamers; de handler kijkt naar `S.ch`.
- **Een handler krijgt het aangeklikte klikvlak mee** (`H.ballon(h)`): zo kun je meerdere klikvlakken met hetzelfde id uit elkaar houden (`data-b`, `data-c`), en een klikvlak binnen een bewegende groep (de meeuw, de eendjes, de Saab op de dijk) beweegt gewoon mee.
- **Kamers:** `ROOMS` in `core.js` koppelt `S.scene` aan het hoofdstuk, de titel en de `applyX()`-functie. Elk hoofdstuk heeft twee kamers; je wisselt met `go(scene)`: het luik in de hut van Sint (`luik`, terug met `trapop`), de keukendeur (`keuken` / `terugkamer`), het bordje over de nok naar nummer 4 (`naarlotte`, pas na het touw; terug met `terug3`), de deur naar het magazijn (`naarmag`, pas na het logboek; terug met `naarwerk`), de kamerdeur naar de gang (`voordeur` / `terug4`). De gang en de keuken horen bij twee hoofdstukken: in hoofdstuk 2 ga je via de kamerdeur (`deur`) naar de gang en daar de trap op naar bed (`trap4` → `toBed2()`), en in hoofdstuk 5 kun je even de keuken in. Daar zijn alleen grapjes; de handlers kijken naar `S.ch`, en de titel in `ROOMS` is dan een functie. Een hoofdstuk afmaken zet `outN`; de uitgang (het bordje *Naar huis* op de kade of de loopplank, de trap, de ladder, de voordeur van het Pakjeshuis) leidt dan naar het volgende hoofdstuk. Vrijgespeelde hoofdstukken: `sint-v1-ch2` … `-ch5`.
- **Hoofdstuk 4 is later ingevoegd.** Pakjesavond was hoofdstuk 4 en is nu 5. `renumber()` in `app.js` zet dat één keer om voor oude spelers (marker `sint-v1-ord` = `5`): `-ch4` geeft ook `-ch5`, en de scores van 4 gaan naar 5. Een opgeslagen spel met `ch: 4` in `feest`, `gang` of `keuken` wordt in `start()` hoofdstuk 5 (`out4`/`introDone4` → `out5`/`introDone5`). De tests zetten de marker in `seed()`.
- **SVG-ids zijn globaal**: gebruik het voorvoegsel van de kamer. Let op: een kleurverloop (`url(#…)`) op een kaarsrechte horizontale of verticale lijn tekent niets; geef zo'n lijn een gewone kleur.

### Toestand en opslaan
- `S` is het hele spel: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, opgeslagen in `localStorage['sint-v1']` na elke actie.
- Close-ups blijven zoals je ze achterliet: `S.ktl` (`{w, t, lit}` ketel), `S.slu` (sluis), `S.boxd` (cijferslot), `S.vr` (voeremmer), `S.plk` (plank), `S.drj` (drijven of zinken); `S.tk`/`S.tkPen` (tekening), `S.kln` (getypt aantal nachtjes), `S.bk` (recept), `S.ovm` (kookwekker), `S.br` (verbeterde woorden); `S.cdi` (getypt wachtwoord), `S.adr` (gevonden huizen), `S.pst` (gekozen pakjes), `S.wp` (plek op de wip); `S.rb` (het programma van de grijparm), `S.rt` (`{r}`: de vraag van de route); `S.nm` (namen), `S.gd` (gedicht), `S.nt` (bouwplaten), `S.dl` (delen), `S.lt` (lootjes).
- Andere sleutels: `sint-v1-ch2` … `-ch4`, `-scores`, `-sound`, `-motion`, `-voice`, `-norotate`. Elke toegang tot `localStorage` staat in `try/catch`.
- Een nieuw spel houdt de prestaties (`S.ach`).

### Gesprekken
- `say(regels, daarna?)`; sprekers: `you`, `sys` (verteller; het label boven de tekst komt uit `NARRATOR` per hoofdstuk), `sint`, `hoofd` (Hoofdpiet), `piet` (Klimpiet), `paard` (Ozosnel), `koek`, `mama`, `papa`, `oma`, `sem` (Anne-Lieve), `silvie`, `burg`, `sluis`, `inpak` (Inpakpiet), `vera` (Vera van het Pepernotennieuws). Alleen wie in `FACES` staat heeft een portret.

### Dingen in je zakken
- `koek` (de speculaaspop: gebruik hem op iets voor het eerste duwtje van de huidige hint, telt niet als hint), `mijter`, `emmer`; `schoen`, `wortel`, `tekening`; `touw`, `pakjes`. Hoofdstuk 4 heeft geen dingen nodig. Vier zakken; een hoofdstuk heeft er nooit meer nodig.

## Oplossingen (spoilers)

Hoofdstuk 1, de stoomboot:

| # | Puzzel (echt idee) | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Stoomketel (water kookt bij 100 °C en wordt stoom) | Water pompen tot 2–4 streepjes, 4 keer kolen (100 °C), stoomkraan open | `engine` |
| 2 | Sluis (stappen in de goede volgorde) | Benedendeuren open, varen, benedendeuren dicht, water erin, bovendeuren open, varen | `lock` |
| 3 | Hoedendoos (Romeinse cijfers, aftrekken) | CCLXX = 270; 2026 − 270 = **1756**; mijter op Sint | `box`, `mijter` |
| 4 | Voerkist (chocolade is giftig voor paarden) | Wortels, hooi, appel; emmer op Ozosnel | `voer` |
| 5 | Loopplank (helling: 4 m plank per meter omhoog) | Dek 2 m hoog → **8 meter**; daarna Sinterklaas aanklikken | `plank`, `out1` |
| 6 | Het ruim: drijven of zinken (zwaarder of lichter dan evenveel water) | Luik in de hut → water. Drijven: **hobbelpaard, eendje, voetbal**; zinken: auto, knikkers, chocolademunten | `drijf` |
| 7 | Het ruim: het Grote Boek (alfabetisch, kijk naar de eerste letter die verschilt) | **Anne-Lieve, Daan, Floris, Hidde, Rosa, Sem, Silvie, Twan** | `bladen` |

Hoofdstuk 2, schoen zetten:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Schoenmaat (≈ voetlengte × 1,5) | Voet 20 cm → **maat 30** (groene schoen) | `maat` |
| 2 | Plek (chocolade smelt bij ~34 °C) | Schoen op de kachel → **D: anderhalve meter, 21 °C** | `plek` |
| – | Wortel | Keuken → koelkast → wortel, op de schoen | `wortelIn` |
| 3 | Tekening (spiegelsymmetrie) | Rechterhelft = gespiegelde linkerhelft (`MIJTER_HALF`); tekening op de schoen | `tekening`, `tekeningIn` |
| 6 | Keuken: pepernoten bakken (een recept ×3) | Voor 60 in plaats van 20: **300 g bloem, 150 g suiker, 120 g boter, 6 tl kruiden** | `bakken` |
| 7 | Keuken: de kookwekker (klokkijken) | 7:15 + 25 minuten = **7:40** | `oven` |
| 8 | Keuken: de brief van Anne-Lieve (spelling) | **Liefe → Lieve, grag → graag, stokpaart → stokpaard, bent → ben** | `brief` |
| 4 | Liedje (noten lezen) | Heel "Sinterklaas kapoentje" op de xylofoon (`SONG2`, uit `SONGS.kapoentje` in `js/liedjes.js`): **G G A A G E, G G A A G E, F F F D F F, A G F E D C**. Een valse noot begint alleen die regel opnieuw | `liedje` |
| 5 | Kalender (dagen tellen over twee maanden) | 16 + 5 = **21** | `nachten` |
| – | Naar bed | Kamerdeur → gang → de trap | `out2` |

Hoofdstuk 3, op het dak:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Pietencode (letters één stap terug) | QFQFSOPPU → **PEPERNOOT** | `code` |
| 2 | Huisnummers (even en oneven) | Twan 8, Floris 11, Hidde 4 | `adres` |
| 3 | Welke pakjes passen (32 × 32 cm; de twee kleinste maten tellen) | **B, C, E** (vlieger, beer, skateboard) | `past` |
| 4 | Touw (op schaal: 1 hokje = 1 m) | Touw pakken, op de schoorsteen: **10 meter** (9 nodig) | `touw` |
| 5 | Het dak van Hidde: de wip (hefboom: gewicht × afstand) | Bordje linksonder → zak 20 kg op plek 4, Klimpiet 40 kg op **plek 2** | `wip` |
| 6 | Het dak van Hidde: spiegelschrift (een briefje achter glas) | Dakraam → **groen met stippen** | `spiegel`; terug naar Twan → `gust` |
| 7 | Windhaan (de kop wijst naar waar de wind vandaan komt) | Wijst naar het westen → muts waait **naar het oosten** | `wind`, `out3` |

Hoofdstuk 4, het Grote Boek is zoek (5 december, 's ochtends, in het Pakjeshuis). Het begint en eindigt met het **Pepernotennieuws** (ons eigen nieuwsprogramma, met verslaggever Vera): spoednieuws dat pakjesavond misschien niet doorgaat, en aan het eind goed nieuws.

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Logboek (klokken lezen; welke tijd valt ertussen) | Sint legde het boek om 10 uur neer, om half 11 was het weg → **Inpakpiet** (22:05–22:20). Het magazijn gaat open | `logboek` |
| 2 | Werkbon (mm, cm, dm en m omrekenen) | Het boek is 40 × 30 × 8 cm → **pakje B**: 0,4 m × 3 dm × 80 mm | `maat4` |
| 3 | Grijparm (een programma: stappen in de goede volgorde) | Rooster 6×4, start en band op (6,4), B op (2,1), kist op (4,1)/(4,2), dozen op (3,4): **▲ ◀◀◀◀ ▲▲ pak ▼▼ ▶▶▶▶ ▼ los** | `robot` |
| – | Het pakje | Werkkamer → het pakje op het bureau openmaken | `uitgepakt` |
| 4 | Route (afstand, snelheid, tijd) | 24 km ÷ 12 km per uur = **2 uur**; om 18:00 in Grave → **16:00** vertrekken | `route`, `out4` |

Hoofdstuk 5, pakjesavond:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | De zak (wielen: minder wrijving) | Kamerdeur → gang → voordeur → **op het skateboard** | `zak` |
| 2 | Eerlijk delen (delen met rest) | 27 pepernoten op de vloer, 6 mensen: **4 ieder, 3 over** | `delen` |
| 3 | Namen (logisch redeneren) | Rond Anne-Lieve (de jongste), klein doosje Silvie (de oudste van de kinderen), lang Papa, plat Oma, zacht Mama | `namen` |
| 4 | Gedicht (rijm) | Oma: **doel** (stoel), **dank** (bank) | `gedicht` |
| 5 | Lootjes (niemand heeft zichzelf) | Brievenbus in de gang: **Papa → Jij, Mama → Silvie, Oma → Papa, Silvie → Anne-Lieve, Anne-Lieve → Oma, Jij → Mama** | `lootjes` |
| 6 | Surprise (bouwplaat van een kubus) | Zak → **B en C** | `net` |
| 7 | Speurtocht (coördinaten) | Zak → B1, 4 rechts, 3 omhoog: **F4**; dan het grote pakje | `speur`, `out5` |

Prestaties (`ACH`): `koek`, `toet` (fluit 3×, als de machine draait), `boek` (Grote Boek), `zwaai` (kinderen op de kade), `paardmaan` (raam 3×), `kat` (poes 3×), `sint3` (Sint op het dak), `pepernoot` (5× pepernoten), `sem` (Anne-Lieve 3×), `saab` (de verstopte Saab op de dijk bij de sluis, of de Saab-miniatuur bij de pakjes), `pang` (alle vier de ballonnen op de kade kapot), `tv` (3× op de tv in de werkkamer: zappen), `noppen` (alle noppen van de noppenfolie in het magazijn).

## Grapjes

Veel dingen in de kamers reageren als je erop klikt, zonder dat het iets met de puzzels te maken heeft. `gag(el, klasse, ms)` zet een klasse een tijdje aan (een CSS-animatie, dus de noodstop geldt), `gagText(el, 'PANG!')` laat een woordje boven het ding opstijgen (`.gag-txt` in `base.css`), en er hoort een geluidje bij (`beep`).
- De stoomboot: ballonnen knallen (en groeien terug), de meeuw schrikt en vliegt weg, de eendjes duiken onder, de molen draait door, de reiger schrikt, de schapen springen op en zeggen Bèèèh (`schaap`, `data-s`), de Saab op de dijk zegt BROEM BROEM. Het ruim: het visje achter de patrijspoort, de hangmat.
- Thuis (in beide woonkamers): de hanglamp slingert (3×: Mama moppert), Poes spint (`kat`; in hoofdstuk 2 op het kleed, op pakjesavond boven op het boekenkastje, `#pa-cat`); in hoofdstuk 2 schudt het plantje; de keuken: de kookwekker rammelt, de speculaaskruiden laten je niezen.
- Klokken: binnen een hoofdstuk wijzen alle klokken dezelfde tijd aan. Hoofdstuk 2 is het kwart over zeven (de puzzel met de kookwekker), in het Pakjeshuis negen uur 's ochtends, op pakjesavond acht uur (`#kk-hands2`/`#kk-hands4` in de keuken; `-hands4` hoort bij hoofdstuk 5).
- De daken: de uil vliegt weg en komt terug (vanaf de tweede klik), de maan knipoogt, Zwartje blaast.
- Pakjesavond: kaarsen uitblazen, het spandoek laat links los en bungelt aan één punaise (het staat als laatste in `feest.svg`, dus het valt vóór het raam en de keukendeur langs), de Saab-miniatuur rijdt broem broem heen en weer; in de gang valt de krantenmijter van de kapstok (ook in hoofdstuk 2).

## Valkuilen

Alles uit "Lessons learned" in de blueprint geldt. Vooral:
- `[hidden]{display:none!important}` in `base.css` moet blijven.
- CSS-klassenamen zijn globaal; zoek eerst in `css/`.
- **Beweging:** alles wat beweegt is een **CSS-animatie** (geen SMIL), zodat de noodstop in `animations.css` alles stilzet. Dingen die alleen bestaan als ze bewegen (de ruiter voor de maan, de wegwaaiende muts) beginnen buiten beeld. `tests/motion.spec.js` controleert dat er met Beweging uit niets beweegt.
- Verschijnen en verdwijnen gaat met `vis()` (zachtjes, behalve bij de eerste tekening, met Beweging uit en voor klikvlakken).
- **Wat er beweegt, per kamer** (alles CSS-animaties; `tests/motion.spec.js` controleert een aantal ervan, en dat alles stilstaat met Beweging uit):
  - De stoomboot (`css/chapter1.css`): wolken, een meeuw en de molen, golven en glinsteringen op het water, een eendenfamilie die heen en weer zwemt (`.sb-ducks`), riet dat wiegt, een reiger die zijn kop laat zakken, een vis die af en toe opspringt (`.sb-fish`, bestaat alleen als hij beweegt), de vlaggetjes en vlaggen, Klimpiet in de mast (`#sb-mast`) en de lantaarn, de rook en het schoepenrad als de machine draait (`.sb-sailing`), Hoofdpiet, Ozosnel die stampt tot hij gegeten heeft en dan graast (`.sb-fed`), de kinderen op de kade die zwaaien, de ballonnen aan het hek en het spandoek. **De boot vaart:** als de stoommachine aanslaat schuift de oever naar rechts weg en de sluis van links het beeld in (`moment('boot', 'sb-depart')`), en na de sluis schuift de kade binnen (`moment('boot', 'sb-arrive')`); op de dijk bij de sluis rijdt een Saab die achter de boot verdwijnt (`.sb-saab`). **Aan wal** (`win1()`): `moment('boot', 'sb-ashore')` laat Sint over de loopplank naar de kade lopen en Ozosnel met stappende benen over het dek achter hem aan; daarna houdt `.sb-out` ze op die plek, en valt er confetti (`#sb-confetti`, begint boven het beeld).
  - De woonkamer (`css/chapter2.css`): de slinger van de Friese staartklok, de hanglamp, vonkjes in de kachel, de staart van de kat, de gordijnen, de mijtervlaggetjes en het plantje; achter het raam twinkelen sterren, rookt een schoorsteen, rijdt een ruiter voor de maan, sluipt een Piet over de daken (`.wk-piet`) en waaien herfstblaadjes voorbij (beginnen buiten beeld). Na het liedje zweven muzieknootjes naar de kachelpijp (`#wk-notes`).
  - De daken (`css/chapter3.css`): sterren, een vallende ster en wolkjes voor de maan, een uil die knippert, lampjes in de dakkapellen die aan en uit gaan, rook uit de schoorstenen (plat en snel tijdens de windvlaag, `.dk-gust`), Sint die op Ozosnel heen en weer rijdt over het platte dak (`.dk-ride` + `.walking`: de benen stappen), Klimpiet, de staart van de kat; `moment('dak', 'dk-lower')` laat het pakje aan het touw de schoorsteen in zakken; de muts waait weg (`.dk-capfly`).
  - Het Pakjeshuis (`css/chapter4.css`): in de werkkamer sneeuw achter het raam, Ozosnel die naar binnen gluurt, de secondewijzer, LIVE en de lopende nieuwsregel op de tv (`#wr-tickertxt`, de tekst volgt het verhaal), Hoofdpiet die zenuwachtig heen en weer loopt, het pakje dat uit de glijbaan schuift (`.wr-slide`) en glans op het teruggevonden boek (`.wr-found`). In het magazijn de lopende band met pakjes, Klimpiet boven op de stelling, het knipperende paneel en de grijparm, die met `moment('magazijn', 'mg-send')` pakje B ophaalt en op de band zet (`#mg-carry`). De grijparm staat in rust met een CSS-`transform` op `.mg-robotmove`, dus ook met Beweging uit op zijn plek.
  - Pakjesavond (`css/chapter5.css`): vlaggetjes, de slinger van de klok, kaarsen en de kachel, sneeuw achter het raam, Oma's breinaalden, Anne-Lieve die springt, cadeaus die wiebelen (`.pa-wiggle`, niet de dingen met een eigen `transform`), de kamerdeur die op een kier gaat terwijl er pepernoten door naar binnen vliegen (`moment('feest', 'pa-strooi')`), en confetti en zwaaiende Sint en Klimpiet aan het eind.
  - De nieuwe kamers: in het ruim dobberen de pakjes, golft het water, zwaait de lantaarn en zwemt een visje; op het dak van Hidde kantelt de wip recht (`.d2-level`).
  - **Ozosnel loopt** met vier losse benen (`.hleg a`/`b` uit `tools/personages.py`): zet `walking` op een ouder, dan zwaait elk been vanuit de heup (`hlegStep` in `base.css`), de diagonale paren een halve pas uit elkaar.
  - **Let op:** animeer nooit een groep met een eigen `transform`-attribuut (zoals de groepen die `place()` maakt): een CSS-transform vervangt dat attribuut en het ding springt weg. Animeer een groep eromheen (`#sb-horsewalk`, `#dk-sint`).
- **Hoofdstuk 2 en 4 zijn dezelfde woonkamer** (`kamer.svg` en `feest.svg`), vanuit hetzelfde standpunt: de deur naar de gang met de trap (op pakjesavond dicht), het boekenkastje, het schoenenrek, de bank, de lamp, de klok, het schilderij, de kalender, de thermometer, de kachel met de houtmand, de plank, het raam, de tafel en de keukendeur staan op dezelfde plek. Verplaats je iets in de ene kamer, doe het dan ook in de andere. Alleen de versiering en wat er op tafel ligt verschillen. Wat in beide kamers staat, heeft in beide een klikvlak met hetzelfde id (`lamp2`, `klok`, `kast`, `kal`, `thermo`, `hout`, `keuken`); zet een nieuw grapje dus ook in de andere kamer.
- Controleer nieuwe close-ups op 412×915 en 915×412 (`tests/phone.spec.js`).
- **Verhoog `CACHE` in `sw.js` en `GAME_VERSION` in `js/boot.js` samen** bij elke wijziging, en zet nieuwe bestanden in `CORE` (een test controleert dat). De service worker wist alleen zijn eigen oude caches (`sint-`): Pippi en Hello IT staan op dezelfde github.io-origin.
- Een nieuwe kamer: `scenes/<naam>.svg`, in `scenes` in `boot.js`, in `CORE` in `sw.js`, in `ROOMS` (met een `applyX()`), in `ambKey()` en in `contLine()`.
- Geen `alert/confirm/prompt`. Knoppen hebben `type="button"`.

## Personages tekenen

- Alle mensen en Ozosnel komen uit `tools/personages.py`. Elk personage wordt één keer getekend in zijn eigen assenstelsel (voeten op 0, of het zitvlak op 0 bij wie zit) en met `place()` in een kamer gezet. Zo ziet iedereen er in elke kamer en in de portretten hetzelfde uit.
- In de kamers staat elk personage tussen `<!-- @personage naam -->` en `<!-- @einde naam -->`, binnen de groep met het id dat het spel gebruikt (`sb-sint`, `sb-hoofd`, `sb-horse`, `wk-mama`, `dk-piet`, `dk-sint`, `d2-piet`, `wr-sint`, `wr-hoofd`, `wr-horse`, `wr-vera`, `mg-inpak`, `mg-klim`, `pa-papa`, …). **Pas die stukken niet met de hand aan**: verander het script en draai `python3 tools/personages.py`; het herschrijft de kamers en `portraits/*.svg`.
- Ids die het spel nodig heeft, zitten in de tekening zelf: `sb-hair`, `sb-mitre` en `sb-staff` (Sint met of zonder mijter), `sb-horsehead` (hals en hoofd van Ozosnel, die grazen als hij gegeten heeft) en `dk-cap` (de muts van Klimpiet, die wegwaait).
- Stijl: zachte kleurverlopen, een iets donkerdere rand, ogen met een lichtpuntje, blosjes, handen (Sint en de Pieten met witte handschoenen). Pieten hebben een gewone huidskleur met een paar zachte roetvegen (`soot()`).

## Toon en schrijven

- **Eerst humor, dan leren.** Elk fout antwoord krijgt een grapje én een duwtje.
- **Pieten** zijn roetveegpieten: een gewone huidskleur met roetvegen van de schoorsteen, kleurrijke pakken, een witte kraag en een muts met veer. Geen zwarte gezichten, geen oude stereotypen in tekst of tekeningen.
- De personages:
  - **Sinterklaas:** oud, wijs, vriendelijk, een beetje vergeetachtig; zegt "Wel, wel, wel" en "beste kind" / "beste Hulppiet". Geboren in Myra in 270.
  - **Hoofdpiet:** druk, georganiseerd, heeft altijd zijn lijstje.
  - **Inpakpiet:** pakt alles in wat hij tegenkomt (ook per ongeluk het Grote Boek, en één keer Klimpiet). Blauw met rood.
  - **Vera:** de verslaggever van het Pepernotennieuws. Geen nadoen van een echt tv-programma: eigen naam, eigen tekst.
  - **Klimpiet:** vrolijk, ondeugend, klimt overal op, gek op pepernoten, verliest zijn muts.
  - **Ozosnel:** het schimmelpaard van Sint; zegt "Hihihi", loopt over de daken.
  - **De speculaaspop:** de gratis hint; zegt "…" of "Psst…".
  - **De familie:** Mama, Papa (vist graag, draagt een mijter van krantenpapier), Oma (breit al haar sjaals zelf, 43 stuks), Silvie (de grote zus, `#pa-silvie`) en Anne-Lieve (het kleine zusje, id `sem`). De familie is blond: Mama en Silvie goudblond met een rossige gloed, Papa kort blond zonder baard, Anne-Lieve met een staartje boven op haar hoofd.
- Neem geen teksten, liedjes of tekeningen over uit tv-programma's of boeken; schrijf en teken alles zelf. Uitzondering: de **oude Sinterklaasliedjes** in `js/liedjes.js` (zie hieronder); geen liedjes van radio of tv.
- Elke puzzel heeft twee hints in `HINTS`: een duwtje en het antwoord.

## Liedjes

- Alleen liedjes waarvan tekst én melodie vrij zijn (volksliedjes, of de maker is langer dan 70 jaar dood): *Zie ginds komt de stoomboot* (Schenkman), *Sinterklaas kapoentje*, *Sinterklaasje bonne bonne bonne*, *Zachtjes gaan de paardenvoetjes* en *Op de hoge, hoge daken* (Abramsz, † 1924), *Zie de maan schijnt door de bomen* (Heije/Viotta), *Hoor de wind waait door de bomen* en *Hoor wie klopt daar kinderen*. **Niet** gebruiken: *Dag Sinterklaasje*/*Wees welkom* en *Vijf december* (Antoinette van Dijk, † 1975), *Sinterklaas is jarig* (Oostveen), Broekhuizen.
- Oude teksten blijven zoals ze geschreven zijn ("knecht", "Zwarte Piet"); de familie vindt dat prima.
- Een gesprek laat iemand zingen met een derde element: `['sys', '♪ … ♪', 'maan']`. `singSong()` speelt de melodie (volgt de knop Geluid), de liedjes op de achtergrond zwijgen dan even (`AMB.music`), en de stemmen lezen zo'n regel niet voor.
- Gezongen wordt er op de kade en in `win1()`, na de xylofoon (`kapoentje`, `bonne`), bij de huizen en Sint in hoofdstuk 3, op de tv in `win4()` (`stoomboot`), in `intro5()` (`maan`, `wind`, `kloppen`) en door Anne-Lieve (3×).

## Ideeën

- Meer in het Pakjeshuis (de pakjes inpakken, de pepernotenbakkerij).
- Volg de checklist "Adding a chapter" in de blueprint: scene, css, js met `startChN`/`winN`, `ROOMS`, `NARRATOR`, `START`, `CH_END`, `STAY`, `CH_NAMES`, de knop op het titelscherm, hints, `sw.js`, tests.

## Werkwijze

**Nooit direct naar `main` pushen.** Elke wijziging gaat via een pull request vanaf een branch van de nieuwste `origin/main`.

```bash
npm install
npx playwright install chromium   # alleen de eerste keer
npm test
npm start                          # http://127.0.0.1:4173
```

Licentie: GPL-3.0.
