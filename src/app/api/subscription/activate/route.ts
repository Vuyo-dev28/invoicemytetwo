// import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export const dynamic = "force-dynamic";

// export async function POST() {
//   const supabase = createClient();
//   const { data: { user }, error: userError } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
//   }

//   const { error } = await supabase
//     .from("subscriptions")
//     .update({ status: "active", plan_id: "Professional" }) // You can customize this
//     .eq("user_id", user.id);

//   if (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ success: true });
// }
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = createClient();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  // Parse body for plan_id
  const { plan_id } = await req.json();
  if (!plan_id) {
    return NextResponse.json({ success: false, error: "Missing plan_id." }, { status: 400 });
  }

  // Update subscription in database
  const { error } = await supabase
    .from("subscriptions")
    .update({ 
      status: "active", 
      plan_id: plan_id  // dynamic update
    })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, plan: plan_id });
}
