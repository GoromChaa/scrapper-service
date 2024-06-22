import puppeteer, { Browser, Page } from "puppeteer";

// i guess it's a warcrime???
const getBrowser = async (): Promise<Browser> => {
  if (global.browser) return global.browser;

  global.browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  return global.browser as Browser;
};

const scrape = async (target, scrapeFunc) => {
  const browser = await getBrowser();
  const page: Page = await browser.newPage();

  // we don't want to fetch any unnecessary contents
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet", "font", "script"].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(target);
  await page.setViewport({ width: 1080, height: 1024 });
  scrapeFunc(page);
};

export { scrape };
