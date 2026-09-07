-- Allow NULL on optional text columns so CSV import treats empty cells as NULL
-- (the app data layer coalesces null -> ''). Keys stay NOT NULL.
alter table public.products
  alter column description drop not null,
  alter column metals      drop not null,
  alter column sizes       drop not null,
  alter column karats      drop not null,
  alter column image       drop not null,
  alter column video       drop not null;

alter table public.articles
  alter column tag     drop not null,
  alter column author  drop not null,
  alter column date    drop not null,
  alter column excerpt drop not null,
  alter column content drop not null,
  alter column image   drop not null;

alter table public.showcase_items
  alter column collection  drop not null,
  alter column description drop not null,
  alter column image       drop not null,
  alter column metals      drop not null,
  alter column karats      drop not null,
  alter column style       drop not null,
  alter column gemstone    drop not null;
