import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve config from env or localStorage (configured via UI Settings)
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('offrails_supabase_url') || localStorage.getItem('railsync_supabase_url');
  const localKey = localStorage.getItem('offrails_supabase_key') || localStorage.getItem('railsync_supabase_key');

  return {
    url: localUrl || envUrl || '',
    key: localKey || envKey || '',
  };
};

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url) {
    localStorage.setItem('offrails_supabase_url', url);
    localStorage.setItem('railsync_supabase_url', url);
  } else {
    localStorage.removeItem('offrails_supabase_url');
    localStorage.removeItem('railsync_supabase_url');
  }

  if (key) {
    localStorage.setItem('offrails_supabase_key', key);
    localStorage.setItem('railsync_supabase_key', key);
  } else {
    localStorage.removeItem('offrails_supabase_key');
    localStorage.removeItem('railsync_supabase_key');
  }

  supabaseInstance = null; // Re-initialize on next request
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
}
