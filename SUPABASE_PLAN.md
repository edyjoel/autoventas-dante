# Supabase Integration Plan for Model Management

## 1. Supabase Project Setup

- Create a Supabase account and a new project at https://app.supabase.com.
- Note your project URL and public API key.

## 2. Database Schema

- In Supabase, create a table called `models` (or `vehicles`) with fields such as:
  - `id` (UUID, primary key)
  - `brand` (text)
  - `model` (text)
  - `year` (integer)
  - `type` (text)
  - `price` (numeric)
  - `image_url` (text)
  - `description` (text)
  - `status` (text: enabled, disabled, sold, reserved, etc.)
  - `created_at` (timestamp)

- **model_inquiries** (form submissions for each model)
  - id (UUID, primary key)
  - model_id (UUID, foreign key to models)
  - model_name (text, snapshot for history)
  - name (text)
  - email (text)
  - phone (text)
  - message (text)
  - created_at (timestamp)
  - status (text: new, contacted, closed, etc.)

- **images** (gallery, multiple images per model)
  - id (UUID, primary key)
  - model_id (UUID, foreign key to models)
  - url (text)
  - alt (text)
  - order (integer)

- **brands** (optional, for filtering and normalization)
  - id (UUID, primary key)
  - name (text, unique)
  - logo_url (text, optional)

- **users** (optional, for admin or future login)
  - id (UUID, primary key)
  - email (text, unique)
  - password_hash (text)
  - role (text: admin, sales, etc.)
  - created_at (timestamp)

## 3. Install Supabase Client

- In your Astro project, install the Supabase JS client:
  ```
  pnpm add @supabase/supabase-js
  ```

## 4. Environment Variables

- Add your Supabase URL and public key to a `.env` file:
  ```
  SUPABASE_URL=your-supabase-url
  SUPABASE_ANON_KEY=your-public-anon-key
  ```

## 5. Supabase Client Utility

- Create a utility file (e.g., `src/lib/supabaseClient.ts`) to initialize and export the Supabase client using the env variables.

## 6. Data Fetching

- Update your model listing and detail pages to fetch data from Supabase instead of local/static data.
- Use Supabase queries to filter, sort, and paginate models as needed.

## 7. Admin/CRUD (Optional)

- (Optional) Build admin pages or scripts to add, edit, or delete models in Supabase.
- You can use the Supabase dashboard for manual management if no admin UI is needed.

## 8. Security & Policies

- Set up Row Level Security (RLS) in Supabase to control who can read/write model data.
- For public read-only access, allow `select` for anon users.

## 9. Testing & Validation

- Test fetching, filtering, and displaying models from Supabase in your Astro app.
- Validate error handling for network or permission issues.

---

## Scalable Database Schema with Auditing & Best Practices

### Main Tables

- **models** (vehicles for sale)
  - id (UUID, primary key, default: gen_random_uuid())
  - brand (text, indexed)
  - model (text, indexed)
  - year (integer, indexed)
  - type (text, indexed)
  - price (numeric)
  - image_url (text)
  - description (text)
  - status (text: enabled, disabled, sold, reserved, etc., indexed)
  - created_at (timestamp with time zone, default: now(), indexed)
  - updated_at (timestamp with time zone, auto-updated on change)
  - created_by (UUID, foreign key to users, nullable)
  - updated_by (UUID, foreign key to users, nullable)
  - deleted_at (timestamp with time zone, nullable, for soft deletes)

- **model_inquiries** (form submissions for each model)
  - id (UUID, primary key, default: gen_random_uuid())
  - model_id (UUID, foreign key to models, indexed)
  - model_name (text, snapshot for history)
  - name (text)
  - email (text)
  - phone (text)
  - message (text)
  - created_at (timestamp with time zone, default: now(), indexed)
  - status (text: new, contacted, closed, etc., indexed)
  - ip_address (text, optional, for audit/tracking)
  - user_agent (text, optional, for audit/tracking)

