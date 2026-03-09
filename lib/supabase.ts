
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = !!(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_URL.startsWith('https://')
);

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
);

// ── Auth ────────────────────────────────────────────────────────────────────

export const authService = {

  signUp: async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('soul_email', email.toLowerCase());
      if (name) localStorage.setItem('soul_name', name);
      return { user: { id: email, email } as any, error: null, isDemo: true };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (data.user && !error) {
      localStorage.setItem('soul_email', email.toLowerCase());
    }
    // If session is null after signup, email confirmation is required
    const needsConfirmation = !!(data.user && !data.session && !error);
    return { user: data.user, session: data.session, error, isDemo: false, needsConfirmation };
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('soul_email', email.toLowerCase());
      return { user: { id: email, email } as any, session: null, error: null, isDemo: true };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data.user && !error) {
      localStorage.setItem('soul_email', email.toLowerCase());
    }
    return { user: data.user, session: data.session, error, isDemo: false };
  },

  signOut: async () => {
    localStorage.removeItem('soul_email');
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  },

  getSession: async () => {
    if (!isSupabaseConfigured) {
      const email = localStorage.getItem('soul_email');
      return { user: email ? { id: email, email } as any : null, session: null };
    }
    const { data } = await supabase.auth.getSession();
    return { user: data.session?.user ?? null, session: data.session };
  },

  onAuthChange: (callback: (user: any | null) => void) => {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((_event: any, session: any) => {
      callback(session?.user ?? null);
    });
  },

  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null, isDemo: true };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    return { error, isDemo: false };
  },

};

// ── Profile ────────────────────────────────────────────────────────────────

export const profileService = {

  get: async (userId: string) => {
    if (!isSupabaseConfigured) {
      return {
        data: {
          id: userId,
          name: localStorage.getItem('soul_name') || '',
          birth_date: localStorage.getItem('soul_date') || '',
          birth_time: localStorage.getItem('soul_time') || '',
          birth_location: localStorage.getItem('soul_location') || '',
          house_system: localStorage.getItem('soul_houses') || 'Placidus',
          subscription: localStorage.getItem('soul_subscription') || 'None',
          credits: parseInt(localStorage.getItem('tarot_credits') || '0'),
          is_admin: false,
        },
        error: null
      };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Mirror to localStorage so components that read it still work
    if (data) {
      if (data.name) localStorage.setItem('soul_name', data.name);
      if (data.birth_date) localStorage.setItem('soul_date', data.birth_date);
      if (data.birth_time) localStorage.setItem('soul_time', data.birth_time);
      if (data.birth_location) localStorage.setItem('soul_location', data.birth_location);
      if (data.house_system) localStorage.setItem('soul_houses', data.house_system);
      if (data.subscription) localStorage.setItem('soul_subscription', data.subscription);
      if (data.credits !== undefined) localStorage.setItem('tarot_credits', String(data.credits));
    }
    return { data, error };
  },

  upsert: async (userId: string, profile: {
    name?: string;
    birth_date?: string;
    birth_time?: string;
    birth_location?: string;
    house_system?: string;
  }) => {
    // Always update localStorage for instant UI feedback
    if (profile.name) localStorage.setItem('soul_name', profile.name);
    if (profile.birth_date) localStorage.setItem('soul_date', profile.birth_date);
    if (profile.birth_time) localStorage.setItem('soul_time', profile.birth_time);
    if (profile.birth_location) localStorage.setItem('soul_location', profile.birth_location);
    if (profile.house_system) localStorage.setItem('soul_houses', profile.house_system);
    window.dispatchEvent(new Event('storage'));

    if (!isSupabaseConfigured) return { error: null };

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
    return { error };
  },

  updateCredits: async (userId: string, credits: number) => {
    localStorage.setItem('tarot_credits', String(credits));
    window.dispatchEvent(new Event('storage'));
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase
      .from('profiles')
      .update({ credits })
      .eq('id', userId);
    return { error };
  },

  isAdmin: async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    return data?.is_admin ?? false;
  },
};

// ── Reports ────────────────────────────────────────────────────────────────

export const reportsService = {

  getAll: async (userId: string) => {
    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem('astromason_reports');
        return { data: saved ? JSON.parse(saved) : [], error: null };
      } catch {
        return { data: [], error: null };
      }
    }
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  save: async (userId: string, report: {
    id: string; title: string; type: string; content: string;
  }) => {
    // Always save to localStorage as backup
    try {
      const saved = localStorage.getItem('astromason_reports');
      const reports = saved ? JSON.parse(saved) : [];
      const newReport = { ...report, date: new Date().toISOString() };
      const idx = reports.findIndex((r: any) => r.id === report.id);
      if (idx >= 0) reports[idx] = newReport;
      else reports.unshift(newReport);
      localStorage.setItem('astromason_reports', JSON.stringify(reports));
    } catch {}

    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase
      .from('reports')
      .upsert({
        id: report.id,
        user_id: userId,
        title: report.title,
        type: report.type,
        content: report.content,
        created_at: new Date().toISOString()
      });
    return { error };
  },

  delete: async (userId: string, reportId: string) => {
    try {
      const saved = localStorage.getItem('astromason_reports');
      if (saved) {
        const reports = JSON.parse(saved).filter((r: any) => r.id !== reportId);
        localStorage.setItem('astromason_reports', JSON.stringify(reports));
      }
    } catch {}
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', userId);
    return { error };
  },

};

// ── Supabase schema (run this SQL in your Supabase project dashboard) ────────
/*
-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  birth_date date,
  birth_time text,
  birth_location text,
  house_system text default 'Placidus',
  subscription text default 'None',
  credits integer default 0,
  is_admin boolean default false,
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- reports table
create table reports (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  type text not null,
  content text not null,
  created_at timestamptz default now()
);
alter table reports enable row level security;
create policy "Users can manage own reports" on reports for all using (auth.uid() = user_id);

-- function to create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, credits, subscription)
  values (new.id, new.raw_user_meta_data->>'name', 3, 'None');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- To make a user admin (run manually in SQL editor):
-- update profiles set is_admin = true where id = (select id from auth.users where email = 'your@email.com');
*/
