import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null when keys aren't configured — auth features degrade gracefully
export const supabase = url && key ? createClient(url, key) : null;
