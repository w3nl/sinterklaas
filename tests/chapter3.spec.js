const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

test('Hoofdstuk 3: op het dak met Klimpiet', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3']);
  await page.locator('#btn-ch3').click();
  await expect(page.locator('#d-who')).toHaveText('Op het dak · 4 december');
  await skip(page);

  // de Pietencode: elke letter een stap terug
  await hs(page, 'zak');
  await expect(page.locator('.cd-word')).toHaveText('QFQFSOPPU');
  await page.locator('#cd-in').fill('RGRGTPQQV');
  await page.locator('#cd-go').click();
  await expect(page.locator('#cd-fb')).toContainText('verkeerde kant');
  await page.locator('#cd-in').fill('pepernoot');
  await page.locator('#cd-go').click();
  await expect(page.locator('#cd-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // even en oneven huisnummers
  await hs(page, 'zak');
  await page.locator('.ad-h[data-n="7"]').click();
  await expect(page.locator('#ad-fb')).toContainText('verkeerde kant');
  for (const n of [8, 11, 4]) await page.locator(`.ad-h[data-n="${n}"]`).click();
  await expect(page.locator('#ad-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // welke pakjes passen door 32 × 32 cm?
  await hs(page, 'zak');
  await page.locator('.ps-gift[data-k="B"]').click();
  await page.locator('#ps-go').click();
  await expect(page.locator('#ps-fb')).toContainText('past wél');
  await page.locator('.ps-gift[data-k="C"]').click();
  await page.locator('.ps-gift[data-k="E"]').click();
  await page.locator('#ps-go').click();
  await expect(page.locator('#ps-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // het touw: 9 hokjes = 9 meter
  await hs(page, 'touw'); await skip(page);
  await useSlot(page, 'Touw');
  await hs(page, 'schoorsteen');
  await page.locator('.tw-btns .btn[data-m="8"]').click();
  await expect(page.locator('#tw-fb')).toContainText('te kort');
  await page.locator('.tw-btns .btn[data-m="12"]').click();
  await expect(page.locator('#tw-fb')).toContainText('korter');
  await page.locator('.tw-btns .btn[data-m="10"]').click();
  await expect(page.locator('#tw-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // het dak van Hidde: de wip (40 kg op plek 2 = 20 kg op plek 4) en het spiegelschrift
  await expect(page.locator('#dk-tolotte')).toBeVisible();
  await hs(page, 'naarlotte');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 3 · Op het dak van Hidde');
  await page.waitForTimeout(600); await skip(page);
  await hs(page, 'dakraam'); await skip(page);
  await hs(page, 'wip');
  await page.locator('.wp-btns .btn[data-p="4"]').click();
  await expect(page.locator('#wp-fb')).toContainText('vliegt omhoog');
  await page.locator('.wp-btns .btn[data-p="1"]').click();
  await expect(page.locator('#wp-fb')).toContainText('te dicht bij');
  await page.locator('.wp-btns .btn[data-p="2"]').click();
  await expect(page.locator('#wp-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await hs(page, 'dakraam');
  await expect(page.locator('.sp3-note')).toContainText('groene pakje met de stippen');
  await page.locator('.sp3-gift[data-k="gs"]').click();
  await expect(page.locator('#sp3-fb')).toContainText('strepen');
  await page.locator('.sp3-gift[data-k="gd"]').click();
  await expect(page.locator('#sp3-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#d2-ropein')).toBeVisible();
  await hs(page, 'terug3');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 3 · Op het dak');
  await expect(page.locator('#d-txt')).toContainText('WHOEEESH', { timeout: 5_000 });
  await skip(page);

  // de windhaan: de wind komt uit het westen
  await hs(page, 'sint3'); await skip(page);
  await hs(page, 'windhaan');
  await page.locator('.wd-btns .btn[data-d="W"]').click();
  await expect(page.locator('#wd-fb')).toContainText('vandáán');
  await page.locator('.wd-btns .btn[data-d="O"]').click();
  await expect(page.locator('#wd-fb')).toHaveClass(/good/);
  await expectWin(page, 'Middernacht · hoofdstuk 3 klaar');
  await expect(page.locator('#w-ach .got', { hasText: 'Sint op het dak gezien' })).toBeVisible();
});
