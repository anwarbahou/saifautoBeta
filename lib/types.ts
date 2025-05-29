export interface SearchParams {
  pickupDateTime?: string;
  dropoffDateTime?: string;
  destination?: string;
  [key: string]: string | string[] | undefined;
} 