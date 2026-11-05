const { test, expect } = require('@playwright/test');
const { seed, hs, skip, waitModalClosed, expectWin } = require('./helpers');

test('Hoofdstuk 4: pakjesavond', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-ch4').click();
  await expect(page.locator('#d-who')).toHaveText('Pakjesavond · 5 december');
  await skip(page);

  // de zware zak: wielen geven minder wrijving
  await hs(page, 'voordeur');
  await skip(page);
  await page.locator('.zk-btns .btn[data-k="sleep"]').click();
  await expect(page.locator('#zk-fb')).toContainText('wrijving');
  await page.locator('.zk-btns .btn[data-k="skate"]').click();
  await expect(page.locator('#zk-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#pa-sack')).toBeVisible();

  // van wie is welk pakje? logisch redeneren
  await hs(page, 'pakjes');
  for (const k of ['rond', 'plat', 'lang', 'zacht']) await page.locator(`select[data-k="${k}"]`).selectOption('Papa');
  await page.locator('#nm-go').click();
  await expect(page.locator('#nm-fb')).toContainText('twee pakjes');
  const right = { rond: 'Sem', plat: 'Oma', lang: 'Papa', zacht: 'Mama' };
  for (const k in right) await page.locator(`select[data-k="${k}"]`).selectOption(right[k]);
  await page.locator('#nm-go').click();
  await expect(page.locator('#nm-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // het gedicht: rijmen
  await hs(page, 'oma');
  await page.locator('.gd-opt[data-w="doel"]').click();
  await page.locator('.gd-opt[data-w="bedankt"]').click();
  await page.locator('#gd-go').click();
  await expect(page.locator('#gd-fb')).toContainText('rijmen niet');
  await page.locator('.gd-opt[data-w="dank"]').click();
  await page.locator('#gd-go').click();
  await expect(page.locator('#gd-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // de surprise: welke bouwplaten worden een kubus?
  await hs(page, 'zak4');
  await page.locator('.nt-card[data-k="A"]').click();
  await page.locator('.nt-card[data-k="B"]').click();
  await page.locator('#nt-go').click();
  await expect(page.locator('#nt-fb')).toContainText('rechthoek');
  await page.locator('.nt-card[data-k="B"]').click();
  await page.locator('.nt-card[data-k="C"]').click();
  await page.locator('#nt-go').click();
  await expect(page.locator('#nt-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // de speurtocht: B1, 4 naar rechts, 3 omhoog
  await hs(page, 'zak4');
  await page.locator('.sp-c[data-c="E4"]').click();
  await expect(page.locator('#sp-fb')).toContainText('pepernoot');
  await page.locator('.sp-c[data-c="F4"]').click();
  await expect(page.locator('#sp-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  for (let i = 0; i < 5; i++) { await hs(page, 'pepernoten'); await skip(page); }
  await hs(page, 'groot');
  await expectWin(page, 'Pakjesavond · alle hoofdstukken klaar');
  await expect(page.locator('#btn-next')).toBeHidden();
  await expect(page.locator('#pa-wave')).toBeAttached();
});
