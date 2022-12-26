const { Builder } = require('selenium-webdriver');
const { PageLoadStrategy } = require('selenium-webdriver/lib/capabilities');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

beforeAll(async () => {
  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions({
      // for some reasons the try sql page may stuck somewhere on the ads loading stage for me
      // works better with eager strategy
      pageLoadStrategy: PageLoadStrategy.EAGER
    })
    .build();
  await driver.manage().setTimeouts({ implicit: 10000 });
});

afterAll(async () => {
  await driver.quit();
});