- **images** (gallery, multiple images per model)
  - id (UUID, primary key, default: gen_random_uuid())
  - model_id (UUID, foreign key to models, indexed)
  - url (text)
  - alt (text)
  - order (integer, indexed)
  - created_at (timestamp with time zone, default: now())
  - created_by (UUID, foreign key to users, nullable)

- **brands** (optional, for filtering and normalization)
  - id (UUID, primary key, default: gen_random_uuid())
  - name (text, unique, indexed)
  - logo_url (text, optional)
  - created_at (timestamp with time zone, default: now())

- **users** (optional, for admin or future login)
  - id (UUID, primary key, default: gen_random_uuid())
  - email (text, unique, indexed)
  - password_hash (text)
  - role (text: admin, sales, etc., indexed)
  - created_at (timestamp with time zone, default: now())
  - last_login_at (timestamp with time zone, nullable)
  - is_active (boolean, default: true)

### Auditing & Performance Best Practices

- Use `created_at`, `updated_at`, `created_by`, `updated_by`, and `deleted_at` for full audit trails and soft deletes.
- Add indexes to all fields used for filtering, sorting, or joining (e.g., brand, year, type, status, created_at).
- Use foreign keys for referential integrity, but also store snapshot fields (like model_name) for historical accuracy.
- Use `status` fields for soft enable/disable and filtering (never hard-delete unless necessary).
- Use `deleted_at` for soft deletes, and filter out records where `deleted_at` is not null in queries.
- Use `ip_address` and `user_agent` in inquiries for security and analytics.
- Use `order` in images for gallery sorting.
- Use `is_active` in users for account management.
- Use `timestamp with time zone` for all date fields for consistency.
- Consider partitioning or archiving old data if the dataset grows large.

### Security & Policies

- RLS for public read on models, restricted write on inquiries, admin-only on users/models/images.
- Only show enabled models (status = 'enabled' and deleted_at is null) on the public site.
- Log all admin changes via triggers or Supabase audit extensions if needed.

---

## Esquema Detallado para Supabase (Listo para Migración)

### Tabla: models

| Campo       | Tipo                     | Longitud | Opcional | Default           | Descripción                    |
| ----------- | ------------------------ | -------- | -------- | ----------------- | ------------------------------ |
| id          | uuid                     | -        | NO       | gen_random_uuid() | PK                             |
| brand       | text                     | 64       | NO       |                   | Marca (indexado)               |
| model       | text                     | 64       | NO       |                   | Modelo (indexado)              |
| year        | integer                  | -        | NO       |                   | Año (indexado)                 |
| type        | text                     | 32       | NO       |                   | Tipo (indexado)                |
| price       | numeric(12,2)            | -        | NO       |                   | Precio                         |
| image_url   | text                     | 256      | SÍ       | NULL              | Imagen principal               |
| description | text                     | 1024     | SÍ       | NULL              | Descripción                    |
| status      | text                     | 16       | NO       | 'enabled'         | enabled/disabled/sold/reserved |
| created_at  | timestamp with time zone | -        | NO       | now()             | Fecha creación (indexado)      |
| updated_at  | timestamp with time zone | -        | NO       | now()             | Fecha actualización            |
| created_by  | uuid                     | -        | SÍ       | NULL              | FK users.id                    |
| updated_by  | uuid                     | -        | SÍ       | NULL              | FK users.id                    |
| deleted_at  | timestamp with time zone | -        | SÍ       | NULL              | Soft delete                    |

### Tabla: model_inquiries

