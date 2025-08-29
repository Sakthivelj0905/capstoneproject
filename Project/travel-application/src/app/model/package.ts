export interface ItineraryItem {
  plan: string;
  duration: string;
}

export interface Vehicle {
  name: string;
  icon: string;
}

export interface Facility {
  name: string;
  icon: string;
}

export interface Package {
  id?: number; // optional, required for edit mode
  name: string;
  overview: string;
  duration: number;
  slots: number;
  price: number;
  itinerary: ItineraryItem[];
  vehicles: Vehicle[];
  facilities: Facility[];
  description: string;
  insights: string;
  suggestions: string[];
  batches: string[];
  images: string[];
  instructions: string;
}
