# 🚗 PLAN: Implementar Múltiples Tipos de Vehículos - CDA La Florida

**Fecha:** 28 de Diciembre 2024  
**Estado:** En Análisis - Pendiente Implementación  
**Proyecto:** CDA La Florida (clonado de CDA Piendamó)

---

## 📋 CONTEXTO

### Situación Actual
- **CDA Piendamó**: Solo atiende motocicletas (hardcoded)
- **CDA La Florida**: Debe atender múltiples tipos de vehículos (motos, livianos, taxis, buses, camiones, etc.)
- Sistema actual calcula tarifas **solo por antigüedad**, sin considerar tipo de vehículo

### Problema Identificado
La tabla `tarifas` **NO tiene campo `tipo_vehiculo`**, por lo que:
- Todas las tarifas son iguales independiente del tipo de vehículo
- Frontend tiene el tipo hardcoded como "moto"
- No hay forma de diferenciar precios entre vehículos

---

## 🔍 ANÁLISIS TÉCNICO REALIZADO

### 1. Base de Datos

#### Tabla `tarifas` (NECESITA MODIFICACIÓN)
```sql
-- Estructura actual
- ano_vigencia INT
- vigencia_inicio DATE
- vigencia_fin DATE
- antiguedad_min INT
- antiguedad_max INT (nullable)
- valor_rtm DECIMAL
- valor_terceros DECIMAL
- valor_total DECIMAL
- activa BOOLEAN

❌ FALTA: tipo_vehiculo VARCHAR(50)
```

#### Tabla `comisiones_soat` (YA TIENE TIPO)
```sql
- tipo_vehiculo VARCHAR(50) ✅
- valor_comision DECIMAL
- vigencia_inicio DATE
- vigencia_fin DATE (nullable)
- activa BOOLEAN
```

#### Tabla `vehiculos_proceso`
```sql
- tipo_vehiculo VARCHAR(50) DEFAULT 'moto' ✅
- (resto de campos OK)
```

---

### 2. Backend - Archivos a Modificar

#### 📁 `app/models/tarifa.py`
**Cambio:** Agregar campo `tipo_vehiculo`
```python
tipo_vehiculo = Column(String(50), nullable=False, index=True)
```

#### 📁 `app/schemas/tarifa.py`
**Cambios:**
- `TarifaCreate`: Agregar campo `tipo_vehiculo`
- `TarifaResponse`: Agregar campo `tipo_vehiculo`
- Actualizar validaciones

#### 📁 `app/api/v1/endpoints/vehiculos.py`
**Función:** `calcular_tarifa_por_antiguedad()`
**Cambio:** Agregar filtro por `tipo_vehiculo`
```python
# Línea 29-52
def calcular_tarifa_por_antiguedad(ano_modelo: int, tipo_vehiculo: str, db: Session):
    # Agregar filtro: Tarifa.tipo_vehiculo == tipo_vehiculo
```

#### 📁 `app/api/v1/endpoints/tarifas.py`
**Cambios:**
- Endpoint `/vigentes`: Filtrar por tipo si se pasa parámetro
- Endpoint `/`: Crear tarifa con tipo_vehiculo
- Validación de conflictos debe incluir tipo_vehiculo

#### 📁 `app/db/database.py`
**Función:** `init_db()`
**Cambio:** Al crear tarifas iniciales, agregar tipo_vehiculo

---

### 3. Frontend - Archivos a Modificar

#### 📁 `src/pages/Recepcion.tsx`
**Línea 263:** Campo tipo_vehiculo hardcoded
```typescript
// ACTUAL (línea 263):
<input type="hidden" value="moto" />

// CAMBIAR A:
<select 
  value={formData.tipo_vehiculo}
  onChange={(e) => handleInputChange('tipo_vehiculo', e.target.value)}
  className="input-pos"
>
  <option value="moto">🏍️ Motocicleta</option>
  <option value="liviano">🚗 Liviano</option>
  <option value="taxi">🚕 Taxi</option>
  <!-- Agregar más tipos según datos del usuario -->
</select>
```

**Línea 276-313:** Datalist de marcas
- Actualmente: Solo marcas de motos
- Necesita: Marcas dinámicas según tipo seleccionado

#### 📁 `src/pages/Tarifas.tsx`
**Cambios:**
- Agregar filtro por tipo de vehículo en tabla
- Modal de crear tarifa: Agregar selector de tipo
- Modal de editar: Mostrar tipo de vehículo

