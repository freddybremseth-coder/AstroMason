
import { createClient } from '@supabase/supabase-js';

// Bruker miljøvariabler som settes i Vercel eller din lokale .env fil
// Dette hindrer at sensitive nøkler havner i feil hender
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkConnection = async () => {
  try {
    if (SUPABASE_URL.includes('placeholder')) {
        return false;
    }
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase: Kjører i demo-modus uten database-tilkobling.');
    return false;
  }
};
