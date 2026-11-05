# AGENTS.md: werken aan Sinterklaas: Het Grote Pakjesavontuur

Aantekeningen voor AI-agents en nieuwe helpers. De README vertelt wat het spel is; dit bestand vertelt wat je niet meteen uit de code haalt. Het algemene recept (gedeeld met *Hello, IT* en *Villa Kakelbont*) staat in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md).

> **Spoilers:** hieronder staan de oplossingen van alle puzzels. Die heb je nodig om te testen.

## Wat dit is

Een point-and-click escaperoom over het Sinterklaasfeest, voor kinderen van ongeveer 8 tot 12 en hun families. Elke puzzel leert één echt idee, verpakt in een grapje.

- 4 hoofdstukken: de stoomboot (5 puzzels), thuis bij de houtkachel (6), op het dak (5), pakjesavond (5). Gewone HTML, CSS, JavaScript en SVG: **geen build, geen framework, geen runtime-afhankelijkheden** (alleen Google Fonts).
- **Alleen Nederlands.** Alle tekst staat direct in de code. Er is geen vertaalsysteem; `tx(tekst, { naam })` in `core.js` vult alleen `{naam}`-plekken in.
- Statische site (GitHub Pages), installeerbaar als PWA, offline speelbaar. **Moet via http(s)** draaien (`npm start`).
- `package.json` en `node_modules/` zijn er alleen voor de tests en de lokale server.

## Kaart van de repository

| Pad | Wat |
|---|---|
| `index.html` | De pagina: kop, speelveld, titel- en eindscherm, zakken, close-up |
| `css/*.css` | In deze volgorde: `base` (tokens op `:root`), `chapter1` … `chapter4`, `phone`, `animations` (als laatste: de noodstop voor beweging) |
| `scenes/boot.svg`, `kamer.svg`, `dak.svg`, `feest.svg` | De kamers, met ids met voorvoegsel `sb-`, `wk-`, `dk-`, `pa-`; klikvlakken staan als laatste |
| `js/boot.js` | Haalt de kamers op en laadt de scripts op volgorde; `GAME_VERSION` |
| `js/core.js` | Motor: `S`, `save`/`load`, geluid, `say()`, `WHO`/`FACES`/`NARRATOR`, `ITEMS`, zakken, `vis()`, `ROOMS` + `applyVisuals()`, `go()`, `moment()`, klikvlakken, `setLabel()`, `openModal()`, `fb()`, `solved()`, `nope()` |
| `js/chapter1.js` | `buildBoot()`, `applyBoot()`, `TODO1`, `KOEK_SAY`, **`H` (de tabel met klikvlakken)**, close-ups `openKetel`, `openSluis`, `openHatbox`, `openOorkonde`, `openRomeins`, `openVoer`, `openPlank`; `intro1()`, `win1()` |
| `js/chapter2.js` | `unlocked(n)`/`setUnlocked(n)`, `applyKamer()`, `TODO2`, close-ups `openVoet`, `openRek`, `openPlek`, `openTeken`, `openXylo`, `openKal`; `intro2()`, `startCh2()`, `win2()` |
| `js/chapter3.js` | `buildDak()`, `applyDak()`, close-ups `openCode`, `openAdres`, `openPast`, `openTouw`, `openWind`; `intro3()`, `startCh3()`, `win3()` |
| `js/chapter4.js` | `buildFeest()`, `applyFeest()`, `TODO4`, close-ups `openZak`, `openNamen`, `openGedicht`, `openNet`, `openSpeur`; `intro4()`, `startCh4()`, `win4()` |
| `js/items.js` | `useItem(ding, klikvlak)` |
| `js/hints.js` | `HINTS` en `stage1()` … `stage4()`, `stage_()` |
| `js/ambience.js` | Gegenereerd achtergrondgeluid per kamer (`ambKey()`, `SOUNDSCAPES`) |
| `js/voice.js` | Stemmen (Web Speech API, `nl-NL`); `VOICE_STYLE` per spreker |
| `js/app.js` | `LAST_CH`, `START`, `chapterDone`, `exitLabels`, `refreshMenu`, `CH_END`, `showWin`, scores, `ACH`, knoppen, klok, titelmenu, PWA, `start()` |
| `portraits/*.svg` | `you`, `sint`, `hoofd`, `piet`, `paard`, `koek`, `mama`, `burg` (120×120) |
| `sw.js`, `manifest.webmanifest`, `icons/` | De app. `icon.svg` is de bron; de PNG's zijn ervan gemaakt |
| `tests/` | Playwright: `chapter1` … `chapter4`, `progress`, `pwa`, `phone`, `motion`; `helpers.js`; `serve.js` |

## Hoe het in elkaar zit

