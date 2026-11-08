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

  // ook als Sint aan wal is en de confetti valt
  await page.evaluate(() => { S.f = { introDone: true, engine: true, lock: true, mijter: true, voer: true, plank: true, out1: true }; applyVisuals(); });
  expect(await moving(page)).toBe(0);
  for (const [ch, scene, f] of [[2, 'kamer', { liedje: true }], [3, 'dak', { gust: true, touw: true }], [4, 'werk', { uitgepakt: true, out4: true }], [4, 'magazijn', { maat4: true }], [5, 'feest', { zak: true, namen: true, out5: true }]]) {
    await page.evaluate(([ch, scene, f]) => { S.ch = ch; S.scene = scene; S.f = f; applyVisuals(); }, [ch, scene, f]);
    expect(await moving(page), scene).toBe(0);
  }
});

test('de kamers leven: wat er beweegt met Beweging aan', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '.sb-ducks')).toBe('sbDucks');
  expect(await anim(page, '.sb-reed')).toBe('sbReed');
  expect(await anim(page, '.sb-fish')).toBe('sbFish');
  expect(await anim(page, '#sb-mast')).toBe('sbClimber');
  // Sint gaat aan wal en Ozosnel loopt met zijn benen
  await page.evaluate(() => { Object.assign(S.f, { engine: true, lock: true, mijter: true, voer: true, plank: true }); applyVisuals(); win1(); });
  await expect(page.locator('#sc-boot')).toHaveClass(/sb-ashore/);
  expect(await anim(page, '#sb-sint')).toBe('sbAshoreSint');
  expect(await anim(page, '#sb-horsewalk .hleg')).toBe('hlegStep');
  // de woonkamer, de daken en pakjesavond
  await page.evaluate(() => { S.ch = 2; S.scene = 'kamer'; S.f = { liedje: true }; applyVisuals(); });
  expect(await anim(page, '.wk-pendulum')).toBe('wkPendulum');
  expect(await anim(page, '.wk-note')).toBe('wkNote');
  await page.evaluate(() => { S.ch = 3; S.scene = 'dak'; S.f = {}; applyVisuals(); });
  expect(await anim(page, '#dk-sint')).toBe('dkRide');
  expect(await anim(page, '#dk-sint .hleg')).toBe('hlegStep');
  expect(await anim(page, '.dk-blink')).toBe('dkBlink');
  await page.evaluate(() => { S.ch = 4; S.scene = 'werk'; S.f = { robot: true }; applyVisuals(); });
  expect(await anim(page, '.wr-ticker')).toBe('wrTicker');
  expect(await anim(page, '.wr-slide')).toBe('wrSlide');
  await page.evaluate(() => { S.scene = 'magazijn'; S.f = {}; applyVisuals(); moment('magazijn', 'mg-send', 4200); });
  expect(await anim(page, '.mg-robotmove')).toBe('mgFetch');
  expect(await anim(page, '.mg-ride')).toBe('mgRide');
  await page.evaluate(() => { S.ch = 5; S.scene = 'feest'; S.f = { introDone5: true }; applyVisuals(); H.voordeur(); });
  await expect(page.locator('#sc-feest')).toHaveClass(/pa-strooi/);
  expect(await anim(page, '.pa-throw')).toBe('paThrow');
  expect(await anim(page, '.pa-flake')).toBe('paFlake');
});
