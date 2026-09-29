import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log("Attempting to create admin@society.com...");
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@society.com',
    password: 'adminadmin',
  });

  if (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Successfully created admin user!");
    console.log(JSON.stringify(data, null, 2));
    
    // Check if email confirmation is required
    if (data.session === null && data.user?.identities?.length > 0) {
        console.warn("\n⚠️  WARNING: Your Supabase project requires Email Confirmation.");
        console.warn("You will need to go into your Supabase Dashboard -> Authentication -> Providers and turn OFF 'Confirm email', OR manually confirm this user in the Dashboard.");
    }
  }
}

createAdmin();
