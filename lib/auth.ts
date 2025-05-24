"use client"

import { createBrowserClient } from './supabase'

export const useAuth = () => {
  const supabase = createBrowserClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return {
    signOut
  }
}
