import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // ✅ this forces dynamic behavior for SSR

export async function GET() {
  const cookieStore = cookies(); // ✅ this can now be used directly for `createClient`
  const supabase = createClient(cookieStore); // ensure this accepts cookies object

  // ✅ Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ✅ Fetch subscription info
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  return NextResponse.json({
    plan: data.plan_id,
    status: data.status,
    renews_at: data.current_period_ends_at,
    start_date: data.start_date,
    end_date: data.end_date,
  });
}
