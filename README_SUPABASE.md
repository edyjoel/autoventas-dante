# Supabase Integration

## Setup

1. Copia `.env.example` a `.env` y agrega tus credenciales de Supabase.
2. El cliente está en `src/lib/supabase/client.ts`.
3. Usa `supabase` para consultas en tus componentes o endpoints.

## Estructura recomendada

- `src/lib/supabase/` → lógica y utilidades de Supabase
- `.env` → variables de entorno
- `README_SUPABASE.md` → instrucciones de integración
- `SUPABASE_PLAN.md` → esquema detallado y scripts SQL

## Mejoras

- Mantén las claves fuera del repo (usa `.env`)
- Usa carpetas dedicadas para lógica de datos
- Documenta endpoints y funciones

## Scripts SQL

- Los scripts completos para crear las tablas (`users`, `brands`, `models`, `images`, `model_inquiries`) están documentados en `SUPABASE_PLAN.md`, en la sección **"SQL para crear el esquema en Supabase"**.
