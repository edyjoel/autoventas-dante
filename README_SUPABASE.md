# Supabase Integration

## Setup

1. Copia `.env.example` a `.env` y agrega tus credenciales de Supabase.
2. El cliente está en `src/lib/supabase/client.ts`.
3. Usa `supabase` para consultas en tus componentes o endpoints.

## Estructura recomendada

- `src/lib/supabase/` → lógica y utilidades de Supabase
- `.env` → variables de entorno
- `README_SUPABASE.md` → instrucciones de integración

## Mejoras

- Mantén las claves fuera del repo (usa `.env`)
- Usa carpetas dedicadas para lógica de datos
- Documenta endpoints y funciones
