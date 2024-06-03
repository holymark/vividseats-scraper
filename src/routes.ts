import { createCheerioRouter, log, Dataset, RequestQueue } from "crawlee";
import { base_url, labels } from "./constants.js";
import { KeyValueStore } from "crawlee";

export const router = createCheerioRouter();

// summary of the main page
router.addHandler(labels.Start, async ({ request, $ }) => {
  const { url } = request;
  log.info(`enqueing new urls in [${url}], [label: Start]`);

  const __next_data__ = () => {
    const script = $("#__NEXT_DATA__").text();

    return script ? JSON.parse(script) : null;
  };

  if (__next_data__()) {
    // const scraped_data: any[] = [];
    const page_props = __next_data__().props.pageProps;
    const important_opts = page_props.performersDataByLinkGroups;

    const links = important_opts.flatMap((group: any) => {
      return group.links.map((link: any) => {
        return { link_url: link.url, link_title: link.label };
      });
    });

    const request_queue = await RequestQueue.open();
    for (const item of links) {
      let _url = base_url + item.link_url;
      await request_queue.addRequest({ url: _url, label: "default" });
    }
  }
});

router.addHandler(labels.Lists, async ({ $, request }) => {
  const { url } = request;
  log.info(`crawling ${url}, [label: Lists]`);

  const __next_data__ = () => {
    const script = $("#__NEXT_DATA__").text();

    return script ? JSON.parse(script) : null;
  };

  if (__next_data__()) {
    const scraped_data: any[] = [];
    const page_props = __next_data__().props.pageProps;
    const important_opts = page_props.productionListData
      ? "productionListData"
      : page_props.initialProductionListData
      ? "initialProductionListData"
      : null;
    const description = page_props.customPage.content;
    const category_btn_type = page_props.customPage.title;
    const pkg_categ = page_props.customPage.category.subCategories.name;

    if (important_opts) {
      const important = page_props[important_opts].items;
      // const ticketvista_data : any[] = []

      important.map((imp: any, index: number) => {
        const {
          name,
          localDate,
          utcDate,
          id,
          venue,
          minPrice,
          maxPrice,
          avgPrice,
          medianPrice,
          listingCount,
          ticketCount,
          dateTbd,
          timeTbd,
          ifNecessary,
          organicUrl,
          webPath,
          onsaleDate,
          presaleDate,
        } = imp;
        // const obj = {
        //     name,
        //     date: {
        //         localDate,
        //         utcDate,
        //         onsaleDate,
        //         presaleDate,
        //     },
        //     prices: {
        //         minPrice,
        //         maxPrice,
        //         avgPrice,
        //         medianPrice,
        //     },
        //     ticketCount,
        //     listingCount,
        //     dateTbd,
        //     timeTbd,
        //     ifNecessary,
        //     venue,
        //     urls: {
        //         organicUrl,
        //         webPath,
        //     },
        // };

        const obj = {
          // id: "nba",
          // title: "nba",
          // description: "nba package description",
          acitve_pkgs: [
            {
              path: "/p/packages/sports/basketball/nba/" + id,
              id,
              title: name,
              event_description: description,
              date: "Sun • TBD",
              venue: venue.name + " in " + venue.city,
              price: avgPrice,
              maxPrice,
              avgPrice,
              medianPrice,
              ticketCount,
              category_btn_type,
              category: pkg_categ,
              remainingText: "Available",
              hotels: [
                {
                  name: "",
                  price_per_person: {
                    basic: 124,
                    premium: 110.55,
                    premium_plus: 129.99,
                  },
                },
              ],
            },
          ],
        };

        scraped_data.push(obj);
      });
      await Dataset.pushData(scraped_data);
    } else {
      log.error("__NEXT_DATA__ is not supported on this page");
    }
  } else {
    console.error(
      "Neither productionListData nor initialProductionListData found in page_props"
    );
  }
});

router.addDefaultHandler(async ({ request }) => {
  log.info(`Default Handler Scraping ${request.url}`);
});
