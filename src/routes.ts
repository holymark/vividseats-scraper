import { createPlaywrightRouter, log } from 'crawlee';

export const router = createPlaywrightRouter();

enum labels {
    Tickets = "Tickets",
    Home = "Home"
}

enum selectors {
    events_in_all_locations = ".events-in-all-locations",
    event_element = ".styles_grid__2V6e6",
    show_more_button = ".styles_button__3m2d-.styles_tertiary__1Hyu5.styles_large__1Gtzi" // data-testid

}
// summary of the main page
router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        // globs: ['https://crawlee.dev/**'],
        label: labels.Home,
    });
});

router.addHandler(labels.Tickets, async ({ request, page, pushData }) => {

    const {url} = request
    const event_el = await page.$("")

})
router.addHandler(labels.Home, async ({ request, page, pushData }) => {
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        title,
    });
});
