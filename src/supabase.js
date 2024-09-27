import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ydekmjtnjclsuewpavkl.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWttanRuamNsc3Vld3BhdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2NzE2MzYsImV4cCI6MjAzOTI0NzYzNn0.55_ZAyMqnzGoPMRQpRENKzdSz3ejUISeJ8rqio2xPyA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;