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

// await crawlSingle(URLs_crawlable.sports.Golf, "sports", "Golf");
// await crawlSingle(URLs_crawlable.sports.ExtremeSports,"sports","ExtremeSports")
// await crawlSingle(URLs_crawlable.sports.BoxingAndFighting,"sports","BoxingAndFighting")

// await crawlSingle(URLs_crawlable.sports.Gymnastics, "sports", "Gymnastics");
// await crawlSingle(URLs_crawlable.sports.Hockey, "sports", "Hockey");
// await crawlSingle(URLs_crawlable.sports.HorseRacing, "sports", "HorseRacing");
// await crawlSingle(URLs_crawlable.sports.Lacrosse, "sports", "Lacrosse");
// await crawlSingle(URLs_crawlable.sports.Tennis, "sports", "Tennis");
// await crawlSingle(URLs_crawlable.sports.Motorsports, "sports", "Motorsports");
// await crawlSingle(URLs_crawlable.sports.NASCARRacing, "sports", "NASCARRacing");
// await crawlSingle(URLs_crawlable.sports.Wrestling, "sports", "Wrestling");
// await crawlSingle(URLs_crawlable.sports.Rodeo, "sports", "Rodeo");
// await crawlSingle(URLs_crawlable.sports.Soccer, "sports", "Soccer");

// await crawlSingle(URLs_crawlable.concerts.Festivals, "concerts", "Festivals");
// await crawlSingle(
//   URLs_crawlable.concerts.Alternative,
//   "concerts",
//   "Alternative"
// );
// await crawlSingle(URLs_crawlable.concerts.HardRock, "concerts", "HardRock");
// await crawlSingle(URLs_crawlable.concerts.Pop, "concerts", "Pop");
// await crawlSingle(URLs_crawlable.concerts.RnB, "concerts", "RnB");
// await crawlSingle(URLs_crawlable.concerts.RapHipHop, "concerts", "RapHipHop");
// await crawlSingle(URLs_crawlable.concerts.Rock, "concerts", "Rock");
// await crawlSingle(
  //   URLs_crawlable.concerts.CountryAndFolk,
  //   "concerts",
//   "CountryAndFolk"
// );

// await crawlSingle(URLs_crawlable.theater.Comedy, "theater", "Comedy");
// await crawlSingle(
//   URLs_crawlable.theater.ArtsAndTheater,
//   "theater",
//   "ArtsAndTheater"
// );
await crawlSingle(URLs_crawlable.theater.Broadway, "theater", "Broadway");
// await crawlSingle(URLs_crawlable.theater.Cirque, "theater", "Cirque");
// await crawlSingle(URLs_crawlable.theater.Family, "theater", "Family");
// await crawlSingle(URLs_crawlable.theater.Musical, "theater", "Musical");
// await crawlSingle(URLs_crawlable.theater.Dance, "theater", "Dance");
// await crawlSingle(
//   URLs_crawlable.theater.PublicSpeaking,
//   "theater",
//   "PublicSpeaking"
// );
// await crawler.run([
//   {
//     url: "https://www.vividseats.com/theater/broadway",
//     label: labels.Start,
//     userData: { category: `theater/broadway` },
//   },
// ]);
//......................
// await crawlCategory("sports");
// await crawlCategory("concerts");
// await crawlCategory("theater");
await Actor.exit();
console.log("Crawler Ended >>>>");
