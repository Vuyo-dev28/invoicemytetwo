-- Create the profiles table to store public user data
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamptz,
  company_name text,
  business_type text,
  currency text,
  first_name text,
  last_name text,

  constraint "profiles_id_fkey" foreign key (id) references auth.users(id) on delete cascade
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, company_name, business_type, currency, first_name, last_name)
  values (
    new.id, 
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'business_type',
    new.raw_user_meta_data->>'currency',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update an avatar." on storage.objects
  for update with check (bucket_id = 'avatars');
