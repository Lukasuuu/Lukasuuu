import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Types for database tables
export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  working_hours?: Record<string, any>;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  business_id?: string;
  name?: string;
  email?: string;
  role: 'owner' | 'staff' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  working_hours?: Record<string, any>;
  services?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration_min: number;
  price: number;
  category?: string;
  color?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  total_bookings: number;
  total_spent: number;
  last_booking_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  client_id: string;
  staff_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  business_id: string;
  booking_id?: string;
  type: string;
  channel: 'email' | 'whatsapp' | 'telegram' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  created_at: string;
}
