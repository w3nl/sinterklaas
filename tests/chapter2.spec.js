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
  await expect(page.locator('#rk-fb')).toContainText('Silvie');
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

  // de keuken: een wortel, pepernoten bakken (×3), de kookwekker (7:15 + 25 min) en de brief van Anne-Lieve
  await hs(page, 'keuken');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · In de keuken');
  await page.waitForTimeout(600); await skip(page);
  await hs(page, 'koelkast'); await skip(page);
  await hs(page, 'oven'); await skip(page);
  await hs(page, 'recept');
  const fill = async v => { for (const [k, x] of Object.entries(v)) await page.locator(`#bk-${k}`).fill(String(x)); await page.locator('#bk-go').click(); };
  await fill({ meel: 140, suiker: 90, boter: 80, kruiden: 42 });
  await expect(page.locator('#bk-fb')).toContainText('opgeteld');
  await fill({ meel: 300, suiker: 150, boter: 120, kruiden: 6 });
  await expect(page.locator('#bk-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await hs(page, 'oven');
  await page.locator('#ov-go').click();
  await expect(page.locator('#ov-fb')).toContainText('rauw');
  for (let i = 0; i < 6; i++) await page.locator('#ov-plus').click();
  await page.locator('#ov-go').click();
  await expect(page.locator('#ov-fb')).toContainText('zwart als roet');
  await page.locator('#ov-min').click();
  await expect(page.locator('#ov-time')).toHaveText('7:40');
  await page.locator('#ov-go').click();
  await expect(page.locator('#ov-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#kk-pepers')).toBeVisible();
  await hs(page, 'brief');
  await page.locator('.br-w', { hasText: 'Poes' }).click();
  await expect(page.locator('#br-fb')).toContainText('goed geschreven');
  for (const w of ['Liefe', 'grag', 'stokpaart', 'bent']) await page.locator('.br-w', { hasText: new RegExp(`^${w}`) }).click();
  await expect(page.locator('#br-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await hs(page, 'terugkamer');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · Schoen zetten');
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

  // het liedje: noten lezen ("Sinterklaas kapoentje", uit js/liedjes.js); een valse noot begint alleen die regel opnieuw
  await hs(page, 'xylo');
  await expect(page.locator('.xylo')).toContainText('kapoentje');
  const song = await page.evaluate(() => SONG2);
  expect(song.length).toBe(24);
  const wrong = n => n === 'B' ? 'C' : 'B';
  await page.locator(`.xy-bar[data-n="${wrong(song[0])}"]`).click();
  await expect(page.locator('#xy-fb')).toContainText('vals');
  for (const n of song.slice(0, 12)) await page.locator(`.xy-bar[data-n="${n}"]`).click();
  await page.locator(`.xy-bar[data-n="${wrong(song[12])}"]`).click();
  await expect(page.locator('#xy-played')).toContainText('mijn schoen tje');
  for (const n of song.slice(12)) await page.locator(`.xy-bar[data-n="${n}"]`).click();
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
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · In de gang');
  await hs(page, 'kapstok'); await skip(page);
  await hs(page, 'trap4');
  await expectWin(page, 'Schoen gezet · hoofdstuk 2 klaar');
  await expect(page.locator('#w-ach .got', { hasText: 'Poes laten spinnen' })).toBeVisible();
});
