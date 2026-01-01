-- ==========================================
-- Script DESCARTADO - No ejecutar
-- Fecha: 2025-01-25
-- NOTA: Este script fue creado por error.
--       El valor_rtm DEBE usar tarifa.valor_total (RTM + Terceros)
--       porque es el valor total que cobra el CDA al cliente.
-- ==========================================

-- NO EJECUTAR ESTE SCRIPT

BEGIN;

-- 1. Mostrar vehículos con valores incorrectos (para verificación)
SELECT 
    v.id,
    v.placa,
    v.ano_modelo,
    v.valor_rtm as valor_rtm_incorrecto,
    t.valor_rtm as valor_rtm_correcto,
    t.valor_total,
    v.comision_soat,
    v.total_cobrado as total_cobrado_incorrecto,
    (t.valor_rtm + v.comision_soat) as total_cobrado_correcto
FROM 
    vehiculos_proceso v
    JOIN tarifas t ON (
        t.activa = true
        AND (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) >= t.antiguedad_min
        AND (
            t.antiguedad_max IS NULL 
            OR (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) <= t.antiguedad_max
        )
        AND CURRENT_DATE BETWEEN t.vigencia_inicio AND t.vigencia_fin
    )
WHERE 
    v.valor_rtm != t.valor_rtm
ORDER BY v.fecha_registro DESC;

-- 2. Actualizar valores incorrectos
-- Esto corrige el valor_rtm y recalcula el total_cobrado

UPDATE vehiculos_proceso v
SET 
    valor_rtm = t.valor_rtm,
    total_cobrado = t.valor_rtm + v.comision_soat
FROM 
    tarifas t
WHERE 
    t.activa = true
    AND (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) >= t.antiguedad_min
    AND (
        t.antiguedad_max IS NULL 
        OR (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) <= t.antiguedad_max
    )
    AND CURRENT_DATE BETWEEN t.vigencia_inicio AND t.vigencia_fin
    AND v.valor_rtm != t.valor_rtm;

-- 3. Verificar que todos los vehículos quedaron correctos
SELECT 
    COUNT(*) as total_vehiculos,
    COUNT(CASE WHEN v.valor_rtm = t.valor_rtm THEN 1 END) as correctos,
    COUNT(CASE WHEN v.valor_rtm != t.valor_rtm THEN 1 END) as incorrectos
FROM 
    vehiculos_proceso v
    JOIN tarifas t ON (
        t.activa = true
        AND (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) >= t.antiguedad_min
        AND (
            t.antiguedad_max IS NULL 
            OR (EXTRACT(YEAR FROM CURRENT_DATE) - v.ano_modelo) <= t.antiguedad_max
        )
        AND CURRENT_DATE BETWEEN t.vigencia_inicio AND t.vigencia_fin
    );

-- Si todo está correcto, descomentar la siguiente línea para confirmar los cambios:
-- COMMIT;

-- Si algo salió mal, descomentar esta línea para revertir:
ROLLBACK;