#### 📁 `src/api/vehiculos.ts`
**Función:** `calcularTarifa()`
**Cambio:** Enviar tipo_vehiculo además del año

---

## 📊 DATOS PENDIENTES DEL USUARIO

Para continuar necesitamos:

### 1. Lista de Tipos de Vehículos
Ejemplo esperado:
- Motocicleta
- Liviano (particular)
- Taxi
- Camioneta
- Bus
- Camión
- Volqueta
- Tractocamión
- etc.

### 2. Tarifas por Tipo y Antigüedad
Formato esperado:
```
TIPO: Liviano
  - Año 2024-2025 (0-2 años): $XXX,XXX
  - Año 2022-2023 (3-7 años): $XXX,XXX
  - Año 2018-2021 (8-16 años): $XXX,XXX
  - Año 2017 o anterior (17+ años): $XXX,XXX

TIPO: Taxi
  - Año 2024-2025: $XXX,XXX
  - ...

(Repetir para cada tipo)
```

### 3. Comisiones SOAT (Opcional)
¿Son las mismas para todos los tipos o varían?
- Moto: $30,000
- Carro/Liviano: $50,000
- Bus: $XX,XXX
- etc.

---

## 🔧 PLAN DE IMPLEMENTACIÓN

### Fase 1: Migración de Base de Datos
1. Crear script SQL para agregar columna `tipo_vehiculo` a tabla `tarifas`
2. Actualizar tarifas existentes (motos) con tipo_vehiculo = 'moto'
3. Agregar índice en la columna nueva

### Fase 2: Backend
1. Actualizar modelo `Tarifa` (agregar campo)
2. Actualizar schemas de Pydantic
3. Modificar `calcular_tarifa_por_antiguedad()` para filtrar por tipo
4. Actualizar endpoints de tarifas
5. Modificar `init_db()` para crear tarifas con tipo

### Fase 3: Frontend
1. Cambiar input hidden por select visible en Recepción
2. Crear datalists de marcas por tipo de vehículo
3. Actualizar función calcularTarifa() para enviar tipo
4. Modificar módulo de Tarifas para incluir tipo
5. Agregar iconos dinámicos según tipo

### Fase 4: Datos Iniciales
1. Crear script para insertar todas las tarifas de La Florida
2. Actualizar comisiones SOAT si es necesario
3. Probar flujo completo de registro

### Fase 5: Testing
1. Probar registro de cada tipo de vehículo
2. Verificar cálculo correcto de tarifas
3. Probar comisiones SOAT por tipo
4. Validar PDFs y reportes

---

## 📝 NOTAS IMPORTANTES

### Compatibilidad
- Los cambios son **retrocompatibles** con registros existentes
- Vehículos ya registrados mantendrán su tipo actual
- La migración es **aditiva**, no destructiva

### Rendimiento
- Agregar índice en `tipo_vehiculo` para búsquedas rápidas
- Las queries de tarifas ya tienen índices en antigüedad

### UX/UI
- Iconos diferentes por tipo (🏍️ moto, 🚗 carro, 🚕 taxi, 🚌 bus, 🚚 camión)
- Colores distintivos por categoría
- Autocompletado de marcas según tipo

---

## ✅ PROGRESO ACTUAL

### Completado ✅
- [x] Análisis completo del sistema de tarifas
- [x] Análisis del módulo de recepción
- [x] Identificación de todos los archivos a modificar
- [x] Rebrand completo a CDA La Florida
- [x] Base de datos `cda_la_florida` creada
- [x] Sistema funcionando con usuario admin

### Pendiente ⏳
- [ ] Recibir datos de tipos de vehículos del usuario
- [ ] Recibir tarifas detalladas por tipo y antigüedad
- [ ] Implementar cambios en base de datos
- [ ] Actualizar backend
- [ ] Actualizar frontend
- [ ] Cargar datos iniciales
- [ ] Testing completo

---

## 🚀 PRÓXIMOS PASOS (MAÑANA)

1. **Usuario proporciona datos** de tipos de vehículos y tarifas
2. **Crear script de migración** SQL
3. **Implementar cambios** siguiendo el plan de las 5 fases
4. **Cargar datos iniciales** de todas las tarifas
5. **Probar sistema completo** con diferentes tipos

---

**Preparado por:** AI Assistant  
**Última actualización:** 2024-12-28 20:48
