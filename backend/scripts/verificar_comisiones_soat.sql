-- Script para verificar y crear comisiones SOAT en producción
-- Ejecutar este script ANTES del deployment si hay dudas sobre la existencia de comisiones

-- 1. Verificar si existen comisiones SOAT
SELECT 
    tipo_vehiculo,
    valor_comision,
    vigencia_inicio,
    vigencia_fin,
    activa,
    created_at
FROM comisiones_soat
ORDER BY tipo_vehiculo;

-- 2. Si la tabla está vacía o no tiene los valores correctos, ejecutar:
-- IMPORTANTE: Reemplazar 'ADMIN_USER_ID' con el UUID real del usuario administrador

-- Para obtener el UUID del administrador:
-- SELECT id FROM usuarios WHERE rol = 'administrador' LIMIT 1;

-- Insertar comisión para motos (si no existe)
INSERT INTO comisiones_soat (id, tipo_vehiculo, valor_comision, vigencia_inicio, vigencia_fin, activa, created_at, created_by)
SELECT 
    gen_random_uuid(),
    'moto',
    30000,
    '2025-01-01'::date,
    NULL,
    true,
    NOW(),
    (SELECT id FROM usuarios WHERE rol = 'administrador' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM comisiones_soat WHERE tipo_vehiculo = 'moto' AND activa = true
);

-- Insertar comisión para carros (si no existe)
INSERT INTO comisiones_soat (id, tipo_vehiculo, valor_comision, vigencia_inicio, vigencia_fin, activa, created_at, created_by)
SELECT 
    gen_random_uuid(),
    'carro',
    50000,
    '2025-01-01'::date,
    NULL,
    true,
    NOW(),
    (SELECT id FROM usuarios WHERE rol = 'administrador' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM comisiones_soat WHERE tipo_vehiculo = 'carro' AND activa = true
);

-- 3. Verificar que se crearon correctamente
SELECT 
    tipo_vehiculo,
    valor_comision,
    activa,
    created_at
FROM comisiones_soat
ORDER BY tipo_vehiculo;
