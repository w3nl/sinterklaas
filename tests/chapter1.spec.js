const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Hoofdstuk 1: de stoomboot naar Grave', async ({ page }) => {
  await seed(page);
  await page.locator('#btn-new').click();
  await expect(page.locator('#d-who')).toHaveText('Op de stoomboot');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 1 · De stoomboot komt');

  // de speculaaspop: een gratis duwtje
  await hs(page, 'koek');
  await skip(page);
  await useSlot(page, 'Speculaaspop');
  await hs(page, 'sint');
  await page.locator('#dialog').click();
  await expect(page.locator('#d-txt')).toContainText('De speculaaspop fluistert');
  await expect(page.locator('#d-txt')).toContainText('MIN en MAX');
  await skip(page);
  await expect(page.locator('#hint-count')).toHaveText('0');

  // de stoomketel: water tussen MIN en MAX, koken bij 100 °C
  await hs(page, 'ketel');
  await page.locator('#ket-kolen').click();
  await expect(page.locator('#ket-fb')).toContainText('Eerst water');
  for (let i = 0; i < 5; i++) await page.locator('#ket-pomp').click();
  await page.locator('#ket-kraan').click();
  await expect(page.locator('#ket-fb')).toContainText('te vol');
  await page.locator('#ket-tap').click();
  await page.locator('#ket-kolen').click();
  await page.locator('#ket-kraan').click();
  await expect(page.locator('#ket-fb')).toContainText('40 °C');
  for (let i = 0; i < 3; i++) await page.locator('#ket-kolen').click();
  await expect(page.locator('#ket-t')).toHaveText('100 °C');
  await page.locator('#ket-kolen').click();
  await expect(page.locator('#ket-fb')).toContainText('blijft op 100 °C');
  await page.locator('#ket-kraan').click();
  await expect(page.locator('#ket-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sb-smoke')).toBeVisible();

  // de hoedendoos: CCLXX = 270, 2026 − 270 = 1756
  await hs(page, 'oorkonde');
  await expect(page.locator('.ok-year')).toHaveText('CCLXX');
  await closeModal(page);
  await hs(page, 'doos');
  const turn = async (w, n) => { for (let i = 0; i < n; i++) await page.locator(`.wheel .up[data-w="${w}"]`).click(); };
  await turn(1, 2); await turn(2, 7);
  await page.locator('#box-try').click();
  await expect(page.locator('#box-fb')).toContainText('geboren');
  await turn(0, 1); await turn(1, 5); await turn(2, 8); await turn(3, 6);
  expect(await page.locator('.wheel b').allTextContents()).toEqual(['1', '7', '5', '6']);
  await page.locator('#box-try').click();
  await expect(page.locator('#box-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await useSlot(page, 'De mijter');
  await hs(page, 'sint');
  await skip(page);
  await expect(page.locator('#sb-mitre')).toBeVisible();

  // het ruim: drijven of zinken, en het Grote Boek op alfabet
  await hs(page, 'boek'); await skip(page);
  await hs(page, 'luik');
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 1 · In het ruim');
  await page.waitForTimeout(600); await skip(page);
  await hs(page, 'water');
  const drijf = { paard: 'down', auto: 'down', eend: 'up', knikker: 'down', bal: 'up', munt: 'down' };
  for (const [k, v] of Object.entries(drijf)) await page.locator(`.dr-row[data-k="${k}"] .dr-opt[data-v="${v}"]`).click();
  await page.locator('#dr-go').click();
  await expect(page.locator('#dr-fb')).toContainText('hobbelpaard');
  await page.locator('.dr-row[data-k="paard"] .dr-opt[data-v="up"]').click();
  await page.locator('#dr-go').click();
  await expect(page.locator('#dr-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#rm-net')).toBeVisible();
  await hs(page, 'bladen');
  await page.locator('.bl-page[data-n="Daan"]').click();
  await expect(page.locator('#bl-fb')).toContainText('eerder in het alfabet');
  for (const n of ['Anne-Lieve', 'Daan', 'Floris', 'Hidde', 'Rosa']) await page.locator(`.bl-page[data-n="${n}"]`).click();
  await page.locator('.bl-page[data-n="Silvie"]').click();
  await expect(page.locator('#bl-fb')).toContainText('letter die verschilt');
  for (const n of ['Sem', 'Silvie', 'Twan']) await page.locator(`.bl-page[data-n="${n}"]`).click();
  await expect(page.locator('#bl-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 1 · De stoomboot komt');
  await page.waitForTimeout(600); await skip(page);

  // de sluis: deur open, erin, deur dicht, water erin, deur open, eruit
  await hs(page, 'sluis');
  await page.locator('#sl-up').click();
  await expect(page.locator('#sl-fb')).toContainText('muurvast');
  await page.locator('#sl-low').click();
  await page.locator('#sl-go').click();
  await page.locator('#sl-fill').click();
  await expect(page.locator('#sl-fb')).toContainText('deuren achter de boot dicht');
  await page.locator('#sl-low').click();
  await page.locator('#sl-fill').click();
  await expect(page.locator('#sl-fb')).toContainText('badeendje');
  await page.locator('#sl-up').click();
  await page.locator('#sl-go').click();
  await expect(page.locator('#sl-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sb-bg-quay')).toBeVisible();

  // de loopplank kan pas als Ozosnel rustig is
  await hs(page, 'planken');
  await page.locator('.pl-btns .btn[data-m="8"]').click();
  await page.locator('#pl-lay').click();
  await expect(page.locator('#pl-fb')).toContainText('rustig');
  await closeModal(page);

  // de voerkist: geen chocolade voor paarden
  await hs(page, 'voer');
  await page.locator('.vr-it[data-k="choco"]').click();
  await expect(page.locator('#vr-fb')).toContainText('giftig');
  await expect(page.locator('#vr-take')).toBeDisabled();
  for (const k of ['wortel', 'hooi', 'appel']) await page.locator(`.vr-it[data-k="${k}"]`).click();
  await page.locator('#vr-take').click();
  await skip(page);
  await useSlot(page, 'Voeremmer');
  await hs(page, 'paard');
  await skip(page);

  // de loopplank: 2 m hoog, 4 m plank per meter omhoog
  await hs(page, 'planken');
  await page.locator('.pl-btns .btn[data-m="6"]').click();
  await page.locator('#pl-lay').click();
  await expect(page.locator('#pl-fb')).toContainText('Te steil');
  await page.locator('.pl-btns .btn[data-m="8"]').click();
  await page.locator('#pl-lay').click();
  await expect(page.locator('#pl-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sb-gangway')).toBeVisible();

  // extraatjes
  for (let i = 0; i < 3; i++) { await hs(page, 'fluit'); await skip(page); }
  await hs(page, 'boek'); await skip(page);

  await hs(page, 'sint');
  await expectWin(page, 'Aan wal in Grave · hoofdstuk 1 klaar');
  await expect(page.locator('#w-rank')).toHaveText('Hoofdpiet');
  for (const a of ['Raad gevraagd aan de speculaaspop', 'Drie keer getoeterd', 'Stiekem in het Grote Boek gekeken'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
  await page.locator('#btn-next').click();
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 2 · Schoen zetten');
});
