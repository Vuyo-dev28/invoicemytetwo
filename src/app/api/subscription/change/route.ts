import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { planId } = await req.json();

  // Validate planId
  const validPlans = ["Free", "Starter", "Professional"];
  if (!validPlans.includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  

  const { error } = await supabase
    .from("subscriptions")
    .update({ plan_id: planId, status: "active" })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
