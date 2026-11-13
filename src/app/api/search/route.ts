import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100);
  const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;

  const { rows } = await db.query(
    `SELECT j.id, j.title, j.status, j.scheduled_for
       FROM jobs j
       JOIN customers c ON c.id = j.customer_id
      WHERE c.auth_id = $1 AND j.title ILIKE $2
      ORDER BY j.scheduled_for DESC
      LIMIT 20`,
    [user.id, pattern],
  );

  return NextResponse.json({ results: rows });
}