- **Gewone scripts in één gedeelde ruimte**, geladen door `boot.js`. Elke naam moet uniek zijn over alle bestanden heen.
- **Klikvlak-ids** delen één naamruimte. Hoofdstuk 1: `ketel fluit sint zakken doos koek boek oorkonde kalender cijfers planken hoofd paard voer vlag rad oever sluis kade burg kerk loopplank`. Hoofdstuk 2: `deur rek kal mama thermo kachel pijp letters koek raam tekentafel voet keuken xylo kat schoen hout`. Hoofdstuk 3: `windhaan kerk3 sint3 maan huizen bord schoorsteen touw koek piet zak ladder`. Hoofdstuk 4: `voordeur papa oma mama sem kachel4 raam4 pepernoten choco koek spandoek zak4 pakjes groot`. `koek` (de speculaaspop) en `mama` bestaan in meer kamers; de handler kijkt naar `S.ch`.
- **Kamers:** `ROOMS` in `core.js` koppelt `S.scene` (`boot`, `kamer`, `dak`, `feest`) aan het hoofdstuk, de titel en de `applyX()`-functie. Een hoofdstuk afmaken zet `outN`; de uitgang (loopplank, trap, ladder) leidt dan naar het volgende hoofdstuk. Vrijgespeelde hoofdstukken: `sint-v1-ch2` … `-ch4`.
- **SVG-ids zijn globaal**: gebruik het voorvoegsel van de kamer. Let op: een kleurverloop (`url(#…)`) op een kaarsrechte horizontale of verticale lijn tekent niets; geef zo'n lijn een gewone kleur.

### Toestand en opslaan
- `S` is het hele spel: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, opgeslagen in `localStorage['sint-v1']` na elke actie.
- Close-ups blijven zoals je ze achterliet: `S.ktl` (`{w, t, lit}` ketel), `S.slu` (sluis), `S.boxd` (cijferslot), `S.vr` (voeremmer), `S.plk` (plank); `S.tk`/`S.tkPen` (tekening), `S.kln` (getypt aantal nachtjes); `S.cdi` (getypt wachtwoord), `S.adr` (gevonden huizen), `S.pst` (gekozen pakjes); `S.nm` (namen), `S.gd` (gedicht), `S.nt` (bouwplaten).
- Andere sleutels: `sint-v1-ch2` … `-ch4`, `-scores`, `-sound`, `-motion`, `-voice`, `-norotate`. Elke toegang tot `localStorage` staat in `try/catch`.
- Een nieuw spel houdt de prestaties (`S.ach`).

### Gesprekken
- `say(regels, daarna?)`; sprekers: `you`, `sys` (verteller; het label boven de tekst komt uit `NARRATOR` per hoofdstuk), `sint`, `hoofd` (Hoofdpiet), `piet` (Klimpiet), `paard` (Ozosnel), `koek`, `mama`, `papa`, `oma`, `sem`, `burg`, `sluis`. Alleen wie in `FACES` staat heeft een portret.

### Dingen in je zakken
- `koek` (de speculaaspop: gebruik hem op iets voor het eerste duwtje van de huidige hint, telt niet als hint), `mijter`, `emmer`; `schoen`, `wortel`, `tekening`; `touw`, `pakjes`. Vier zakken; een hoofdstuk heeft er nooit meer nodig.

## Oplossingen (spoilers)

Hoofdstuk 1, de stoomboot:

| # | Puzzel (echt idee) | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Stoomketel (water kookt bij 100 °C en wordt stoom) | Water pompen tot 2–4 streepjes, 4 keer kolen (100 °C), stoomkraan open | `engine` |
| 2 | Sluis (stappen in de goede volgorde) | Benedendeuren open, varen, benedendeuren dicht, water erin, bovendeuren open, varen | `lock` |
| 3 | Hoedendoos (Romeinse cijfers, aftrekken) | CCLXX = 270; 2026 − 270 = **1756**; mijter op Sint | `box`, `mijter` |
| 4 | Voerkist (chocolade is giftig voor paarden) | Wortels, hooi, appel; emmer op Ozosnel | `voer` |
| 5 | Loopplank (helling: 4 m plank per meter omhoog) | Dek 2 m hoog → **8 meter**; daarna Sinterklaas aanklikken | `plank`, `out1` |

Hoofdstuk 2, schoen zetten:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Schoenmaat (≈ voetlengte × 1,5) | Voet 20 cm → **maat 30** (groene schoen) | `maat` |
| 2 | Plek (chocolade smelt bij ~34 °C) | Schoen op de kachel → **D: anderhalve meter, 21 °C** | `plek` |
| – | Wortel | Keuken → wortel, op de schoen | `wortelIn` |
| 3 | Tekening (spiegelsymmetrie) | Rechterhelft = gespiegelde linkerhelft (`MIJTER_HALF`); tekening op de schoen | `tekening`, `tekeningIn` |
| 4 | Liedje (noten lezen) | **G E G A G E D C** op de xylofoon | `liedje` |
| 5 | Kalender (dagen tellen over twee maanden) | 16 + 5 = **21** | `nachten` |
| – | Naar bed | De trap | `out2` |

