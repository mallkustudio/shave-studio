import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service-role client — server-side only, never exposed to the browser.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
