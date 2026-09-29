const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.*)/)?.[1]?.trim();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase URL:', supabaseUrl);
  try {
    // Test auth check
    const { data: authData, error: authErr } = await supabase.auth.getSession();
    console.log('Auth getSession response:', authErr ? authErr.message : 'Session checked successfully');

    // Test tables
    const tables = ['complaints', 'tickets', 'members', 'clusters'];
    for (const t of tables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      if (error) {
        console.log(`Table '${t}':`, error.message);
      } else {
        console.log(`Table '${t}': Found! Rows:`, data.length);
      }
    }
  } catch (e) {
    console.error('Supabase exception:', e.message);
  }
}
testSupabase();
