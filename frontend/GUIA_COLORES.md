# 🎨 Guía de Colores - CDA LA FLORIDA

**Actualización:** 29 de Diciembre de 2024  
**Basado en:** Logo oficial CDA La Florida

---

## 🎯 **PALETA DE COLORES**

### **Primary - Azul Navy (del logo)**
Color principal para elementos importantes y estructura.

```css
primary-50:  #e8eaf6  /* Azul muy claro - Fondos sutiles */
primary-100: #c5cae9  /* Azul lavanda - Hover states */
primary-200: #9fa8da  /* Azul claro - Bordes suaves */
primary-300: #7986cb  /* Azul medio - Elementos secundarios */
primary-400: #3949ab  /* Azul vibrante - Estados activos */
primary-500: #0a1d3d  /* ⭐ NAVY DEL LOGO - Botones principales */
primary-600: #081628  /* Navy oscuro - Hover en botones */
primary-700: #061019  /* Navy muy oscuro - Sidebar/Header */
primary-800: #040b0f  /* Casi negro azulado - Textos importantes */
primary-900: #020507  /* Negro azulado - Textos oscuros */
```

### **Secondary - Amarillo Dorado (del logo)**
Color de acento para destacar elementos importantes.

```css
secondary-50:  #fffbeb  /* Amarillo muy claro - Fondos de alertas */
secondary-100: #fef3c7  /* Amarillo pastel - Hover suave */
secondary-200: #fde68a  /* Amarillo suave - Bordes destacados */
secondary-300: #fcd34d  /* Amarillo medio - Badges */
secondary-400: #fbbf24  /* Amarillo vibrante - Highlights */
secondary-500: #f59e0b  /* ⭐ DORADO DEL LOGO - Acentos principales */
secondary-600: #d97706  /* Dorado oscuro - Hover en acentos */
secondary-700: #b45309  /* Ámbar - Estados de alerta */
secondary-800: #92400e  /* Ámbar oscuro - Textos sobre amarillo */
secondary-900: #78350f  /* Ámbar muy oscuro - Contraste fuerte */
```

---

## 📋 **GUÍA DE USO**

### **🔵 Primary (Azul Navy) - Úsalo para:**

#### **Estructura principal:**
- ✅ Sidebar/Menú lateral: `bg-primary-700` o `bg-primary-800`
- ✅ Header/Navbar: `bg-primary-600` o `bg-primary-700`
- ✅ Footer: `bg-primary-800`

#### **Botones primarios:**
```tsx
// Botón principal
className="bg-primary-600 hover:bg-primary-700 text-white"

// Botón outline
className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
```

#### **Títulos y encabezados:**
```tsx
<h1 className="text-primary-900">Título Principal</h1>
<h2 className="text-primary-800">Subtítulo</h2>
<h3 className="text-primary-700">Sección</h3>
```

#### **Cards y tarjetas:**
```tsx
// Header de card
<div className="bg-primary-600 text-white p-4">

// Card con borde
<div className="border-2 border-primary-300">
```

---

### **🟡 Secondary (Amarillo Dorado) - Úsalo para:**

#### **Badges y etiquetas de estado:**
```tsx
// Estado activo/aprobado
<span className="bg-secondary-500 text-white px-3 py-1 rounded">
  Activo
</span>

// Estado pendiente
<span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded">
  Pendiente
</span>
```

#### **Botones de acción secundaria:**
```tsx
// Botón de acento
className="bg-secondary-500 hover:bg-secondary-600 text-white"

// Botón outline dorado
className="border-2 border-secondary-500 text-secondary-700 hover:bg-secondary-50"
```

#### **Highlights y elementos destacados:**
```tsx
// Highlight de texto importante
<span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded">
  ¡Importante!
</span>

// Borde destacado
<div className="border-l-4 border-secondary-500 bg-secondary-50 p-4">
```

#### **Iconos de atención:**
```tsx
<AlertTriangle className="text-secondary-500 w-6 h-6" />
<Star className="text-secondary-400 w-5 h-5" />
```

---

## 🎨 **COMBINACIONES RECOMENDADAS**

### **Combinación 1: Hero Section**
```tsx
<div className="bg-primary-700 text-white">
  <h1 className="text-4xl font-bold">
    CDA La Florida
  </h1>
  <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3">
    Comenzar
  </button>
</div>
```

### **Combinación 2: Card con acento**
```tsx
<div className="bg-white border-2 border-primary-200 rounded-lg overflow-hidden">
  <div className="bg-primary-600 text-white p-4">
    <h3 className="font-bold">Título</h3>
  </div>
  <div className="p-4">
    <p className="text-gray-700">Contenido...</p>
    <span className="inline-block bg-secondary-100 text-secondary-800 px-3 py-1 rounded mt-2">
      Estado
    </span>
  </div>
</div>
```

### **Combinación 3: Alerta importante**
```tsx
<div className="bg-secondary-50 border-l-4 border-secondary-500 p-4">
  <div className="flex items-center gap-2">
    <AlertTriangle className="text-secondary-600 w-5 h-5" />
    <p className="text-secondary-900 font-semibold">
      Atención: Acción requerida
    </p>
  </div>
</div>
```

