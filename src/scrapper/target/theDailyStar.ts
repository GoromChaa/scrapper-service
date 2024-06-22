import objectHash from "object-hash";
import { Page } from "puppeteer";
import prisma from "../../lib/prisma";
import { ScrappedNews } from "@prisma/client";
import logger from "../../utils/logger";

/* -----------------------SELECTORS-----------------------*/

let iteration = 0;

const scrapeTheDailyStar = async (page: Page) => {
  logger.info(`Started Scrapping for THE_DAILY_STAR. Iteration: ${++iteration}`);

  await page.reload();

  /* -----------------------GET ALL NEWS-----------------------*/
  const scrappedNewsArr = await page.evaluate(() => {
    const allNewsListSelector =
      "#inner-wrap > div.off-canvas-content > main > div > div.block-content.content > div > div.large-8.small-12.columns > div.panel-pane.pane-views-panes.pane-todays-news-panel-pane-1.no-title.block > div > div > div";
    const titleWithLinkSelector =
      "div:nth-child(2) > div.card.position-relative.horizontal.image-reverse.align-justify > div.card-content > h3 > a";
    const detailsSelector =
      "div:nth-child(2) > div.card.position-relative.horizontal.image-reverse.align-justify > div.card-content > p";
    const timeSelector = "div.columns.shrink.small-full-width.load-more-date.text-10.font-open-sans.hide-for-small-only";

    const newsList = document.querySelector(allNewsListSelector).children;
    return Array.from(newsList).map((news) => {
      const title = news.querySelector(titleWithLinkSelector)?.textContent;
      const link = (news.querySelector(titleWithLinkSelector) as HTMLAnchorElement)?.href;
      const content = news.querySelector(detailsSelector)?.textContent;
      const time = news.querySelector(timeSelector)?.textContent;

      return { title, link, content, time };
    });
  });

  /* -----------------------FIND NEW NEWS-----------------------*/
  const newNewsArr: ScrappedNews[] = [];

  for (let i = 0; i < scrappedNewsArr.length; i++) {
    const newsHash = objectHash(scrappedNewsArr[i]);

    const newsWithSameHash = await prisma.scrappedNews.findUnique({
      where: {
        hash: newsHash,
      },
    });

    if (newsWithSameHash) continue;

    const news = await prisma.scrappedNews.create({
      data: {
        source: "THE_DAILY_STAR",
        title: scrappedNewsArr[i].title,
        content: scrappedNewsArr[i].content,
        link: scrappedNewsArr[i].link,
        hash: newsHash,
      },
    });
    newNewsArr.push(news);
  }

  if (newNewsArr.length != 0) {
    logger.info(`New news found from THE_DAILY_STAR. Count: ${newNewsArr.length}`);
    // do processing with the newly founded news
  }

  logger.info(`Ended Scrapping for THE_DAILY_STAR. Iteration: ${iteration}`);

  /* -----------------------REPEAT-----------------------*/
  setTimeout(() => scrapeTheDailyStar(page), 10000);
};

export { scrapeTheDailyStar };
