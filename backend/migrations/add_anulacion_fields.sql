-- Migración: Agregar campos de anulación a movimientos
-- Fecha: 2026-01-09
-- Descripción: Agregar campos para permitir anulación de movimientos en Tesorería y Caja

-- 1. Agregar campos a movimientos_tesoreria
ALTER TABLE movimientos_tesoreria 
ADD COLUMN IF NOT EXISTS anulado BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS motivo_anulacion TEXT,
ADD COLUMN IF NOT EXISTS anulado_por UUID REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS fecha_anulacion TIMESTAMP;

-- Crear índice para consultas que filtren por anulado
CREATE INDEX IF NOT EXISTS idx_movimientos_tesoreria_anulado ON movimientos_tesoreria(anulado);

-- 2. Agregar campos a movimientos_caja
ALTER TABLE movimientos_caja 
ADD COLUMN IF NOT EXISTS anulado BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS motivo_anulacion TEXT,
ADD COLUMN IF NOT EXISTS anulado_por UUID REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS fecha_anulacion TIMESTAMP;

-- Crear índice para consultas que filtren por anulado
CREATE INDEX IF NOT EXISTS idx_movimientos_caja_anulado ON movimientos_caja(anulado);

-- Verificación
SELECT 'Migración completada exitosamente' AS resultado;