| Campo      | Tipo                     | Longitud | Opcional | Default           | Descripción               |
| ---------- | ------------------------ | -------- | -------- | ----------------- | ------------------------- |
| id         | uuid                     | -        | NO       | gen_random_uuid() | PK                        |
| model_id   | uuid                     | -        | NO       |                   | FK models.id (indexado)   |
| model_name | text                     | 64       | NO       |                   | Snapshot nombre modelo    |
| name       | text                     | 64       | NO       |                   | Nombre contacto           |
| email      | text                     | 128      | NO       |                   | Email contacto            |
| phone      | text                     | 32       | SÍ       | NULL              | Teléfono                  |
| message    | text                     | 1024     | SÍ       | NULL              | Mensaje                   |
| created_at | timestamp with time zone | -        | NO       | now()             | Fecha creación (indexado) |
| status     | text                     | 16       | NO       | 'new'             | new/contacted/closed      |
| ip_address | text                     | 64       | SÍ       | NULL              | IP (auditoría)            |
| user_agent | text                     | 256      | SÍ       | NULL              | User agent (auditoría)    |

### Tabla: images

| Campo      | Tipo                     | Longitud | Opcional | Default           | Descripción                 |
| ---------- | ------------------------ | -------- | -------- | ----------------- | --------------------------- |
| id         | uuid                     | -        | NO       | gen_random_uuid() | PK                          |
| model_id   | uuid                     | -        | NO       |                   | FK models.id (indexado)     |
| url        | text                     | 256      | NO       |                   | URL imagen                  |
| alt        | text                     | 128      | SÍ       | NULL              | Texto alternativo           |
| order      | integer                  | -        | NO       | 0                 | Orden en galería (indexado) |
| created_at | timestamp with time zone | -        | NO       | now()             | Fecha creación              |
| created_by | uuid                     | -        | SÍ       | NULL              | FK users.id                 |

### Tabla: brands

| Campo      | Tipo                     | Longitud | Opcional | Default           | Descripción                    |
| ---------- | ------------------------ | -------- | -------- | ----------------- | ------------------------------ |
| id         | uuid                     | -        | NO       | gen_random_uuid() | PK                             |
| name       | text                     | 64       | NO       |                   | Nombre marca (único, indexado) |
| logo_url   | text                     | 256      | SÍ       | NULL              | Logo                           |
| created_at | timestamp with time zone | -        | NO       | now()             | Fecha creación                 |

### Tabla: users

| Campo         | Tipo                     | Longitud | Opcional | Default           | Descripción                |
| ------------- | ------------------------ | -------- | -------- | ----------------- | -------------------------- |
| id            | uuid                     | -        | NO       | gen_random_uuid() | PK                         |
| email         | text                     | 128      | NO       |                   | Email (único, indexado)    |
| password_hash | text                     | 256      | NO       |                   | Hash contraseña            |
| role          | text                     | 16       | NO       | 'admin'           | admin/sales/etc (indexado) |
| created_at    | timestamp with time zone | -        | NO       | now()             | Fecha creación             |
| last_login_at | timestamp with time zone | -        | SÍ       | NULL              | Último login               |
| is_active     | boolean                  | -        | NO       | true              | Activo                     |

---

> **Nota:**
>
> - Todos los campos FK deben tener restricciones de integridad referencial.
> - Todos los campos indexados deben tener índices explícitos.
> - Los campos opcionales permiten NULL.
> - Los campos text con longitud son sugerencias para validación y performance.
> - Listo para copiar y crear tablas en Supabase.

## SQL para crear el esquema en Supabase

