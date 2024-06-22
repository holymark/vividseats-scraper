import {
  createCheerioRouter,
  log,
  Dataset,
  RequestQueue,
  enqueueLinks,
  EnqueueStrategy,
} from "crawlee";
import { base_url, labels } from "./constants.js";
import { customPushData } from "./lib.js";
import { DataItem } from "../types.js";

export const router = createCheerioRouter();

const __next_data__ = ($: any) => {
  const script = $("#__NEXT_DATA__").text();

  return script ? JSON.parse(script) : null;
};

// summary of the main page
router.addHandler(labels.Start, async ({ request, $ }) => {
  const { url, userData } = request;
  log.info(`enqueing new urls in [${url}], [label: Start]`);

  const nextdata = __next_data__($);

  if (nextdata) {
    const page_props = nextdata.props.pageProps;
    const important_opts = page_props.performersDataByLinkGroups
      ? page_props.performersDataByLinkGroups
      : page_props.initialSubCategoryPerformersData
      ? page_props.initialSubCategoryPerformersData
      : null;

    if (
      important_opts != undefined &&
      important_opts.length != 0 &&
      important_opts
    ) {
      const isInitialSubCategoryPerformersData =
        page_props.initialSubCategoryPerformersData === important_opts;

      const links = important_opts.flatMap((group: any) => {
        return group.links.map((link: any) => {
          return {
            link_url: isInitialSubCategoryPerformersData
              ? link.webpath
              : link.url,
            link_title: link.label,
          };
        });
      });

      const request_queue = await RequestQueue.open();
      const [category, subcategory] = userData.category.split("/");

      for (const item of links) {
        let _url = base_url + item.link_url;
        await request_queue.addRequest({
          url: _url,
          label: labels.Lists,
          userData: { link_title: item.link_title, category, subcategory },
        });
      }
    }
  }
});

router.addHandler(labels.Lists, async ({ $, request }) => {
  const { url, userData } = request;
  const { category, subcategory } = userData;

  log.info(`crawling ${url}, [label: Lists]`);
  const { link_title } = userData;

  const nextdata = __next_data__($);
  if (nextdata) {
    const scraped_data: DataItem[] = [];
    const page_props = nextdata.props.pageProps;
    const important_opts = page_props.productionListData
      ? "productionListData"
      : page_props.initialProductionListData
      ? "initialProductionListData"
      : null;
    // const description = page_props.customPage!.content ? page_props.customPage.content : "No description available";
    // const category_btn_type = page_props.customPage.title ? page_props.customPage.content : "No category titile available";
    const pkg_categ = link_title ? link_title : "Unspecified";

    if (important_opts) {
      const important =
        page_props[important_opts].items.length > 0
          ? page_props[important_opts].items
          : null;
      if (important) {
        // const ticketvista_data : any[] = []
        important.map((imp: any) => {
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

          const obj: DataItem = {
            path: `/p/packages/${category}/${subcategory.toLowerCase()}/<precategory>/${id}`,
            _category: category,
            _subcategory: subcategory,
            url,
            id,
            title: name,
            venue: venue.name + " in " + venue.city,
            ticketCount,
            date: {
              localDate,
              utcDate,
              onsaleDate,
              presaleDate,
            },
            prices: {
              minPrice,
              maxPrice,
              avgPrice,
              medianPrice,
            },
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
          };

          scraped_data.push(obj);
        });
        await Dataset.pushData(scraped_data);

        // await customPushData(scraped_data, category, subcategory);
      } else {
        log.error("Ticket items was empty");
      }
    } else {
      log.error("__NEXT_DATA__ is not supported on this page");
    }
  } else {
    console.error(
      "Neither productionListData nor initialProductionListData found in page_props"
    );
  }
});

router.addDefaultHandler(async ({ request, enqueueLinks }) => {
  const { url, label } = request;

  log.info(`Enqueueing >>> ${url} from >>> Default Handler`);

  await enqueueLinks({
    label: labels.Home,
    strategy: EnqueueStrategy.SameDomain,
  });
});
