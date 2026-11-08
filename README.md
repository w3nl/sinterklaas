# Sinterklaas: Het Grote Pakjesavontuur

Een escaperoom in de browser over het Sinterklaasfeest, voor kinderen van ongeveer 8 tot 12 jaar. Gebouwd op dezelfde manier als [*Hello, IT*](https://github.com/w3nl/it) en [*Villa Kakelbont*](https://github.com/w3nl/pippi).

Je hebt de grote wedstrijd gewonnen: je mag een hele Sinterklaastijd **Hulppiet** zijn! Van de intocht op 14 november tot pakjesavond op 5 december help je Sinterklaas, Hoofdpiet, Klimpiet en het paard Ozosnel.

Elke puzzel leert je iets echts.

## Spelen

Het spel is in het Nederlands. Zet **Stemmen** aan om de gesprekken te laten voorlezen.

Speel online zodra GitHub Pages aan staat (Settings → Pages → deploy from `main`).

Thuis spelen: start een webserver in deze map. Met Node.js:

```bash
npm start
```

Open dan http://127.0.0.1:4173. Dubbelklikken op `index.html` werkt niet, want het spel haalt de tekeningen van de kamers op uit `scenes/`.

Kom je er niet uit? Klik op **Hint** (eerst een duwtje, dan het antwoord), of pak de speculaaspop en laat hem iets zien: hij geeft je gratis een duwtje.

## Hoofdstukken

1. **De stoomboot komt** (14 november, op de Maas, op weg naar Grave): de stoommachine is stilgevallen. Water koken tot stoom (100 °C), een sluis bedienen, Romeinse cijfers en aftrekken (hoe oud is Sinterklaas?), wat een paard wel en niet mag eten (chocolade is giftig voor paarden!), en hoe lang een loopplank moet zijn zodat hij niet te steil is.
2. **Schoen zetten** (thuis bij de houtkachel): je schoenmaat uitrekenen uit de lengte van je voet, een symmetrische tekening voor Sint, waar je je schoen neerzet zodat de chocolade niet smelt, noten lezen op de xylofoon, en tellen hoeveel nachtjes het nog is tot pakjesavond.
3. **Op het dak** (de nacht van 4 december, met Klimpiet): de Pietencode kraken, even en oneven huisnummers, welke pakjes door de schoorsteen passen, hoe lang het touw moet zijn (op schaal), en de windhaan lezen.
4. **Het Grote Boek is zoek!** (5 december, 's ochtends, in het Pakjeshuis): het Pepernotennieuws meldt dat pakjesavond misschien niet doorgaat! Klokken lezen in het logboek, maten omrekenen (mm, cm, dm en m), een grijparm programmeren, en uitrekenen hoe laat Sint moet vertrekken (afstand, snelheid en tijd).
5. **Pakjesavond** (5 december): de zware jutezak naar binnen krijgen (wielen geven minder wrijving), logisch redeneren van wie welk pakje is, rijmen voor het gedicht, welke bouwplaat een kubus wordt, en een speurtocht met coördinaten.

## Installeren als app

Het is een Progressive Web App: installeer hem met de knop **Installeren** in het spel of via het menu van je browser (op de iPhone: Delen → Zet op beginscherm). Na het eerste bezoek werkt hij ook offline. Het versienummer staat onderaan het titelscherm; als er een nieuwe versie is, verschijnt er een balk om te herladen (je voortgang blijft bewaard).

## Opgeslagen voortgang

Je voortgang wordt na elke stap in je browser bewaard. Klik op **Verder spelen** om door te gaan. Onder **Scores** zie je je snelste tijd, je minste hints, je rang en je prestaties.

## Aan het spel werken

Begin met [AGENTS.md](AGENTS.md) (hoe het in elkaar zit, de oplossingen van de puzzels, de valkuilen) en [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md) (het algemene recept, in het Engels).

## Tests

```bash
npm install
npx playwright install chromium
npm test
```

De tests spelen elk hoofdstuk helemaal uit in een echte browser, en controleren het opslaan, de scores, de app en offline spelen, telefoons, en de instelling Beweging. Node.js 26 (zie `.nvmrc`).

## Licentie

GPL-3.0 voor de code, tekeningen en teksten van dit project.
