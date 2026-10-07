export interface City {
  id: string;
  city: string;
  description: string;
  image: string;
}

export interface Adventure {
  id: string;
  name: string;
  costPerHead: number;
  currency: string;
  image: string;
  duration: number;
  category: string;
}

export interface AdventureFilters {
  categories: string[];
  durations: number[];
}

export interface AdventuresResponse {
  adventures: Adventure[];
  filters: AdventureFilters;
}

export interface AdventureCityDocument {
  id: string;
  adventures: Adventure[];
}

export interface AdventureDetail {
  id: string;
  name: string;
  subtitle: string;
  images: string[];
  content: string;
  available: boolean;
  reserved: boolean;
  costPerHead: number;
}

export interface Reservation {
  id: string;
  name: string;
  date: string;
  person: number | string;
  adventure: string;
  adventureName: string;
  price: number;
  time: string;
}
