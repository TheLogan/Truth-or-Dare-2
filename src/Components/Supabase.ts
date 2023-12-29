import { createClient } from '@supabase/supabase-js'
// import type { Database } from "../../../types/supabase";

const supabaseUrl = "https://jbebyylhbwsrqrmacpmj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZWJ5eWxoYndzcnFybWFjcG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM1NDgyMTIsImV4cCI6MjAxOTEyNDIxMn0.HUPz78hCLmLwul2d2ADnDY-06kgooT4ggMMB0fJqhnA"

export const supabase = createClient/*<Database>*/(supabaseUrl, supabaseAnonKey)
