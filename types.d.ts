interface PricePerPerson {
    basic: number;
    premium: number;
    premium_plus: number;
  }
  
  interface Hotel {
    name: string;
    price_per_person: PricePerPerson;
  }
  
  export interface DataItem {
    path: string;
    id: string; // Or number, depending on the type of 'id'
    title: string;
    // event_description?: string; // Optional if you want to include it
    date: string;
    venue: string;
    price: number;
    maxPrice: number;
    avgPrice: number;
    medianPrice: number;
    ticketCount: number;
    // category_btn_type?: string; // Optional
    category: string;
    remainingText: string;
    hotels: Hotel[];
  }

