const { test, expect } = require('@playwright/test');
const { KEY, seed, hs, skip } = require('./helpers');

test('je voortgang wordt bewaard en blijft na herladen', async ({ page }) => {
  await seed(page);
  await page.locator('#btn-new').click();
  await skip(page);
  await hs(page, 'koek');
  await skip(page);
  await page.reload();
  await expect(page.locator('#btn-cont')).toBeVisible();
  await page.locator('#btn-cont').click();
  await expect(page.locator('.slot[title="Speculaaspop"]')).toBeVisible();
  await expect(page.locator('#d-who')).toHaveText('Op de stoomboot');
  await expect(page.locator('#d-txt')).toContainText('Terug op de stoomboot', { timeout: 5_000 });
});

test('slotjes, de ketel en wat je typt blijven zoals je ze achterliet', async ({ page }) => {
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'ketel');
  await page.locator('#ket-pomp').click();
  await page.locator('#m-close').click();
  await hs(page, 'doos');
  await page.locator('.wheel .up[data-w="0"]').click();
  await page.reload();
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'doos');
  await expect(page.locator('#bd0')).toHaveText('1');
  await page.locator('#m-close').click();
  expect(await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).ktl.w, KEY)).toBe(1);
  // Hoofdstuk 3: een half getypt wachtwoord
  await seed(page, { ch: 3, scene: 'dak', f: { introDone3: true } }, ['-ch2', '-ch3']);
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'zak');
  await page.locator('#cd-in').fill('PEPER');
  await page.locator('#m-close').click();
  await hs(page, 'zak');
  await expect(page.locator('#cd-in')).toHaveValue('PEPER');
});

test('hints geven eerst een duwtje en dan het antwoord, en worden geteld', async ({ page }) => {
  await seed(page);
  await page.locator('#btn-new').click();
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('Hint: ', { timeout: 5_000 });
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('Grote hint: Pomp water', { timeout: 5_000 });
  await expect(page.locator('#hint-count')).toHaveText('2');
});

test('scores bewaren het beste resultaat, en prestaties gaan mee naar een nieuw spel', async ({ page }) => {
  await seed(page, { f: { out1: true }, t: 300, hints: 3, ach: { koek: true } });
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { recordScore(1, 300, 3); recordScore(1, 400, 1); });
  await page.locator('#btn-scores').click();
  await expect(page.locator('.scores tbody tr').first()).toContainText('05:00');
  await expect(page.locator('.scores tbody tr').first()).toContainText('Klimpiet');
  await page.locator('#m-close').click();
  await page.locator('#btn-new').click();
  const ach = await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).ach, KEY);
  expect(ach.koek).toBe(true);
});

test('een uitgespeeld hoofdstuk zet het volgende open op het titelscherm', async ({ page }) => {
  await seed(page);
  await expect(page.locator('#chapters')).toBeHidden();
  await seed(page, null, ['-ch2', '-ch3']);
  await expect(page.locator('#btn-ch3')).toBeVisible();
  await expect(page.locator('#btn-ch4')).toBeHidden();
});

test('na hoofdstuk 1 wijst een bordje op de kade de weg naar hoofdstuk 2', async ({ page }) => {
  await seed(page, { f: { introDone: true, engine: true, lock: true, mijter: true, box: true, voer: true, plank: true, out1: true } }, ['-ch2']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { $('#title').hidden = true; applyVisuals(); });
  await expect(page.locator('#sb-exit')).toBeVisible();
  await expect(page.locator('#hit-exit1')).toHaveAttribute('data-label', 'Naar huis: door naar hoofdstuk 2');
  await page.locator('#hit-exit1').click();
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · Schoen zetten');
});

test('de oude liedjes: elke melodie is goed te lezen en speelt', async ({ page }) => {
  await seed(page);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  const songs = await page.evaluate(() => Object.fromEntries(Object.entries(SONGS).map(([id, s]) => [id, parseSong(s.noten).map(n => [n.note, noteHz(n.note), n.beats])])));
  for (const id of Object.keys(songs)) {
    expect(songs[id].length, id).toBeGreaterThan(10);
    for (const [note, hz, beats] of songs[id]) {
      expect(note === 'R' || hz > 100, `${id}: ${note}`).toBe(true);
      expect(beats, `${id}: ${note}`).toBeGreaterThan(0);
    }
  }
  // de xylofoon kan het begin van "Sinterklaas kapoentje" spelen
  const xylo = await page.evaluate(() => SONG2.every(n => n in NOTE_Y));
  expect(xylo).toBe(true);
  expect(await page.evaluate(() => playSong('stoomboot'))).toBeGreaterThan(5);
});

test('grapjes: ballonnen knallen, de eendjes duiken en de meeuw vliegt weg', async ({ page }) => {
  await seed(page, { f: { introDone: true, engine: true, lock: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  const click = sel => page.evaluate(sel => document.querySelector(sel).dispatchEvent(new MouseEvent('click', { bubbles: true })), sel);
  await click('#sc-boot [data-hs="eendjes"]');
  await expect(page.locator('#sc-boot .sb-duckdive.dive')).toHaveCount(1);
  await expect(page.locator('#sc-boot .gag-txt', { hasText: 'KWAK!' })).toBeAttached();
  await click('#sc-boot [data-hs="meeuw"]');
  await expect(page.locator('#sc-boot .sb-gullbody.scared')).toHaveCount(1);
  for (let b = 0; b < 4; b++) await click(`#sc-boot [data-hs="ballon"][data-b="${b}"]`);
  await expect(page.locator('#sc-boot .sb-balloon.pop')).toHaveCount(4);
  await expect(page.locator('#d-txt')).toContainText('Mijn ballon', { timeout: 5_000 });
  expect(await page.evaluate(() => S.ach.pang)).toBe(true);
});

test('de verstopte Saab op de dijk bij de sluis', async ({ page }) => {
  await seed(page, { f: { introDone: true, engine: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.evaluate(() => document.querySelector('#sc-boot [data-hs="saab1"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await expect(page.locator('#sc-boot .gag-txt', { hasText: 'BROEM BROEM!' })).toBeAttached();
  await expect(page.locator('#d-txt')).toContainText('Saab 900', { timeout: 5_000 });
  expect(await page.evaluate(() => S.ach.saab)).toBe(true);
});

test('pakjesavond: de lamp, het spandoek en even de keuken in', async ({ page }) => {
  await seed(page, { ch: 5, scene: 'feest', f: { introDone5: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'lamp2');
  await expect(page.locator('#sc-feest .wk-lamp')).toHaveClass(/swing/);
  await hs(page, 'spandoek');
  await expect(page.locator('#sc-feest .pa-banner')).toHaveClass(/droop/);
  await skip(page);
  await hs(page, 'keuken');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 5 · In de keuken');
  await skip(page);
  await hs(page, 'koelkast');
  await expect(page.locator('#d-txt')).toContainText('slagroomtaart');
  await skip(page);
  expect(await page.evaluate(() => S.inv.includes('wortel'))).toBe(false);
  await hs(page, 'terugkamer');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 5 · Pakjesavond');
});
