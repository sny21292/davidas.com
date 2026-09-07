-- Security hardening: pin search_path on the trigger function
-- (fixes Supabase linter: function_search_path_mutable)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
