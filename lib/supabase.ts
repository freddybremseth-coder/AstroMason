
import { createClient } from '@supabase/supabase-js';

// MERK: Disse bør ideelt sett ligge i en .env fil. 
// For demo-formål bruker vi syntaktisk gyldige URL-er slik at appen ikke krasjer ved oppstart.
// Erstatt disse med dine faktiske nøkler når du kobler til Supabase.

const SUPABASE_URL = 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hjelpefunksjon for å sjekke om vi er koblet til
export const checkConnection = async () => {
  try {
    // Hvis vi bruker placeholder-url, hopp over nettverkskall
    if (SUPABASE_URL.includes('placeholder')) {
        throw new Error('Using placeholder credentials');
    }
    const { data, error } = await supabase.from('courses').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase connection running in offline/mock mode.');
    return false;
  }
};
