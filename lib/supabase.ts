import { createClient } from '@supabase/supabase-js'

// Cek apakah di server atau browser
const isServer = typeof window === 'undefined'

// Kalau di browser, pakai anon key biasa
// Kalau di server (API route), tetap aman
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = isServer 
  ? (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

export const supabase = createClient(supabaseUrl, supabaseKey)