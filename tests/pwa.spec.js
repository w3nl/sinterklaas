const { test, expect } = require('@playwright/test');
const { skip } = require('./helpers');

test('het spel is een installeerbare app die offline werkt', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);

  const cdp = await context.newCDPSession(page);
  const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
  // "in-incognito" zegt iets over het testprofiel van de browser, niet over het spel
  expect(installabilityErrors.filter(e => e.errorId !== 'in-incognito')).toEqual([]);
  const { errors } = await cdp.send('Page.getAppManifest');
  expect(errors).toEqual([]);

  const cached = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).map(r => new URL(r.url).pathname); });
  expect(cached).toEqual(expect.arrayContaining(['/', '/index.html', '/manifest.webmanifest', '/icons/icon-512.png', '/js/core.js', '/js/chapter4.js', '/css/base.css', '/scenes/boot.svg', '/scenes/feest.svg', '/portraits/sint.svg']));

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#sc-boot')).toBeAttached();
  await page.locator('#btn-new').click();
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 1 · De stoomboot komt');
  await context.setOffline(false);
});

test('elk bestand in de offline-lijst bestaat, en elk spelbestand staat erin', async ({ request }) => {
  const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const core = [...sw.match(/const CORE = \[([\s\S]*?)\];/)[1].matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);
  for (const f of core) expect(fs.existsSync(path.join(root, f)), f).toBe(true);
  for (const dir of ['js', 'css', 'scenes', 'portraits'])
    for (const f of fs.readdirSync(path.join(root, dir))) expect(core, `${dir}/${f} staat niet in sw.js`).toContain(`${dir}/${f}`);
});

test('het titelscherm toont de versie, en een nieuwere versie biedt herladen aan', async ({ page }) => {
  const sw = require('fs').readFileSync(require('path').join(__dirname, '..', 'sw.js'), 'utf8');
  const cacheVersion = +sw.match(/const CACHE = 'sint-v(\d+)'/)[1];
  await page.goto('/');
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  // GAME_VERSION in js/boot.js en CACHE in sw.js gaan samen omhoog
  await expect(page.locator('#version')).toHaveText('v' + cacheVersion);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);
  await expect(page.locator('#update-bar')).toBeHidden();
  await page.evaluate(v => swVersion('sint-v' + (v - 1)), cacheVersion);
  await expect(page.locator('#update-bar')).toBeHidden();
  await page.evaluate(v => swVersion('sint-v' + (v + 1)), cacheVersion);
  await expect(page.locator('#update-bar')).toBeVisible();
  await page.locator('#btn-update').click();
  await page.waitForLoadState('load');
  await expect(page.locator('#update-bar')).toBeHidden();
});

test('index.html openen vanaf de schijf legt uit dat er een webserver nodig is', async ({ page }) => {
  await page.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));
  await expect(page.locator('#title p.keep')).toContainText('npm start');
  await expect(page.locator('#btn-new')).toBeHidden();
});
