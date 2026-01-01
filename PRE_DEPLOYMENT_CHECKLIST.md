# ✅ CHECKLIST PRE-DEPLOYMENT A PRODUCCIÓN

## Fecha de preparación: 2025
## Servidor: VPS Hostinger 31.97.144.9

---

## 🔴 PROBLEMAS IDENTIFICADOS Y CORREGIDOS

### 1. ✅ Validación de campos numéricos (`step` attribute)

**Problema anterior:**
- Los campos con `step="1000"` causaban errores de validación del navegador
- Error mostrado: "introduce un valor valido, los dos valores mas aproximados son X y Y"
- Esto impedía que los usuarios pudieran guardar valores

**Archivos corregidos:**
- ✅ `frontend/src/pages/Caja.tsx` - línea 476 (Monto Inicial)
- ✅ `frontend/src/pages/Caja.tsx` - línea 1418 (Monto de Gasto)
- ✅ `frontend/src/pages/Caja.tsx` - línea 2024 (Arqueo de Efectivo)
- ✅ `frontend/src/pages/Caja.tsx` - línea 2448 (Valor SOAT comercial) - ya estaba correcto
- ✅ `frontend/src/pages/Tesoreria.tsx` - línea 642 (Monto de movimiento)
- ✅ `frontend/src/pages/Tarifas.tsx` - líneas 413, 430, 446, 556, 572, 587, 907 - ya estaban correctos

**Solución aplicada:**
Todos los campos numéricos ahora usan `step="any"` en lugar de `step="1000"` o `step="1"`

---

### 2. ⚠️ Comisiones SOAT en Base de Datos de Producción

**Funcionalidad implementada:**
- Comisión SOAT editable en módulo de Caja
- Venta SOAT independiente (sin RTM)
- PDF de recibo para ventas SOAT

**Requisito crítico:**
La tabla `comisiones_soat` debe existir en producción con estos valores:
```sql
tipo_vehiculo = 'moto'  → valor_comision = 30000
tipo_vehiculo = 'carro' → valor_comision = 50000
```

**Script de verificación creado:**
📄 `backend/scripts/verificar_comisiones_soat.sql`

---

## 📋 PASOS DE VERIFICACIÓN ANTES DE DEPLOYMENT

### Paso 1: Verificar Base de Datos de Producción

```bash
# Conectar a la base de datos de producción
ssh root@31.97.144.9
psql -U cda_user -d cda_la_florida_prod

# Ejecutar verificación
\i /ruta/al/script/verificar_comisiones_soat.sql
```

**Verificar que retorne:**
```
tipo_vehiculo | valor_comision | activa
--------------+----------------+--------
carro         | 50000          | true
moto          | 30000          | true
```

**Si no existen las comisiones**, el script las creará automáticamente.

---

### Paso 2: Build del Frontend

```bash
cd frontend
npm run build
```

**Verificar:**
- ✅ No hay errores de compilación
- ✅ No hay warnings de TypeScript críticos
- ✅ Build se completa exitosamente

---

### Paso 3: Verificar Backend

```bash
cd backend
python -m pytest tests/ -v
```

**Verificar:**
- ✅ Tests pasan correctamente
- ✅ No hay errores de importación

---

### Paso 4: Deployment a Producción

```bash
# 1. Subir código al servidor
rsync -avz --exclude='node_modules' --exclude='__pycache__' \
  frontend/dist/ root@31.97.144.9:/var/www/cda-la-florida/frontend/

rsync -avz --exclude='__pycache__' --exclude='*.pyc' \
  backend/ root@31.97.144.9:/var/www/cda-la-florida/backend/

# 2. Reiniciar servicios en el servidor
ssh root@31.97.144.9
systemctl restart cda-backend
systemctl restart nginx
```

---

### Paso 5: Pruebas Post-Deployment

#### 🧪 Test 1: Campos numéricos sin errores de validación
1. Abrir Caja con monto inicial: $50,000 ✅
2. Registrar gasto de: $12,500 ✅
3. Cerrar caja con arqueo: $37,500 ✅
4. Crear tarifa RTM con valores: $181,596 / $24,056 ✅
5. Registrar movimiento de tesorería: $100,000 ✅

**Resultado esperado:** Todos los valores se guardan sin errores de validación del navegador

---