```sql
-- Opcional: asegurarse de tener gen_random_uuid()
create extension if not exists "pgcrypto";

-- =========================================
-- Tabla: users (administración interna)
-- =========================================
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now(),
  last_login_at timestamptz,
  is_active     boolean not null default true
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);

-- =========================================
-- Tabla: brands
-- =========================================
create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_brands_name on public.brands(name);

-- =========================================
-- Tabla: models (vehículos)
-- =========================================
create table if not exists public.models (
  id          uuid primary key default gen_random_uuid(),
  brand       text not null,
  model       text not null,
  year        integer not null,
  type        text not null,
  price       numeric(12,2) not null,
  image_url   text,
  description text,
  status      text not null default 'enabled',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references public.users(id),
  updated_by  uuid references public.users(id),
  deleted_at  timestamptz
);

create index if not exists idx_models_brand      on public.models(brand);
create index if not exists idx_models_model      on public.models(model);
create index if not exists idx_models_year       on public.models(year);
create index if not exists idx_models_type       on public.models(type);
create index if not exists idx_models_status     on public.models(status);
create index if not exists idx_models_created_at on public.models(created_at);

-- =========================================
-- Tabla: images (galería por modelo)
-- =========================================
create table if not exists public.images (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references public.models(id) on delete cascade,
  url        text not null,
  alt        text,
  "order"    integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references public.users(id)
);

create index if not exists idx_images_model_id on public.images(model_id);
create index if not exists idx_images_order    on public.images("order");

-- =========================================
-- Tabla: model_inquiries (consultas por modelo)
-- =========================================
create table if not exists public.model_inquiries (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references public.models(id) on delete cascade,
  model_name text not null,
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  created_at timestamptz not null default now(),
  status     text not null default 'new',
  ip_address text,
  user_agent text
);

create index if not exists idx_inquiries_model_id   on public.model_inquiries(model_id);
create index if not exists idx_inquiries_status     on public.model_inquiries(status);
create index if not exists idx_inquiries_created_at on public.model_inquiries(created_at);

-- =========================================
-- (Opcional) RLS básica de solo lectura pública en models
-- Ejecutar solo si quieres abrir lectura pública
-- =========================================
alter table public.models enable row level security;

create policy "Public read enabled models"
on public.models
for select
to anon, authenticated
using (status = 'enabled' and deleted_at is null);
```

## SQL de datos de prueba (seed)

Estos scripts insertan datos de ejemplo en las tablas `users`, `brands`, `models`, `images` y `model_inquiries` para que puedas probar rápidamente la integración desde Astro.

