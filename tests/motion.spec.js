// De instelling Beweging: auto (volgt het apparaat), aan, uit. Alles wat beweegt in de kamers is een CSS-animatie,
// dus de noodstop aan het eind van css/animations.css zet ze allemaal stil.
const { test, expect } = require('@playwright/test');
const { KEY, seed, skip } = require('./helpers');

const anim = (page, sel) => page.locator(sel).first().evaluate(e => getComputedStyle(e).animationName);
/* Hoeveel dingen in de kamer die je ziet nu bewegen. */
const moving = page => page.evaluate(() => [...document.querySelectorAll('.scene.on *')].filter(e => getComputedStyle(e).animationName !== 'none').length);

test('apparaten die minder beweging willen staan stil, tenzij je "Beweging aan" kiest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await expect(page.locator('#btn-motion')).toHaveText('Beweging auto');
  expect(await moving(page)).toBe(0);

  await page.locator('#btn-motion').click();
  await expect(page.locator('#btn-motion')).toHaveText('Beweging aan');
  await expect.poll(() => anim(page, '#sb-hoofd')).toBe('sbBob');
  expect(await anim(page, '#sb-ship')).toBe('sbBobShip');

  expect(await page.evaluate(KEY => localStorage.getItem(KEY + '-motion'), KEY)).toBe('on');
  await page.reload();
  await expect(page.locator('#btn-motion')).toHaveText('Beweging aan');
});

test('"Beweging uit" zet alles stil, in elke kamer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { f: { introDone: true, engine: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  // op de stoomboot: het schoepenrad draait, de rook kringelt omhoog
  expect(await anim(page, '#sb-wheel')).toBe('sbSpin');
  expect(await anim(page, '.sb-puff')).toBe('sbPuff');
  expect(await moving(page)).toBeGreaterThan(10);

  await page.locator('#btn-motion').click();   // aan
  await page.locator('#btn-motion').click();   // uit
  await expect(page.locator('#btn-motion')).toHaveText('Beweging uit');
  await expect.poll(() => moving(page)).toBe(0);

  for (const [ch, scene, f] of [[2, 'kamer', {}], [3, 'dak', { gust: true }], [4, 'feest', { zak: true, out4: true }]]) {
    await page.evaluate(([ch, scene, f]) => { S.ch = ch; S.scene = scene; S.f = f; applyVisuals(); }, [ch, scene, f]);
    expect(await moving(page), scene).toBe(0);
  }
});
