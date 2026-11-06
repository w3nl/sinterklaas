const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Hoofdstuk 2: schoen zetten bij de houtkachel', async ({ page }) => {
  await seed(page, null, ['-ch2']);
  await page.locator('#btn-ch2').click();
  await expect(page.locator('#d-who')).toHaveText('Thuis · 14 november');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · Schoen zetten');

  // je schoenmaat: voet 20 cm × 1,5 = 30
  await hs(page, 'voet');
  await expect(page.locator('.voetpap')).toContainText('20 centimeter');
  await closeModal(page);
  await hs(page, 'rek');
  await page.locator('.rk-shoe[data-m="38"]').click();
  await expect(page.locator('#rk-fb')).toContainText('Mama');
  await page.locator('.rk-shoe[data-m="30"]').click();
  await expect(page.locator('#rk-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // de plek: chocolade smelt bij ongeveer 34 °C
  await hs(page, 'letters'); await skip(page);
  await useSlot(page, 'Je schoen');
  await hs(page, 'kachel');
  await page.locator('.pk-spot[data-k="half"]').click();
  await expect(page.locator('#pk-fb')).toContainText('38 °C');
  await page.locator('.pk-spot[data-k="ver"]').click();
  await expect(page.locator('#pk-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#wk-shoe')).toBeVisible();

  // een wortel voor Ozosnel
  await hs(page, 'keuken'); await skip(page);
  await useSlot(page, 'Wortel');
  await hs(page, 'schoen'); await skip(page);
  await expect(page.locator('#wk-carrot')).toBeVisible();

  // de tekening: de rechterkant is het spiegelbeeld van de linkerkant
  await hs(page, 'tekentafel');
  await page.locator('#tk-done').click();
  await expect(page.locator('#tk-fb')).toContainText('vakjes kloppen niet');
  const half = ['...R', '..RR', '..RY', '.RYY', '.RRY', '.RRY', 'RRRR', 'YYYY'];
  for (const pen of ['R', 'Y']) {
    await page.locator(`.tk-pen[data-p="${pen}"]`).click();
    for (let r = 0; r < half.length; r++) {
      const right = [...half[r]].reverse();
      for (let c = 0; c < 4; c++) if (right[c] === pen) await page.locator(`.tk-c.mine[data-r="${r}"][data-c="${c + 4}"]`).click();
    }
  }
  await page.locator('#tk-done').click();
  await expect(page.locator('#tk-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await useSlot(page, 'Je tekening');
  await hs(page, 'schoen'); await skip(page);

  // het liedje: noten lezen (het begin van "Sinterklaas kapoentje", uit js/liedjes.js)
  await hs(page, 'xylo');
  await expect(page.locator('.xylo')).toContainText('kapoentje');
  const song = await page.evaluate(() => SONG2);
  expect(song.length).toBeGreaterThan(6);
  await page.locator(`.xy-bar[data-n="${song[0] === 'B' ? 'C' : 'B'}"]`).click();
  await expect(page.locator('#xy-fb')).toContainText('vals');
  for (const n of song) await page.locator(`.xy-bar[data-n="${n}"]`).click();
  await expect(page.locator('#xy-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // hoeveel nachtjes nog?
  await hs(page, 'kal');
  await page.locator('#kl-n').fill('16');
  await page.locator('#kl-go').click();
  await expect(page.locator('#kl-fb')).toContainText('December');
  await page.locator('#kl-n').fill('21');
  await page.locator('#kl-go').click();
  await expect(page.locator('#kl-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  for (let i = 0; i < 3; i++) { await hs(page, 'kat'); await skip(page); }
  await hs(page, 'deur');
  await expectWin(page, 'Schoen gezet · hoofdstuk 2 klaar');
  await expect(page.locator('#w-ach .got', { hasText: 'Poes laten spinnen' })).toBeVisible();
});