### **Combinación 4: Sidebar**
```tsx
<aside className="bg-primary-800 text-white h-screen">
  <div className="bg-primary-900 p-4">
    <h2 className="font-bold">CDA La Florida</h2>
  </div>
  <nav>
    <a className="flex items-center gap-2 p-3 hover:bg-primary-700 border-l-4 border-transparent hover:border-secondary-500">
      <Home className="w-5 h-5" />
      Dashboard
    </a>
  </nav>
</aside>
```

---

## ⚠️ **COLORES DE SISTEMA (Mantener originales)**

### **Verde - Solo para éxito/confirmación**
```tsx
// Mensajes de éxito
className="bg-green-100 text-green-800"
className="bg-green-600 text-white" // Botones de guardar

// Ejemplos
<CheckCircle className="text-green-600" />
"Operación exitosa"
```

### **Rojo - Solo para errores/peligro**
```tsx
// Mensajes de error
className="bg-red-100 text-red-800"
className="bg-red-600 text-white" // Botones de eliminar

// Ejemplos
<XCircle className="text-red-600" />
"Error en la operación"
```

### **Amarillo (System) - Solo para advertencias**
```tsx
// Advertencias (diferente del secondary)
className="bg-yellow-100 text-yellow-800"

// Ejemplo
<AlertTriangle className="text-yellow-600" />
"Precaución requerida"
```

### **Azul (System) - Solo para información**
```tsx
// Mensajes informativos (diferente del primary)
className="bg-blue-100 text-blue-800"

// Ejemplo
<Info className="text-blue-600" />
"Información adicional"
```

---

## 🚫 **QUÉ NO HACER**

❌ **NO usar primary para estados de éxito** → Usa verde  
❌ **NO usar secondary para errores** → Usa rojo  
❌ **NO mezclar demasiados colores** → Máximo 3 colores por componente  
❌ **NO usar tonos muy claros para texto** → Mínimo primary-700 o secondary-800  
❌ **NO poner texto oscuro sobre fondos oscuros** → Verificar contraste  

---

## ✅ **MEJORES PRÁCTICAS**

### **Contraste y accesibilidad:**
1. ✅ Texto sobre primary-500+: usar `text-white`
2. ✅ Texto sobre primary-50 a 400: usar `text-primary-900`
3. ✅ Texto sobre secondary-500+: usar `text-white`
4. ✅ Texto sobre secondary-50 a 400: usar `text-secondary-900`

### **Jerarquía visual:**
1. **Primario:** Azul navy para elementos principales
2. **Secundario:** Amarillo dorado para destacar
3. **Terciario:** Grises para información adicional
4. **Sistema:** Verde/Rojo/Amarillo para feedback

### **Hover effects:**
```tsx
// Botón primary
hover:bg-primary-700  // Un tono más oscuro

// Botón secondary
hover:bg-secondary-600  // Un tono más oscuro

// Link
hover:text-primary-600 hover:underline
```

---

## 🎯 **EJEMPLOS DE COMPONENTES**

### **Botón Primary (Azul Navy)**
```tsx
<button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors">
  Acción Principal
</button>
```

### **Botón Secondary (Amarillo Dorado)**
```tsx
<button className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors">
  Destacar Acción
</button>
```

### **Badge de estado (Amarillo)**
```tsx
<span className="inline-flex items-center gap-1 bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-bold">
  <CheckCircle className="w-4 h-4" />
  Activo
</span>
```

### **Card con header (Azul Navy)**
```tsx
<div className="bg-white rounded-lg shadow-lg overflow-hidden border border-primary-200">
  <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
    <h3 className="font-bold text-lg">Título de Card</h3>
    <span className="bg-secondary-500 text-white px-2 py-1 rounded text-xs">
      Nuevo
    </span>
  </div>
  <div className="p-6">
    <p className="text-gray-700">Contenido del card...</p>
  </div>
</div>
```

---

## 📊 **MIGRACIÓN DE COLORES ANTERIORES**

Si encuentras código con la paleta anterior (cyan/sky blue), reemplaza así:

```tsx
// ANTES (Cyan/Sky Blue)
bg-primary-600  → Azul cyan claro

// DESPUÉS (Navy)
bg-primary-600  → Azul navy oscuro ✅

// Si necesitas un azul más claro, usa:
bg-primary-400  → Azul vibrante
bg-primary-300  → Azul medio
```

**Nota:** La mayoría de componentes ya usan `bg-primary-600`, así que automáticamente se actualizarán al azul navy del logo.

---

## 🔍 **VERIFICACIÓN VISUAL**

Después de aplicar los colores, verifica:
- ✅ Contraste suficiente (mínimo 4.5:1 para texto)
- ✅ Los colores reflejan la identidad del logo
- ✅ Elementos importantes destacan con secondary (dorado)
- ✅ Botones de acción primaria son azul navy
- ✅ Estados de sistema usan colores apropiados (verde/rojo)

---

**Colores principales:**
- 🔵 **Primary:** `#0a1d3d` (Navy del logo)
- 🟡 **Secondary:** `#f59e0b` (Dorado del logo)

**Última actualización:** 29 de Diciembre de 2024  
**Estado:** ✅ Activo
