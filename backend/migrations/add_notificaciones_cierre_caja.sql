-- Migración: Agregar tabla de notificaciones de cierre de caja
-- Fecha: 2026-01-12
-- Descripción: Notificaciones para administradores cuando cajeras cierran caja

CREATE TYPE estado_notificacion AS ENUM ('pendiente', 'leida', 'archivada');

CREATE TABLE notificaciones_cierre_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caja_id UUID NOT NULL REFERENCES cajas(id) ON DELETE CASCADE,
    
    -- Información del cierre
    turno VARCHAR(20) NOT NULL,
    cajera_nombre VARCHAR(255) NOT NULL,
    fecha_cierre TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Resumen financiero
    efectivo_entregar NUMERIC(10, 2) NOT NULL,
    monto_sistema NUMERIC(10, 2) NOT NULL,
    monto_fisico NUMERIC(10, 2) NOT NULL,
    diferencia NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    -- Observaciones del cierre
    observaciones TEXT,
    
    -- Estado de la notificación
    estado estado_notificacion NOT NULL DEFAULT 'pendiente',
    leida_por_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_notificaciones_estado ON notificaciones_cierre_caja(estado);
CREATE INDEX idx_notificaciones_fecha ON notificaciones_cierre_caja(created_at DESC);
CREATE INDEX idx_notificaciones_caja ON notificaciones_cierre_caja(caja_id);

-- Comentarios
COMMENT ON TABLE notificaciones_cierre_caja IS 'Notificaciones de cierre de caja para administradores en módulo de Tesorería';
COMMENT ON COLUMN notificaciones_cierre_caja.efectivo_entregar IS 'Monto en efectivo que la cajera debe entregar';
COMMENT ON COLUMN notificaciones_cierre_caja.diferencia IS 'Diferencia entre monto físico y sistema (puede ser positiva o negativa)';
