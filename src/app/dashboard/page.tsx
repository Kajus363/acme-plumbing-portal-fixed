import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/BookingForm";
import JobNotes from "@/components/JobNotes";
import AdminPanel from "@/components/AdminPanel";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id, full_name, is_staff")
    .eq("auth_id", user!.id)
    .single();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, scheduled_for, job_notes(id, body, author, created_at)")
    .eq("customer_id", customer?.id)
    .order("scheduled_for", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Hi {customer?.full_name?.split(" ")[0]} 👋</h1>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Book a repair</h2>
        <BookingForm />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Your jobs</h2>
        {jobs?.map((job) => (
          <article key={job.id} className="mt-4 rounded border bg-white p-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{job.title}</h3>
              <span className="text-sm text-slate-500">{job.status}</span>
            </div>
            <JobNotes notes={job.job_notes ?? []} />
          </article>
        ))}
      </section>

      {customer?.is_staff && <AdminPanel />}
    </main>
  );
}
