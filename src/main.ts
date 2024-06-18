import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { URLs_crawlable, labels } from "./constants.js";
import { Actor } from "apify";
import { Input } from "./types.js";
import { configDotenv } from "dotenv";
import { flattenURLs } from "./lib.js";

// configDotenv();

await Actor.init();

const {
  maxRequestsPerCrawl = 800,
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

  maxConcurrency: 2,
  failedRequestHandler: async ({ request, log }) => {
    log.error(`Failed to crawl ${request.url}`);
  },
});

// Function to start crawling a specific category
const crawlCategory = async (category: keyof typeof URLs_crawlable) => {
  const categoryURLs = flattenURLs(URLs_crawlable[category]);
  const [subcategory] = categoryURLs[0].subcategory.split("/");
  await crawler.run([
    {
      url: categoryURLs[0].url,
      label: labels.Start,
      userData: { category: `${category}/${subcategory}` },
    },
  ]);
  //   for (const { url, subcategory } of categoryURLs) {
  //     console.log("Crawler Started >>>>");
  //     await crawler.run([
  //       {
  //         url,
  //         label: labels.Start,
  //         userData: { category: `${category}/${subcategory}` },
  //       },
  //     ]);
  //   }
};

// for await (const url of startUrls) {
//     await crawler.run(
//         [
//             { url, label: labels.Start }
//         ]
//     );
// }

(async () => {
  console.log("Crawler Started >>>>");
  await crawlCategory("sports");
//   await crawlCategory("concerts");
//   await crawlCategory("theater");

  log.info("Crawling finished. >>>>");
})();
await Actor.exit();
console.log("Crawler Ended >>>>");
