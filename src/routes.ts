import { createCheerioRouter, log, Dataset } from 'crawlee';
import { labels } from './constants.js';

export const router = createCheerioRouter();


// summary of the main page
router.addHandler(labels.Start, async ({ enqueueLinks, request }) => {
    const { url } = request
    log.info(`enqueing new urls in [${url}], [label: Start]`)


    await enqueueLinks({
        // selector:"a",
        globs: ['https://www.vividseats.com/**'],
        label: labels.Lists
    });
});


router.addHandler(labels.Lists, async ({ $, request }) => {
    const { url } = request
    log.info(`crawling ${url}, [label: Lists]`)

    const __next_data__ = (() => {
        const script = $("#__NEXT_DATA__").text()

        return script ? JSON.parse(script) : null
    })

    if (__next_data__()) {
        const scraped_data: any[] = [];
        const page_props = __next_data__().props.pageProps;
        const important_opts = page_props.productionListData ? "productionListData" : page_props.initialProductionListData ? "initialProductionListData" : null;
        if (important_opts) {
            const important = page_props[important_opts].items;

            important.map((imp: any, index: number) => {
                const {
                    name,
                    localDate,
                    utcDate,
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
                const obj = {
                    name,
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
                    ticketCount,
                    listingCount,
                    dateTbd,
                    timeTbd,
                    ifNecessary,
                    venue,
                    urls: {
                        organicUrl,
                        webPath,
                    },
                };
                scraped_data.push(obj);
            });
            await Dataset.pushData(scraped_data)
        } else {
            log.error("__NEXT_DATA__ is not supported on this page")
        }
    } else {
        console.error('Neither productionListData nor initialProductionListData found in page_props');
    }
})

router.addDefaultHandler(async () => {
    log.info("Now in default handler")
})
