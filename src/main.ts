import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { URLs_crawlable, labels } from "./constants.js";
import { Actor } from "apify";
import { Input } from "./types.js";
import { configDotenv } from "dotenv";
import { flattenURLs } from "./lib.js";

configDotenv();

await Actor.init();

const {
  startUrls,
  maxRequestsPerCrawl = 1000,
  proxyConfiguration: proxyConfig = {
    useApifyProxy: true,
  },
} = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfig);

const crawler = new CheerioCrawler({
  proxyConfiguration,
  requestHandler: router,
  maxRequestsPerCrawl,
  useSessionPool: true,
  sessionPoolOptions: {
    maxPoolSize: 10,
  },
  persistCookiesPerSession: true,
  preNavigationHooks: [
    ({ request }) => {
      request.headers!["User-Agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    },
  ],
  maxConcurrency: 10,
  failedRequestHandler: async ({ request, log }) => {
    log.error(`Failed to crawl ${request.url}`);
  },
});

// Function to start crawling a specific category
const crawlCategory = async (category: keyof typeof URLs_crawlable) => {
  const categoryURLs = flattenURLs(URLs_crawlable[category]);
  if (categoryURLs.length === 0) {
    log.error(`No URLs found for category: ${category}`);
    return;
  }

  for await (const { url, subcategory } of categoryURLs) {
    await crawler.run([
      {
        url,
        label: labels.Start,
        userData: { category: `${category}/${subcategory}` },
      },
    ]);
  }
};
const crawlSingle = async (
  url: string,
  category: keyof typeof URLs_crawlable,
  subcategory: string
) => {
  await crawler.run([
    {
      url,
      label: labels.Start,
      userData: { category: `${category}/${subcategory}` },
    },
  ]);
};
console.log("Crawler Started >>>>");


await crawlSingle(URLs_crawlable.theater.Musical, "theater", "Musical");

// await crawlCategory("sports");
// await crawlCategory("concerts");
// await crawlCategory("theater");
await Actor.exit();
console.log("Crawler Ended >>>>");
