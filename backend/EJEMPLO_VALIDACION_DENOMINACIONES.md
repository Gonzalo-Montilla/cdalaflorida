# Validación de Disponibilidad de Denominaciones en Egresos

## Problema Resuelto

Anteriormente, el sistema permitía crear egresos en efectivo sin validar si las denominaciones solicitadas estaban realmente disponibles en caja fuerte. 

### Ejemplo del Problema

**Situación:**
- Caja tiene: 9 billetes de $100,000 + 2 billetes de $50,000 = $1,000,000
- Usuario intenta egreso: 10 billetes de $100,000 = $1,000,000

**Antes:** ✅ Sistema permitía la operación (porque suma $1,000,000)  
**Ahora:** ❌ Sistema rechaza y sugiere alternativas (solo hay 9 billetes de $100,000)

## Implementación

### 1. Funciones Auxiliares

#### `_calcular_desglose_disponible(db: Session) -> dict`
Calcula el inventario actual de denominaciones en caja:
- Recorre todos los movimientos en efectivo
- Suma denominaciones de ingresos
- Resta denominaciones de egresos
- Retorna el inventario actual

#### `_generar_sugerencia_denominaciones(monto_total: int, desglose_disponible: dict) -> str`
Genera sugerencias de cómo componer el monto con denominaciones disponibles:
- Usa algoritmo greedy (denominaciones más grandes primero)
- Solo sugiere denominaciones que existen en inventario
- Informa si no es posible componer el monto completo

### 2. Validación en Creación de Movimientos

Cuando se crea un egreso en efectivo, el sistema:

1. **Valida que el desglose sume el monto total** (validación existente)
2. **NUEVO: Valida disponibilidad de cada denominación**
   - Compara denominaciones solicitadas vs disponibles
   - Si hay faltantes, rechaza la operación
   - Genera mensaje de error detallado con:
     - Qué denominaciones faltan
     - Cuántas se solicitan vs cuántas hay disponibles
     - Sugerencia de denominaciones alternativas

## Ejemplos de Uso

### Caso 1: Denominaciones Disponibles ✅

**Inventario en Caja:**
```
billetes_100000: 10
billetes_50000: 5
billetes_20000: 10
```

**Egreso Solicitado:** $1,000,000
```json
{
  "tipo": "egreso",
  "categoria_egreso": "nomina",
  "monto": 1000000,
  "concepto": "Pago nómina",
  "metodo_pago": "efectivo",
  "desglose_efectivo": {
    "billetes_100000": 8,
    "billetes_50000": 2,
    "billetes_20000": 5
  }
}
```

**Resultado:** ✅ **Operación exitosa**
- 8 billetes de $100k ≤ 10 disponibles
- 2 billetes de $50k ≤ 5 disponibles
- 5 billetes de $20k ≤ 10 disponibles

---

### Caso 2: Denominaciones Insuficientes ❌

**Inventario en Caja:**
```
billetes_100000: 9
billetes_50000: 2
billetes_20000: 0
```

**Egreso Solicitado:** $1,000,000
```json
{
  "tipo": "egreso",
  "categoria_egreso": "nomina",
  "monto": 1000000,
  "concepto": "Pago nómina",
  "metodo_pago": "efectivo",
  "desglose_efectivo": {
    "billetes_100000": 10,
    "billetes_50000": 0,
    "billetes_20000": 0
  }
}
```

**Resultado:** ❌ **Error 400**
```
No hay suficientes denominaciones disponibles:
  - billetes de $100,000: solicita 10 pero solo hay 9 disponibles

Sugerencia de denominaciones disponibles:
  - 9 billetes de $100,000
  - 2 billetes de $50,000
```

---

### Caso 3: Sugerencia Completa ❌

**Inventario en Caja:**
```
billetes_100000: 5
billetes_50000: 8
billetes_20000: 15
billetes_10000: 20
```

**Egreso Solicitado:** $800,000
```json
{
  "tipo": "egreso",
  "categoria_egreso": "proveedores",
  "monto": 800000,
  "concepto": "Pago RUNT",
  "metodo_pago": "efectivo",
  "desglose_efectivo": {
    "billetes_100000": 8,
    "billetes_50000": 0,
    "billetes_20000": 0
  }
}
```

**Resultado:** ❌ **Error 400**
```
No hay suficientes denominaciones disponibles:
  - billetes de $100,000: solicita 8 pero solo hay 5 disponibles

Sugerencia de denominaciones disponibles:
  - 5 billetes de $100,000
  - 6 billetes de $50,000
```

**Total sugerido:** 5×$100k + 6×$50k = $500k + $300k = $800,000 ✅

---

### Caso 4: Imposible Componer el Monto ❌

**Inventario en Caja:**
```
billetes_100000: 5
billetes_50000: 2
Total: $600,000
```

**Egreso Solicitado:** $1,000,000

**Resultado:** ❌ **Error 400**
```
No hay suficientes denominaciones disponibles:
  - billetes de $100,000: solicita 10 pero solo hay 5 disponibles

Sugerencia de denominaciones disponibles:
No es posible componer $1,000,000 con las denominaciones disponibles. Faltan $400,000.
```

## Beneficios

1. **Control Real de Inventario:** El sistema ahora refleja el inventario físico real de la caja
2. **Prevención de Errores:** No se pueden registrar egresos con billetes que no existen
3. **Guía al Usuario:** El sistema sugiere cómo componer el monto con lo disponible
4. **Trazabilidad:** Cada denominación se rastrea individualmente
5. **Auditoría Precisa:** Los reportes de desglose son confiables

## Notas Técnicas

- La validación solo aplica para **egresos en efectivo**
- Los ingresos NO requieren validación (agregan denominaciones nuevas)
- La sugerencia usa algoritmo greedy (denominaciones grandes primero)
- El cálculo de inventario es en tiempo real (consulta BD cada vez)

## Próximos Pasos Recomendados

1. Probar la funcionalidad con datos reales
2. Crear endpoint para consultar inventario de denominaciones
3. Agregar reporte de denominaciones en dashboard
4. Considerar alertas cuando falten denominaciones específicas
