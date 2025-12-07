import { createClient } from '@supabase/supabase-js';

// Placeholder credentials to prevent crash on demo
const SUPABASE_URL = 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkConnection = async () => {
  try {
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