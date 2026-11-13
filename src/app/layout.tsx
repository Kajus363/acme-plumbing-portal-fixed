import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acme Plumbing — Client Portal",
  description: "Book repairs, follow your job and pay invoices online.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("customers")
      .select("id, full_name, email, address, phone")
      .eq("auth_id", user.id)
      .single();
    profile = data;
  }

  const data = { user: profile, siteUrl: process.env.NEXT_PUBLIC_SITE_URL };

  return (
    <html lang="en">
      <head>
        <StructuredData />
        <script
          id="__portal"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