Hoofdstuk 3, op het dak:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | Pietencode (letters één stap terug) | QFQFSOPPU → **PEPERNOOT** | `code` |
| 2 | Huisnummers (even en oneven) | Noor 8, Daan 11, Lotte 4 | `adres` |
| 3 | Welke pakjes passen (32 × 32 cm; de twee kleinste maten tellen) | **B, C, E** (vlieger, beer, skateboard) | `past` |
| 4 | Touw (op schaal: 1 hokje = 1 m) | Touw pakken, op de schoorsteen: **10 meter** (9 nodig) | `touw`, dan `gust` |
| 5 | Windhaan (de kop wijst naar waar de wind vandaan komt) | Wijst naar het westen → muts waait **naar het oosten** | `wind`, `out3` |

Hoofdstuk 4, pakjesavond:

| # | Puzzel | Oplossing | Vlaggen |
|---|---|---|---|
| 1 | De zak (wielen: minder wrijving) | Voordeur → **op het skateboard** | `zak` |
| 2 | Namen (logisch redeneren) | Rond Sem, lang Papa, plat Oma, zacht Mama | `namen` |
| 3 | Gedicht (rijm) | Oma: **doel** (stoel), **dank** (bank) | `gedicht` |
| 4 | Surprise (bouwplaat van een kubus) | Zak → **A en C** | `net` |
| 5 | Speurtocht (coördinaten) | Zak → B1, 4 rechts, 3 omhoog: **F4**; dan het grote pakje | `speur`, `out4` |

Prestaties (`ACH`): `koek`, `toet` (fluit 3×, als de machine draait), `boek` (Grote Boek), `zwaai` (kinderen op de kade), `paardmaan` (raam 3×), `kat` (poes 3×), `sint3` (Sint op het dak), `pepernoot` (5× pepernoten), `sem` (Sem 3×).

## Valkuilen

Alles uit "Lessons learned" in de blueprint geldt. Vooral:
- `[hidden]{display:none!important}` in `base.css` moet blijven.
- CSS-klassenamen zijn globaal; zoek eerst in `css/`.
- **Beweging:** alles wat beweegt is een **CSS-animatie** (geen SMIL), zodat de noodstop in `animations.css` alles stilzet. Dingen die alleen bestaan als ze bewegen (de ruiter voor de maan, de wegwaaiende muts) beginnen buiten beeld. `tests/motion.spec.js` controleert dat er met Beweging uit niets beweegt.
- Verschijnen en verdwijnen gaat met `vis()` (zachtjes, behalve bij de eerste tekening, met Beweging uit en voor klikvlakken).
- Controleer nieuwe close-ups op 412×915 en 915×412 (`tests/phone.spec.js`).
- **Verhoog `CACHE` in `sw.js` en `GAME_VERSION` in `js/boot.js` samen** bij elke wijziging, en zet nieuwe bestanden in `CORE` (een test controleert dat).
- Geen `alert/confirm/prompt`. Knoppen hebben `type="button"`.

## Toon en schrijven

- **Eerst humor, dan leren.** Elk fout antwoord krijgt een grapje én een duwtje.
- **Pieten** zijn roetveegpieten: een gewone huidskleur met roetvegen van de schoorsteen, kleurrijke pakken, een witte kraag en een muts met veer. Geen zwarte gezichten, geen oude stereotypen in tekst of tekeningen.
- De personages:
  - **Sinterklaas:** oud, wijs, vriendelijk, een beetje vergeetachtig; zegt "Wel, wel, wel" en "beste kind" / "beste Hulppiet". Geboren in Myra in 270.
  - **Hoofdpiet:** druk, georganiseerd, heeft altijd zijn lijstje.
  - **Klimpiet:** vrolijk, ondeugend, klimt overal op, gek op pepernoten, verliest zijn muts.
  - **Ozosnel:** het schimmelpaard van Sint; zegt "Hihihi", loopt over de daken.
  - **De speculaaspop:** de gratis hint; zegt "…" of "Psst…".
  - **De familie:** Mama, Papa (vist graag, draagt een mijter van krantenpapier), Oma (breit al haar sjaals zelf, 43 stuks), Sem (het kleine broertje).
- Neem geen teksten, liedjes of tekeningen over uit tv-programma's of boeken; schrijf en teken alles zelf. Het liedje op de xylofoon is een eigen melodie.
- Elke puzzel heeft twee hints in `HINTS`: een duwtje en het antwoord.

## Ideeën

- Een hoofdstuk in het Pietenhuis (de pakjes inpakken), of de "lootjes trekken" (niemand mag zichzelf trekken).
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
