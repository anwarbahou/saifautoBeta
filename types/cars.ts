import { Database } from './supabase';

export type CarData = Database['public']['Tables']['cars']['Row'];

export interface CarLocation {
  id: number;
  make: string;
  model: string;
  location: [number, number];
  status: string;
  license_plate: string | null;
} 