import { createClient } from '@supabase/supabase-js';

// Production Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://spdrpuhmhjlkfdejpacg.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZHJwdWhtaGpsa2ZkZWpwYWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDA3NTIsImV4cCI6MjA4Nzg3Njc1Mn0.WOQEVmWvZl2_jl2i7MlfI-XLxW6SnWYme8mWjDxJBDc';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;