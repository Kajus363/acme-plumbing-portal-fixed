import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      auth_id: user.id,
      service: body.service,
      description: body.description,
      preferred_date: body.preferredDate,
      address: body.address,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not create booking" }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
