// app/subscription/page.tsx

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PayPalBtn from "../../../components/PayPalButton"; // Client Component

export default async function SubscriptionPage() {
  // Create Supabase client on the server
  const supabase = createClient(cookies());

  // Get logged-in user
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login"); // Redirect if not logged in
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Subscribe</h1>

      {/* Render client component for PayPal button */}
      <PayPalBtn userId={user.id} />
    </div>
  );
}
