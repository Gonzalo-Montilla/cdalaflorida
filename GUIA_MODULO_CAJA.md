# 📦 Guía del Módulo de Caja - CDA LA FLORIDA

## ✅ Estado Actual: FUNCIONAL

### 🔧 Bug Corregido
- ✅ **Fix en `obtener_detalle_caja`**: Ahora retorna correctamente el objeto `CajaResponse` dentro de `CajaDetalle`

---

## 📋 **FLUJO CORRECTO DE USO**

### 1. **Apertura de Caja** (`POST /api/v1/cajas/abrir`)
```json
{
  "monto_inicial": 50000,
  "turno": "mañana"
}
```
**Validaciones automáticas:**
- ✅ No permite abrir si ya tiene una caja abierta
- ✅ Registra en auditoría con timestamp y usuario
- ✅ Solo usuarios con rol `cajero` o `administrador`

**Turnos válidos:** `"mañana"`, `"tarde"`, `"noche"`

---

### 2. **Durante el Turno**

#### **Cobrar Vehículos** (módulo de vehículos)
Los cobros se registran automáticamente en la caja activa:
- Efectivo → Ingresa a caja física
- Tarjetas/Transferencias → NO ingresan a caja física
- CrediSmart → NO ingresa a caja física

#### **Registrar Gastos** (`POST /api/v1/cajas/movimientos`)
```json
{
  "tipo": "gasto",
  "monto": -10000,
  "concepto": "Compra de papelería",
  "metodo_pago": "efectivo",
  "ingresa_efectivo": false
}
```
**Tipos de movimiento:**
- `gasto`: Gastos operativos
- `devolucion`: Devoluciones a clientes
- `ajuste`: Correcciones de caja

**⚠️ Importante:** 
- Egresos SIEMPRE con monto negativo
- `ingresa_efectivo: false` para egresos (sale de caja)
- Concepto mínimo 5 caracteres

---

### 3. **Monitoreo en Tiempo Real**

#### **Ver Caja Activa** (`GET /api/v1/cajas/activa`)
Retorna la caja abierta del usuario actual

#### **Resumen Pre-Cierre** (`GET /api/v1/cajas/activa/resumen`)
Muestra:
- ✅ Monto inicial
- ✅ Total ingresos (todos los métodos)
- ✅ Total ingresos en efectivo
- ✅ Total egresos
- ✅ **Saldo esperado en caja física**
- ✅ Desglose por método de pago
- ✅ Desglose por concepto (RTM, SOAT)
- ✅ Cantidad de vehículos cobrados

---

### 4. **Cierre de Caja** (`POST /api/v1/cajas/cerrar`)
```json
{
  "monto_final_fisico": 235000,
  "observaciones_cierre": "Caja cuadrada"
}
```

**Cálculos automáticos:**
- `monto_final_sistema` = Saldo esperado (calculado)
- `diferencia` = monto_final_fisico - monto_final_sistema

**Interpretación de diferencias:**
- `diferencia = 0` → ✅ Caja cuadrada
- `diferencia > 0` → ⚠️ Sobrante
- `diferencia < 0` → 🚨 Faltante

**⚠️ Validaciones del Frontend:**
- Si hay vehículos pendientes → Advertencia
- Si diferencia > $20,000 → Requiere observaciones (mín 10 caracteres)
- Confirmación final

---

## 🎯 **MEJORES PRÁCTICAS**

### ✅ **DO's (Hacer)**
1. ✅ **Abrir caja al inicio del turno** con el monto inicial correcto
2. ✅ **Registrar gastos inmediatamente** cuando ocurren
3. ✅ **Usar el concepto correcto** en cada movimiento
4. ✅ **Marcar correctamente** si el pago ingresa a caja física
5. ✅ **Verificar resumen** antes de cerrar caja
6. ✅ **Contar efectivo físico** con cuidado antes del cierre
7. ✅ **Agregar observaciones** en cierres con diferencias
8. ✅ **Cobrar todos los vehículos** antes de cerrar

### ❌ **DON'Ts (NO Hacer)**
1. ❌ **NO cerrar sin verificar** vehículos pendientes
2. ❌ **NO registrar gastos** con monto positivo
3. ❌ **NO olvidar** el `ingresa_efectivo` correcto
4. ❌ **NO cerrar con diferencias grandes** sin explicación
5. ❌ **NO abrir múltiples cajas** para el mismo usuario
6. ❌ **NO registrar movimientos** sin caja abierta

---

## 📊 **CONCEPTOS CLAVE**

### **Saldo Esperado en Caja**
```
Saldo Esperado = Monto Inicial + Ingresos Efectivo - Egresos
```

**Solo cuenta:**
- ✅ Efectivo inicial
- ✅ Cobros en efectivo
- ✅ Gastos en efectivo

