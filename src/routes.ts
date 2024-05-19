import { createPlaywrightRouter, log } from 'crawlee';

export const router = createPlaywrightRouter();

enum labels {
    Tickets = "Tickets",
    Home = "Home",
    Start = "Start"
}

// summary of the main page
router.addDefaultHandler(async ({ enqueueLinks }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://vividseats.com/**'],
    });
});


router.addHandler(labels.Start, async ({ enqueueLinks, page, request }) => {
    const { url } = request
    log.info(`crawling ${url}, [label: Start]`)

    const __next_data__ = await page.evaluate(() => {
        const script = document.querySelector("#__NEXT_DATA__")

        return script ? JSON.parse(script.innerHTML) : null
    })

    if (__next_data__) {

    } else {
        log.error("__NEXT_DATA__ is not supported on this page")
    }
})

