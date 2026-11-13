import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Acme Plumbing &amp; Heating</h1>
      <p className="mt-4 text-lg text-slate-600">
        Leaky tap, no hot water, blocked drain? Book a visit in two minutes and follow your
        technician&apos;s notes right here.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/dashboard" className="rounded bg-blue-700 px-5 py-3 font-medium text-white">
          Sign in to your portal
        </Link>
        <a href="tel:+15555550142" className="rounded border px-5 py-3 font-medium">
          Emergency line: (555) 555-0142
        </a>
      </div>
    </main>
  );
}
