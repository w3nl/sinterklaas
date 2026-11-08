const { test, expect } = require('@playwright/test');
const { seed, hs, skip, closeModal, waitModalClosed, expectWin } = require('./helpers');

const cmd = (page, k) => page.locator(`.rb-cmd[data-k="${k}"]`).click();

test('Hoofdstuk 4: het Grote Boek is zoek', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-ch4').click();
  // het Pepernotennieuws met spoednieuws
  await expect(page.locator('.tv4')).toContainText('Het Grote Boek is zoek!');
  await closeModal(page);
  await expect(page.locator('#d-who')).toHaveText('Het Pakjeshuis · 5 december');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 4 · De werkkamer van Sint');

  // het magazijn zit op slot tot je het logboek hebt bekeken
  await hs(page, 'naarmag'); await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 4 · De werkkamer van Sint');

  // het logboek: wie was er tussen 10 uur en half 11?
  await hs(page, 'logboek');
  await page.locator('.lb-pick[data-i="1"]').click();
  await expect(page.locator('#lb-fb')).toContainText('vijf voor tien');
  await page.locator('.lb-pick[data-i="2"]').click();
  await expect(page.locator('#lb-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#wr-doorlock')).toBeHidden();

  // het magazijn: de werkbon (maten omrekenen)
  await hs(page, 'naarmag');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 4 · Het pakjesmagazijn');
  await page.waitForTimeout(600); await skip(page);
  await hs(page, 'inpakpiet'); await skip(page);
  await hs(page, 'werkbon');
  await page.locator('.mt-row[data-k="A"]').click();
  await expect(page.locator('#mt-fb')).toContainText('luciferdoosje');
  await page.locator('.mt-row[data-k="B"]').click();
  await expect(page.locator('#mt-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // de grijparm: eerst tegen de kist, dan het goede programma
  await hs(page, 'paneel');
  for (const k of ['up', 'up', 'left', 'left']) await cmd(page, k);
  await page.locator('#rb-go').click();
  await expect(page.locator('#rb-fb')).toContainText('zware kist', { timeout: 5000 });
  await page.locator('#rb-clear').click();
  for (const k of ['up', 'left', 'left', 'left', 'left', 'up', 'up', 'pak', 'down', 'down', 'right', 'right', 'right', 'right', 'down', 'los']) await cmd(page, k);
  await page.locator('#rb-go').click();
  await expect(page.locator('#rb-fb')).toHaveClass(/good/, { timeout: 10_000 });
  await waitModalClosed(page);
  await expect(page.locator('#mg-pkB')).toBeHidden();

  // terug naar de werkkamer: het pakje openmaken
  await hs(page, 'naarwerk');
  await page.waitForTimeout(600); await skip(page);
  await expect(page.locator('#wr-parcel')).toBeVisible();
  await hs(page, 'pakje4'); await skip(page);
  await expect(page.locator('#wr-book')).toBeVisible();

  // de route: 24 km met 12 km per uur, om 18:00 in Grave
  await hs(page, 'kaart');
  await page.locator('.rt-opt[data-o="12 uur"]').click();
  await expect(page.locator('#rt-fb')).toContainText('Hoeveel keer');
  await page.locator('.rt-opt[data-o="2 uur"]').click();
  await expect(page.locator('.rt-q')).toContainText('Hoe laat moet hij vertrekken', { timeout: 5000 });
  await page.locator('.rt-opt[data-o="17:00"]').click();
  await expect(page.locator('#rt-fb')).toContainText('te laat');
  await page.locator('.rt-opt[data-o="16:00"]').click();
  await expect(page.locator('#rt-fb')).toHaveClass(/good/);

  // goed nieuws op de tv, en dan het eindscherm
  await expect(page.locator('.tv4.good')).toBeVisible({ timeout: 10_000 });
  await closeModal(page);
  await expectWin(page, 'Het Grote Boek is terug · hoofdstuk 4 klaar');
  await expect(page.locator('#btn-next')).toHaveText('Door naar hoofdstuk 5');
  await page.locator('#btn-next').click();
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 5 · Pakjesavond');
});

test('Hoofdstuk 4: de grijparm onthoudt zijn programma en de grapjes werken', async ({ page }) => {
  await seed(page, { ch: 4, scene: 'magazijn', f: { introDone4: true, logboek: true, maat4: true }, rb: ['up', 'left'] }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'paneel');
  await expect(page.locator('#rb-prog .rb-step')).toHaveCount(2);
  await closeModal(page);
  for (let i = 0; i < 24; i++) { await hs(page, 'noppen'); await skip(page); }
  await expect(page.locator('#sc-magazijn .mg-bub.popped')).toHaveCount(24);
  expect(await page.evaluate(() => S.ach.noppen)).toBe(true);
});

test('Oude spellen: pakjesavond als hoofdstuk 4 wordt hoofdstuk 5', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('sint-v1-norotate', '1');
    ['-ch2', '-ch3', '-ch4'].forEach(k => localStorage.setItem('sint-v1' + k, '1'));
    localStorage.setItem('sint-v1', JSON.stringify({ v: 1, ch: 4, scene: 'feest', inv: [], hl: {}, hints: 0, t: 0, ach: {}, started: true, f: { introDone4: true, zak: true } }));
  });
  await page.reload();
  await expect(page.locator('#btn-ch5')).toBeVisible();
  await expect(page.locator('#btn-ch4')).toBeVisible();
  expect(await page.evaluate(() => [S.ch, S.f.introDone5, localStorage.getItem('sint-v1-ord')])).toEqual([5, true, '5']);
});
