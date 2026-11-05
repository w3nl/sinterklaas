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
