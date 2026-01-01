# 🕐 Manejo de Fechas - Zona Horaria Colombia

## Problema
El backend devuelve fechas en formato UTC, pero necesitamos mostrarlas en hora de Colombia (UTC-5).

## Solución
Se creó el archivo `src/utils/formatDate.ts` con funciones que automáticamente convierten a zona horaria Colombia.

## 📚 Funciones Disponibles

### 1. `formatDateTime(date)`
Fecha completa con hora (formato largo)
```typescript
formatDateTime('2025-11-25T19:30:00Z')
// → "25 de noviembre de 2025, 2:30 PM"
```

### 2. `formatDateTimeShort(date)`
Fecha completa con hora (formato corto)
```typescript
formatDateTimeShort('2025-11-25T19:30:00Z')
// → "25/11/2025, 2:30 PM"
```

### 3. `formatDate(date)`
Solo fecha (formato largo)
```typescript
formatDate('2025-11-25T19:30:00Z')
// → "25 de noviembre de 2025"
```

### 4. `formatDateShort(date)`
Solo fecha (formato corto)
```typescript
formatDateShort('2025-11-25T19:30:00Z')
// → "25/11/2025"
```

### 5. `formatTime(date)`
Solo hora (12h con AM/PM)
```typescript
formatTime('2025-11-25T19:30:00Z')
// → "2:30 PM"
```

### 6. `formatTime24(date)`
Solo hora (formato 24h)
```typescript
formatTime24('2025-11-25T19:30:00Z')
// → "14:30"
```

### 7. `formatDateWithWeekday(date)`
Fecha con día de la semana
```typescript
formatDateWithWeekday('2025-11-25T19:30:00Z')
// → "lunes, 25 de noviembre de 2025"
```

### 8. `getNow()`
Obtiene la fecha/hora actual en Colombia
```typescript
const ahora = getNow();
// Date object con hora de Colombia
```

## 🔄 Cómo Reemplazar Código Existente

### ❌ ANTES (Incorrecto - muestra hora UTC)
```typescript
new Date(caja.fecha_apertura).toLocaleString('es-CO')
new Date(caja.fecha_apertura).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
```

### ✅ DESPUÉS (Correcto - muestra hora Colombia)
```typescript
import { formatDateTime, formatTime24 } from '../utils/formatDate';

formatDateTime(caja.fecha_apertura)
formatTime24(caja.fecha_apertura)
```

## 📝 Archivos Ya Actualizados

- ✅ `src/pages/Caja.tsx` - Parcialmente actualizado
- ⏳ `src/pages/Reportes.tsx` - Pendiente
- ⏳ `src/pages/Tesoreria.tsx` - Pendiente
- ⏳ `src/pages/Recepcion.tsx` - Pendiente
- ⏳ `src/pages/Usuarios.tsx` - Pendiente

## 🎯 Lugares Comunes a Actualizar

1. **Headers de módulos** - Hora de apertura de caja/turno
2. **Tablas** - Columnas de fecha/hora
3. **Historial** - Listados de movimientos
4. **Reportes** - Todos los timestamps
5. **PDFs** - Fechas en documentos generados

## 🚀 Próximos Pasos

Para actualizar otros módulos:

1. Importar las funciones necesarias:
```typescript
import { formatDateTime, formatTime24, formatDateShort } from '../utils/formatDate';
```

2. Buscar todas las ocurrencias de:
   - `toLocaleString`
   - `toLocaleDateString`
   - `toLocaleTimeString`

3. Reemplazar con las funciones apropiadas

## ⚠️ Importante

- **SIEMPRE** usar estas funciones para mostrar fechas al usuario
- **NO** usar `new Date().toLocaleString()` directamente
- Las funciones aceptan: `string` (ISO), `Date`, o `number` (timestamp)