#### 🧪 Test 2: Comisiones SOAT editables
1. Ir a módulo de Caja
2. Seleccionar vehículo con SOAT
3. En modal de cobro, verificar checkbox "Cliente pagará comisión SOAT"
4. Desmarcar checkbox ✅
5. Verificar que el total se reduce correctamente ✅
6. Confirmar cobro y verificar que se registra correctamente ✅

**Resultado esperado:** 
- Checkbox funciona correctamente
- Total se actualiza dinámicamente
- Registro de pago refleja la decisión del cajero

---

#### 🧪 Test 3: Venta SOAT independiente
1. Ir a módulo de Caja
2. Click en botón "Venta SOAT" (color teal) ✅
3. Llenar formulario:
   - Placa: ABC123
   - Tipo: Moto
   - Valor comercial SOAT: $500,000
   - Cliente: JUAN PEREZ
   - Documento: 1234567890
   - Método pago: Efectivo
4. Confirmar venta ✅
5. Verificar que se genera PDF automáticamente ✅

**Resultado esperado:**
- Modal abre correctamente
- Comisión se calcula automáticamente ($30K moto / $50K carro)
- PDF se genera y descarga automáticamente
- Movimiento de caja se registra correctamente
- Solo la comisión ($30K) ingresa a caja, no los $500K del SOAT

---

#### 🧪 Test 4: PDF de recibo de pago RTM
1. Ir a módulo de Caja
2. Seleccionar vehículo pendiente normal (con RTM)
3. Registrar pago completo
4. Verificar que se genera PDF de recibo automáticamente ✅

**Resultado esperado:**
- PDF se genera automáticamente después de confirmar el pago
- PDF contiene: placa, cliente, RTM desglosado, SOAT (si aplica), total, método pago, factura DIAN, fecha, cajero

---

## 🎯 FUNCIONALIDADES NUEVAS DESPLEGADAS

### ✅ Prioridad 1
- [x] Validación documento en Recepción: solo números, máximo 10 dígitos
- [x] Marcas de vehículos: menú desplegable con 23 marcas predefinidas
- [x] Factura DIAN obligatoria en Caja con checkbox
- [x] Validación de 4 registros (RUNT, SICOV, INDRA, Factura DIAN)

### ✅ Prioridad 2
- [x] Comisión SOAT editable en modal de cobro
- [x] Checkbox para que cajera decida si cliente paga SOAT
- [x] Actualización dinámica del total según checkbox

### ✅ Prioridad 3
- [x] Venta SOAT independiente (sin RTM)
- [x] Cálculo automático de comisión (moto $30K / carro $50K)
- [x] Registro de movimiento de caja solo con comisión
- [x] Generación automática de PDF para venta SOAT
- [x] Generación automática de PDF para pago RTM regular
- [x] Factura DIAN auto-uppercase

---

## ⚠️ NOTAS IMPORTANTES

1. **NO se modificó la estructura de la base de datos** - solo se verifican datos
2. **Todos los cambios son compatibles** con la versión actual en producción
3. **Los PDFs se generan en el navegador** - no requieren configuración adicional en servidor
4. **Las comisiones SOAT son configurables** desde el módulo de Tarifas
5. **Backup recomendado** antes del deployment:
   ```bash
   pg_dump -U cda_user cda_la_florida_prod > backup_pre_deployment_$(date +%Y%m%d).sql
   ```

---

## 🆘 ROLLBACK SI HAY PROBLEMAS

Si algo falla después del deployment:

```bash
# En el servidor
cd /var/www/cda-la-florida

# Restaurar frontend anterior
cp -r frontend.backup frontend/

# Restaurar backend anterior
cp -r backend.backup backend/

# Reiniciar servicios
systemctl restart cda-backend
systemctl restart nginx
```

---

## ✅ CONFIRMACIÓN FINAL

- [ ] Verificado comisiones SOAT en BD producción
- [ ] Build de frontend exitoso
- [ ] Tests de backend pasando
- [ ] Backup de base de datos realizado
- [ ] Código subido al servidor
- [ ] Servicios reiniciados
- [ ] Test 1 (validación campos) pasado
- [ ] Test 2 (comisiones editables) pasado
- [ ] Test 3 (venta SOAT) pasado
- [ ] Test 4 (PDF recibo RTM) pasado
- [ ] Sistema funcionando correctamente

---

**Preparado por:** AI Assistant
**Fecha:** $(date)
**Versión del sistema:** CDA La Florida v2.0
