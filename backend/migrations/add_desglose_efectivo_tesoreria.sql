-- Migración: Agregar tabla de desglose de efectivo para movimientos de tesorería
-- Fecha: 2025-11-20
-- Descripción: Permite registrar el desglose de billetes y monedas para movimientos en efectivo

CREATE TABLE IF NOT EXISTS desglose_efectivo_tesoreria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movimiento_id UUID NOT NULL UNIQUE REFERENCES movimientos_tesoreria(id) ON DELETE CASCADE,
    
    -- Billetes colombianos
    billetes_100000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_50000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_20000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_10000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_5000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_2000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    billetes_1000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    
    -- Monedas colombianas
    monedas_1000 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    monedas_500 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    monedas_200 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    monedas_100 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    monedas_50 NUMERIC(10, 0) DEFAULT 0 NOT NULL,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_desglose_efectivo_movimiento ON desglose_efectivo_tesoreria(movimiento_id);

-- Comentarios
COMMENT ON TABLE desglose_efectivo_tesoreria IS 'Desglose de billetes y monedas para movimientos en efectivo de tesorería';
COMMENT ON COLUMN desglose_efectivo_tesoreria.movimiento_id IS 'Referencia al movimiento de tesorería (solo efectivo)';
