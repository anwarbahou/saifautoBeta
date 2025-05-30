"use client"

import { createBrowserSupabaseClient } from './supabase'

export const useAuth = () => {
  const supabase = createBrowserSupabaseClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return {
    signOut
  }
}

export const createUser = async (email: string, password: string) => {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user, error };
}
