-- Create the contact_messages table
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) for the table
alter table contact_messages enable row level security;

-- Create a policy that allows public access to insert new messages
create policy "Allow public insert" on contact_messages for insert to anon with check (true);

-- Create a policy that allows authenticated users to read all messages
create policy "Allow authenticated read access" on contact_messages for select to authenticated using (true);