```sql
-- =========================================
-- Datos de prueba para tabla: users
-- =========================================
insert into public.users (id, email, password_hash, role, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'admin@autoventasdante.com', 'hash-demo', 'admin', true),
  ('22222222-2222-2222-2222-222222222222', 'ventas@autoventasdante.com', 'hash-demo', 'sales', true)
on conflict (email) do nothing;

-- =========================================
-- Datos de prueba para tabla: brands
-- =========================================
insert into public.brands (id, name, logo_url)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toyota', 'https://via.placeholder.com/120x60?text=Toyota'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Honda',  'https://via.placeholder.com/120x60?text=Honda'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mazda',  'https://via.placeholder.com/120x60?text=Mazda')
on conflict (name) do nothing;

-- =========================================
-- Datos de prueba para tabla: models (vehículos)
-- Nota: los IDs se reutilizan en images y model_inquiries
-- =========================================
insert into public.models (
  id, brand, model, year, type, price,
  image_url, description, status, created_by, updated_by
)
values
  -- Toyota Corolla
  ('10101010-1010-1010-1010-101010101010',
   'Toyota', 'Corolla', 2021, 'Sedán', 24500.00,
   'https://via.placeholder.com/800x450?text=Corolla+2021',
   'Toyota Corolla 2021, excelente consumo y perfecto para ciudad.',
   'enabled',
   '11111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111'
  ),
  -- Honda CR-V
  ('20202020-2020-2020-2020-202020202020',
   'Honda', 'CR-V', 2022, 'SUV', 36500.00,
   'https://via.placeholder.com/800x450?text=CR-V+2022',
   'Honda CR-V 2022, SUV familiar con amplio espacio y seguridad.',
   'enabled',
   '11111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111'
  ),
  -- Mazda 3
  ('30303030-3030-3030-3030-303030303030',
   'Mazda', '3', 2020, 'Hatchback', 27500.00,
   'https://via.placeholder.com/800x450?text=Mazda+3+2020',
   'Mazda 3 2020, diseño deportivo y gran equipamiento.',
   'enabled',
   '22222222-2222-2222-2222-222222222222',
   '22222222-2222-2222-2222-222222222222'
  )
on conflict (id) do nothing;

-- =========================================
-- Datos de prueba para tabla: images (galería)
-- =========================================
insert into public.images (
  id, model_id, url, alt, "order", created_by
)
values
  -- Imágenes Corolla
  ('41111111-1111-1111-1111-111111111111',
   '10101010-1010-1010-1010-101010101010',
   'https://via.placeholder.com/800x450?text=Corolla+Frente',
   'Toyota Corolla 2021 - Vista frontal',
   0,
   '11111111-1111-1111-1111-111111111111'
  ),
  ('41111111-1111-1111-1111-222222222222',
   '10101010-1010-1010-1010-101010101010',
   'https://via.placeholder.com/800x450?text=Corolla+Interior',
   'Toyota Corolla 2021 - Interior',
   1,
   '11111111-1111-1111-1111-111111111111'
  ),

  -- Imágenes CR-V
  ('42222222-2222-2222-2222-111111111111',
   '20202020-2020-2020-2020-202020202020',
   'https://via.placeholder.com/800x450?text=CR-V+Lateral',
   'Honda CR-V 2022 - Vista lateral',
   0,
   '11111111-1111-1111-1111-111111111111'
  ),
  ('42222222-2222-2222-2222-222222222222',
   '20202020-2020-2020-2020-202020202020',
   'https://via.placeholder.com/800x450?text=CR-V+Interior',
   'Honda CR-V 2022 - Interior',
   1,
   '11111111-1111-1111-1111-111111111111'
  ),

  -- Imágenes Mazda 3
  ('43333333-3333-3333-3333-111111111111',
   '30303030-3030-3030-3030-303030303030',
   'https://via.placeholder.com/800x450?text=Mazda+3+Frente',
   'Mazda 3 2020 - Vista frontal',
   0,
   '22222222-2222-2222-2222-222222222222'
  ),
  ('43333333-3333-3333-3333-222222222222',
   '30303030-3030-3030-3030-303030303030',
   'https://via.placeholder.com/800x450?text=Mazda+3+Interior',
   'Mazda 3 2020 - Interior',
   1,
   '22222222-2222-2222-2222-222222222222'
  )
on conflict (id) do nothing;

-- =========================================
-- Datos de prueba para model_inquiries (consultas)
-- =========================================
insert into public.model_inquiries (
  id, model_id, model_name, name, email, phone,
  message, status, ip_address, user_agent
)
values
  -- Consulta por Corolla
  ('51111111-1111-1111-1111-111111111111',
   '10101010-1010-1010-1010-101010101010',
   'Toyota Corolla 2021',
   'Juan Pérez',
   'juan.perez@example.com',
   '+52 55 1111 2222',
   'Hola, me interesa el Corolla 2021. ¿Tienen planes de financiamiento?',
   'new',
   '200.100.10.1',
   'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  ),

  -- Consulta por CR-V
  ('52222222-2222-2222-2222-222222222222',
   '20202020-2020-2020-2020-202020202020',
   'Honda CR-V 2022',
   'María López',
   'maria.lopez@example.com',
   '+52 55 3333 4444',
   'Busco una SUV familiar, ¿la CR-V 2022 sigue disponible?',
   'contacted',
   '200.100.10.2',
   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  ),

  -- Consulta por Mazda 3
  ('53333333-3333-3333-3333-333333333333',
   '30303030-3030-3030-3030-303030303030',
   'Mazda 3 2020',
   'Carlos Ramírez',
   'carlos.ramirez@example.com',
   '+52 55 5555 6666',
   '¿Aceptan auto a cuenta para el Mazda 3 2020?',
   'new',
   '200.100.10.3',
   'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
  )
on conflict (id) do nothing;
```

