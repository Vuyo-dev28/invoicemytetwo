import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createClient();

  // Find user by email
  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Compare plain text password
  if (admin.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // ✅ Success: set a simple cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set('isAdmin', 'true', { httpOnly: true, path: '/' });

  return res;
}
