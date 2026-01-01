-- Agregar rol CONTADOR al enum existente
-- Nota: En PostgreSQL, no se puede usar IF NOT EXISTS con ADD VALUE hasta PostgreSQL 12+
-- Si la versión es menor, primero verificar si existe

-- Intento 1: Para PostgreSQL 12+
-- ALTER TYPE rolenum ADD VALUE IF NOT EXISTS 'contador';

-- Intento 2: Para todas las versiones (más seguro)
-- Verificar si el valor ya existe antes de agregarlo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'contador' AND enumtypid = 'rolenum'::regtype) THEN
        ALTER TYPE rolenum ADD VALUE 'contador';
    END IF;
END$$;
