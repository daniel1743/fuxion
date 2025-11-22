import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://hkchmkzmelxtxqfzxjyk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY2hta3ptZWx4dHhxZnp4anlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjQwNDQsImV4cCI6MjA3OTI0MDA0NH0.ok0PmT2bldae52E7OCTuXP-XVjlaFqtY1aOt5JptzpA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
