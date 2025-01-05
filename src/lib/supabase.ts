import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  created_at: string;
};

export type Child = {
  id: string;
  profile_id: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  achievements: number;
  created_at: string;
};

export type Meal = {
  id: string;
  child_id: string;
  name: string;
  type: string;
  date: string;
  photo_url?: string;
  created_at: string;
};