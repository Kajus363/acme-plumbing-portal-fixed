import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: customer } = await supabase
    .from("customers")
    .select("is_staff")
    .eq("auth_id", user.id)
    .single();
  if (!customer?.is_staff) throw new Error("Staff only");
}

export type OpenJob = { id: string; title: string; status: string; technician: string | null };

export async function getOpenJobs(): Promise<OpenJob[]> {
  await requireStaff();
  const { data, error } = await createAdminClient()
    .from("jobs")
    .select("id, title, status, technician")
    .neq("status", "complete");
  if (error) throw error;
  return data ?? [];
}

export async function markJobComplete(jobId: string) {
  await requireStaff();
  const { error } = await createAdminClient()
    .from("jobs")
    .update({ status: "complete", completed_at: new Date().toISOString() })
    .eq("id", jobId);
  if (error) throw error;
}
