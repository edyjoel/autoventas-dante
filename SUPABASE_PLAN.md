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
