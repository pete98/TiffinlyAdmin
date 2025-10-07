import { chromium, webkit, devices } from 'playwright';

const devicesToTest = [
  { name: 'Pixel 7', type: 'chromium', device: devices['Pixel 7'] },
  { name: 'iPhone 14', type: 'webkit', device: devices['iPhone 14'] },
];

const fileUrl = 'file:///tmp/hero.html';

const results = [];

for (const { name, type, device } of devicesToTest) {
  const browserType = type === 'chromium' ? chromium : webkit;
  const browser = await browserType.launch();
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();
  await page.goto(fileUrl);
  await page.waitForTimeout(500);

  const inputBox = page.locator('input[type="email"]');
  const button = page.locator('button');

  const inputBoxBounds = await inputBox.boundingBox();
  const buttonBounds = await button.boundingBox();
  const bodyBounds = await page.evaluate(() => {
    const rect = document.body.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width };
  });

  results.push({
    device: name,
    viewport: context.viewportSize(),
    input: inputBoxBounds,
    button: buttonBounds,
    body: bodyBounds,
  });

  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
