import { createClient } from '@supabase/supabase-js';

// Prefer env vars; fallback to provided values if undefined (for quick setup)
const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL as string) || 'https://wwmjpfehruuwxwmgaxrl.supabase.co';
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



