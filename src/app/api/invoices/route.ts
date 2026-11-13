import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ invoices: [] });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("id, number, amount_cents, status, due_date")
    .eq("customer_id", customer.id)
    .order("due_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load invoices" }, { status: 500 });
  }

  return NextResponse.json({ invoices: data });
}
