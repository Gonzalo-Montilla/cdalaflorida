-- Agregar 'SISTECREDITO' al enum metodopago (en mayúsculas para consistencia)
ALTER TYPE metodopago ADD VALUE IF NOT EXISTS 'SISTECREDITO';

-- Comentario
COMMENT ON TYPE metodopago IS 'Métodos de pago disponibles: EFECTIVO, TARJETA_DEBITO, TARJETA_CREDITO, TRANSFERENCIA, CREDISMART, SISTECREDITO';
