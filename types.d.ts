interface PricePerPerson {
  basic: number;
  premium: number;
  premium_plus: number;
}

interface Hotel {
  name: string;
  price_per_person: PricePerPerson;
}

type Date_ = {
  localDate: string;
  utcDate: string;
  onsaleDate: string;
  presaleDate: string;
};

type Prices = {
    minPrice: string| number;
    maxPrice: string| number;
    avgPrice: string| number;
    medianPrice: string| number;
  
}
export interface DataItem {
  path: string;
  id: string; // Or number, depending on the type of 'id'
  title: string;
  event_description?: string; // Optional if you want to include it
  venue: string;
  ticketCount: number;
  category_btn_type?: string; // Optional
  date: Date_;
  category: string;
  remainingText: string;
  hotels: Hotel[];
  prices: Prices
}
