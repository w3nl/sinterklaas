const { test, expect } = require('@playwright/test');
const { seed, skip } = require('./helpers');

const noSideScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const panelFits = page => page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);

test('rechtop: melding om te draaien, een kamer om door te vegen, klikvlakken om op te tikken', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#rotate')).toBeVisible();
  await expect(page.locator('#rot-line')).not.toBeEmpty();
  expect(await noSideScroll(page)).toBe(true);
  await page.locator('#btn-new').tap();
  await skip(page);
  await expect(page.locator('.swipe')).toBeVisible();
  await page.locator('#pan').evaluate(e => e.scrollLeft = 200);
  const box = await page.locator('#sc-boot [data-hs="sint"]').boundingBox();
  expect(box.width).toBeGreaterThan(20);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#d-txt')).toContainText('Ach, beste Hulppiet', { timeout: 5_000 });
  await expect(page.locator('#d-more')).toContainText('tik');
  await page.locator('#rot-x').tap();
  await expect(page.locator('#rotate')).toBeHidden();
});

test('in de breedte: de hele kamer en het titelscherm passen', async ({ page }) => {
  await page.setViewportSize({ width: 915, height: 412 });
  await seed(page, { f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  const fits = await page.locator('#title').evaluate(e => e.scrollHeight <= e.clientHeight + 1);
  expect(fits).toBe(true);
  await expect(page.locator('#rotate')).toBeHidden();
  expect(await noSideScroll(page)).toBe(true);
});

/* Elke close-up, rechtop en in de breedte: niets mag breder zijn dan het scherm. */
const CLOSEUPS = [
  [{ ch: 1, scene: 'boot', f: { introDone: true } }, [], ['openKetel()', 'openSluis()', 'openHatbox()', 'openOorkonde()', 'openRomeins()', 'openVoer()', 'S.f.lock = true; openPlank()', 'openScores()']],
  [{ ch: 2, scene: 'kamer', f: { introDone2: true, plek: true, wortelIn: true, tekeningIn: true } }, ['-ch2'], ['openVoet()', 'openRek()', 'openPlek()', 'openTeken()', 'openXylo()', 'openKal()']],
  [{ ch: 3, scene: 'dak', f: { introDone3: true } }, ['-ch2', '-ch3'], ['openCode()', 'openAdres()', 'openPast()', 'openTouw()', 'openWind()']],
  [{ ch: 4, scene: 'werk', f: { introDone4: true } }, ['-ch2', '-ch3', '-ch4'], ["openNieuws('spoed')", 'openLogboek()', 'openMaten()', 'openRobot()', 'openRoute()']],
  [{ ch: 5, scene: 'feest', f: { introDone5: true, gedicht: true } }, ['-ch2', '-ch3', '-ch4', '-ch5'], ['openZak()', 'openNamen()', 'openGedicht()', 'openNet()', 'openSpeur()']]
];
for (const [w, h] of [[412, 915], [915, 412]]) {
  test(`elke close-up past op een telefoon zonder zijwaarts scrollen (${w}×${h})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const [state, unlocked, opens] of CLOSEUPS) {
      await seed(page, state, unlocked);
      await page.locator('#btn-cont').tap();
      await skip(page);
      for (const open of opens) {
        await page.evaluate(open);
        await page.waitForTimeout(120);
        expect(await panelFits(page), `${open} is breder dan het scherm`).toBe(true);
        await page.locator('#m-close').tap();
        expect(await noSideScroll(page), `${open} laat de pagina zijwaarts scrollen`).toBe(true);
      }
    }
  });
}
