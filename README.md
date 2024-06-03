`**VividSeats Scraper Actor Documentation**
==============================================

**Introduction**
-----------

The VividSeats Scraper Actor is a web scraping tool that extracts event ticket information from [VividSeats]((link unavailable)). It provides a convenient way to fetch data on various events, including concerts, sports, and theater performances.

**Input Parameters**
--------------------

* **startUrl** (required): The URL to start scraping from (e.g., <(link unavailable)>)
* **maxPages** (optional): The maximum number of pages to scrape (default: 10)

**Output**
----------

The actor outputs an array of event objects with the following properties:

* **title**: Event title
* **description**: Event description
* **date**: Event date
* **venue**: Venue name and location
* **price**: Ticket price information (min, max, average)
* **ticketsAvailable**: Number of tickets available
* **url**: URL of the event page on VividSeats

**Configuration Options**
-------------------------

* **userAgent** (optional): The user agent string to use for scraping (default: Apify's default user agent)
* **proxy** (optional): The proxy URL to use for scraping (default: none)

**Usage**
-----

1. Create a new actor task in Apify
2. Choose the VividSeats Scraper Actor
3. Set the **startUrl** input parameter to the desired URL
4. Optionally set **maxPages** to limit the number of pages scraped
5. Run the actor

**Example Output**
---------------

```json
[
 {
  "id": 4833304,
  "localDate": "2024-05-25T20:30:00-04:00[America/Indiana/Indianapolis]",
  "utcDate": "2024-05-26T00:30:00Z",
  "name": "Boston Celtics at Indiana Pacers (Game 3, Indiana Home Game 1)",
  "venue": {
    "id": 9847,
    "name": "Gainbridge Fieldhouse",
    "address1": "125 South Pennsylvania Street",
    "address2": "",
    "city": "Indianapolis",
    "state": "IN",
    "postalCode": "46204",
    "phone": "(317) 917-2500",
    "countryCode": "US",
    "regionId": 58,
    "timezone": "America/Indiana/Indianapolis",
    "organicUrl": "/gainbridge-fieldhouse-tickets/venue/9847",
    "latitude": 39.7639878,
    "longitude": -86.1555392,
    "productionCount": 68,
    "webPath": "/gainbridge-fieldhouse-tickets/venue/9847",
    "exclusiveWsUserId": 0,
    "revenueRank": 9406
  },
  "minPrice": 97,
  "maxPrice": 56494,
  "avgPrice": 604.12,
  "medianPrice": 196,
  "listingCount": 249,
  "ticketCount": 738,
  "categoryId": 3,
  "subCategoryId": 3,
  "dateTbd": false,
  "timeTbd": false,
  "ifNecessary": false,
  "organicUrl": "/nba-basketball/indiana-pacers-tickets/pacers-5-15-4833304.html",
  "webPath": "/indiana-pacers-tickets-gainbridge-fieldhouse-5-15-2024--sports-nba-basketball/production/4833304",
  "hidden": false,
  "exclusiveWsUserId": 0,
  "primaryIntegrated": false,
  "similarProductionCount": 5,
  "productionDelayType": "NONE",
  "performers": [
    {
      "id": 105,
      "name": "Boston Celtics",
      "category": {
        "id": 3,
        "name": "Sports",
        "organicUrl": "/sports/",
        "subCategories": [
          {
            "id": 3,
            "name": "NBA Basketball",
            "organicUrl": "/nba-basketball"
          }
        ]
      },
      "master": false,
      "organicUrl": "/boston-celtics-tickets--sports-nba-basketball/performer/105",
      "parkingId": 52543,
      "webPath": "/boston-celtics-tickets--sports-nba-basketball/performer/105",
      "exclusiveWsUserId": 0,
      "revenueRank": 6679,
      "allTimeRevenueRank": 42458,
      "priority": 10,
      "urlName": "boston-celtics",
      "productionCount": 9,
      "nickname": "Celtics"
    },
    {
      "id": 369,
      "name": "Indiana Pacers",
      "category": {
        "id": 3,
        "name": "Sports",
        "organicUrl": "/sports/",
        "subCategories": [
          {
            "id": 3,
            "name": "NBA Basketball",
            "organicUrl": "/nba-basketball"
          }
        ]
      },
      "master": true,
      "organicUrl": "/indiana-pacers-tickets--sports-nba-basketball/performer/369",
      "parkingId": 52545,
      "webPath": "/indiana-pacers-tickets--sports-nba-basketball/performer/369",
      "exclusiveWsUserId": 0,
      "revenueRank": 6772,
      "allTimeRevenueRank": 42268,
      "priority": 9,
      "urlName": "indiana-pacers",
      "productionCount": 8,
      "nickname": "Pacers"
    }
  ],
  "localPrices": null
}
]
```