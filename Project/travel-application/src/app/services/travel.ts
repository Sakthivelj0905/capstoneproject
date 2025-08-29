interface Traveler {
  name: string;
  email: string;
  mobile: string;
  residence: string;
}

interface Booking {
  id: number;
  organizer: string;
  travelers: Traveler[];
  vehicle: string;
  batch: string;
  packageId: number;
  status: string;
  canceled?: boolean;
}
