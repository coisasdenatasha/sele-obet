import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  full_name: string | null;
  username: string | null;
  level: string;
  avatar_url: string | null;
  phone: string | null;
  cpf: string | null;
  dob: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialize: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  // Legacy compat
  login: (user: { name: string; username: string; level: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ isLoggedIn: true, user: session.user, loading: false });
        // Defer profile fetch to avoid deadlock
        setTimeout(() => get().fetchProfile(session.user.id), 0);
      } else {
        set({ isLoggedIn: false, user: null, profile: null, loading: false });
      }
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ isLoggedIn: true, user: session.user, loading: false });
      get().fetchProfile(session.user.id);
    } else {
      set({ loading: false });
    }
  },

  fetchProfile: async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, username, level, avatar_url, phone, cpf, dob, country, state, city')
      .eq('user_id', userId)
      .single();
    if (data) {
      set({ profile: data });
    }
  },

  updateProfile: async (data) => {
    const user = get().user;
    if (!user) return;
    await supabase.from('profiles').update(data).eq('user_id', user.id);
    set((s) => ({ profile: s.profile ? { ...s.profile, ...data } : null }));
  },

  signUp: async (email, password, metadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message || null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ isLoggedIn: false, user: null, profile: null });
  },

  // Legacy compat for mock flows
  login: (user) => set({ isLoggedIn: true, profile: { full_name: user.name, username: user.username, level: user.level, avatar_url: null, phone: null, cpf: null, dob: null, country: null, state: null, city: null } }),
  logout: () => { get().signOut(); },
}));