**NO cuenta:**
- ❌ Tarjetas (débito/crédito)
- ❌ Transferencias
- ❌ CrediSmart

### **Diferencia de Caja**
```
Diferencia = Efectivo Contado - Saldo Esperado
```

**Casos comunes:**
- `$0` → Perfecto, caja cuadrada
- `+$1000 a +$5000` → Posible error de conteo, revisar
- `-$1000 a -$5000` → Posible error de conteo, revisar
- `> $10000` → Error grave, investigar
- `< -$10000` → Faltante crítico, investigar urgente

---

## 🔍 **ENDPOINTS DISPONIBLES**

### **Operación Básica**
- `POST /api/v1/cajas/abrir` - Abrir caja
- `GET /api/v1/cajas/activa` - Ver caja activa
- `GET /api/v1/cajas/activa/resumen` - Resumen pre-cierre
- `POST /api/v1/cajas/cerrar` - Cerrar caja

### **Movimientos**
- `POST /api/v1/cajas/movimientos` - Crear gasto/ajuste
- `GET /api/v1/cajas/movimientos` - Listar movimientos de caja activa

### **Consultas**
- `GET /api/v1/cajas/vehiculos-por-metodo` - Vehículos agrupados por método de pago
- `GET /api/v1/cajas/ultima-cerrada` - Info de la última caja cerrada
- `GET /api/v1/cajas/historial?limit=10` - Historial de cajas
- `GET /api/v1/cajas/{caja_id}/detalle` - Detalle completo de una caja específica

---

## 🐛 **PROBLEMAS CONOCIDOS Y SOLUCIONES**

### **1. "No tienes una caja abierta"**
**Causa:** Intentando operar sin caja abierta
**Solución:** Ir a Caja → Abrir Caja

### **2. "Ya tienes una caja abierta"**
**Causa:** Intentando abrir segunda caja
**Solución:** Cerrar la caja actual primero

### **3. Diferencia inexplicable en cierre**
**Posibles causas:**
- Error al contar efectivo físico
- Gasto no registrado
- Cobro registrado incorrectamente (efectivo vs tarjeta)
- Cambio dado incorrectamente

**Solución:** 
1. Revisar todos los movimientos de la caja
2. Verificar métodos de pago de cada vehículo
3. Recontar efectivo físico
4. Documentar en observaciones

### **4. Frontend no muestra logo en PDFs**
**Causa:** Logo no cargó correctamente
**Solución:** El PDF se genera sin logo, pero funcional

---

## 📈 **REPORTES Y AUDITORÍA**

### **Trazabilidad Completa**
Cada operación registra:
- ✅ Usuario que ejecutó la acción
- ✅ Timestamp exacto
- ✅ IP de origen
- ✅ Metadata de la operación

### **Consultar Auditoría**
Ver logs en la tabla `audit_logs` con:
- `action = 'OPEN_CAJA'` - Aperturas
- `action = 'CLOSE_CAJA'` - Cierres
- `action = 'REGISTER_GASTO'` - Gastos
- `action = 'REGISTER_INGRESO_EXTRA'` - Ingresos extras

---

## 🔐 **SEGURIDAD**

### **Permisos por Rol**
- **Cajero:** Puede abrir/cerrar su propia caja, cobrar, registrar gastos
- **Administrador:** Puede todo + ver historial de todos los cajeros

### **Validaciones de Negocio**
1. ✅ Un usuario solo puede tener UNA caja abierta
2. ✅ No se puede operar sin caja abierta
3. ✅ Solo el dueño de la caja puede operarla
4. ✅ Administradores pueden ver cualquier caja

---

## 💡 **TIPS PARA CAJEROS**

1. **Al abrir turno:**
   - Contar efectivo inicial con testigo
   - Registrar monto exacto
   - Verificar que la caja se abrió correctamente

2. **Durante el turno:**
   - Registrar gastos INMEDIATAMENTE
   - Verificar método de pago en cada cobro
   - Mantener efectivo organizado por denominación

3. **Antes de cerrar:**
   - Cobrar todos los vehículos pendientes
   - Verificar que no haya gastos sin registrar
   - Revisar el resumen pre-cierre
   - Contar efectivo 2 veces

4. **Al cerrar:**
   - Si hay diferencia, explicarla en observaciones
   - Si la diferencia es grande (>$20k), avisar al supervisor
   - Verificar que el cierre se procesó correctamente

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. Revisar esta guía primero
2. Verificar los logs de auditoría
3. Consultar con el supervisor
4. Reportar bug al desarrollador

---

**Última actualización:** 29 de Diciembre de 2024
**Versión del módulo:** 1.0
**Estado:** ✅ Producción
