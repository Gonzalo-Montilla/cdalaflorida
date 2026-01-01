-- Crear tabla para desglose de efectivo al cerrar caja
CREATE TABLE IF NOT EXISTS desglose_efectivo_cierre (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caja_id UUID NOT NULL UNIQUE REFERENCES cajas(id) ON DELETE CASCADE,
    
    -- Billetes
    billetes_100000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_50000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_20000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_10000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_5000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_2000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    billetes_1000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    
    -- Monedas
    monedas_1000 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    monedas_500 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    monedas_200 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    monedas_100 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    monedas_50 NUMERIC(10, 0) NOT NULL DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Crear índice para búsqueda rápida por caja
CREATE INDEX IF NOT EXISTS idx_desglose_efectivo_cierre_caja ON desglose_efectivo_cierre(caja_id);

-- Comentarios
COMMENT ON TABLE desglose_efectivo_cierre IS 'Desglose de billetes y monedas al cerrar caja';
COMMENT ON COLUMN desglose_efectivo_cierre.caja_id IS 'Referencia a la caja cerrada';
