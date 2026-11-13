import "server-only";
import { createClient } from "@supabase/supabase-js";

// Bypasses Row Level Security: only call after checking the caller is staff.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
