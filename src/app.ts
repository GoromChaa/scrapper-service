import config from "./config/base.config";
import logger from "./utils/logger";
import { scrape } from "./scrapper";
import { scrapeTheDailyStar } from "./scrapper/target/theDailyStar";

const sources = {
  // THE_DAILY_STAR: "https://www.thedailystar.net/todays-news",
  THE_DAILY_STAR: "http://127.0.0.1:8787/news",
};

const startScrapping = async () => {
  try {
    scrape(sources.THE_DAILY_STAR, scrapeTheDailyStar);
  } catch (err) {
    // console.log(err);
    logger.error("Scrapper failed to start!");
  }
};

const main = async () => {
  try {
    startScrapping();
  } catch (err) {
    logger.error("Main Start Issue!");
  }
};

main();

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on("unhandledRejection", (err, promise) => {
  throw err;
});

process.on("uncaughtException", (err) => {
  logger.error("YOU KNOW WHERE YOU'RE WITH, FLOOR COLLAPSING, FLOATING!");
});
