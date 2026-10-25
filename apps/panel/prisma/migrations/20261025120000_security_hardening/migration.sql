-- Endurecimiento de permisos (revisión de seguridad 25/10/2026).

-- `_prisma_migrations` se creó después del REVOKE inicial y heredó los
-- privilegios por defecto de Supabase: anon y authenticated podían escribirla
-- (incluido TRUNCATE, que RLS no frena).
REVOKE ALL ON TABLE "_prisma_migrations" FROM anon, authenticated;

-- Que ninguna tabla, secuencia o función futura creada por `postgres` en
-- `public` quede expuesta por defecto: cada grant tiene que ser explícito.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, PUBLIC;

-- `rls_auto_enable()` es la función del event trigger de Supabase que activa
-- RLS en tablas nuevas. Es SECURITY DEFINER y quedaba invocable por
-- /rest/v1/rpc. El event trigger no necesita EXECUTE de estos roles.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
