-- Migración manual: Agregar campos de auditoría a movimientos_tesoreria
-- Ejecutar este script en la base de datos PostgreSQL

-- Agregar columnas de anulación
ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS anulado BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS motivo_anulacion TEXT;

ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS anulado_at TIMESTAMP;

ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS anulado_por UUID REFERENCES usuarios(id);

-- Agregar columnas de auditoría de edición
ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES usuarios(id);

-- Mensaje de confirmación
SELECT 'Migración completada: Campos de auditoría agregados a movimientos_tesoreria' AS status;
