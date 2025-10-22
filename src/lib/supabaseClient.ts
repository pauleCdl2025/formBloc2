import { createClient } from '@supabase/supabase-js';

// Prefer env vars; fallback to provided values if undefined (for quick setup)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://wwmjpfehruuwxwmgaxrl.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWpwZmVocnV1d3h3bWdheHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjIwODksImV4cCI6MjA3NjQ5ODA4OX0.HW95sUheCzRPc_hmop3UOvo85jD3MsfRPTBduqtyf40';

console.log('Configuration Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Présente' : 'Manquante');

// Configuration Supabase avec options de débogage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
});

// Fonction de test de connexion
export const testSupabaseConnection = async () => {
  try {
    console.log('=== TEST DE CONNEXION SUPABASE ===');
    
    // Test simple de lecture
    const { data, error } = await supabase
      .from('consultation_preanesthesique')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      return false;
    }
    
    console.log('Connexion Supabase OK:', data);
    return true;
  } catch (e) {
    console.error('Erreur de connexion:', e);
    return false;
  }
};



