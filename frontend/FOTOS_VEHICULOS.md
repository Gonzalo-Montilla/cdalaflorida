# Funcionalidad de Captura de Fotos de Vehículos

## 📸 Descripción

El módulo de Recepción incluye un componente para capturar fotos de los vehículos que ingresan a inspección. Esta funcionalidad es compatible con:

- **Celulares** (Android/iOS)
- **Tablets** (Android/iOS/Windows)
- **PC con Webcam**

## 🎯 Características

### Modos de Captura

1. **Cámara en Vivo**
   - Accede a la cámara del dispositivo
   - Vista previa en tiempo real
   - Botón de captura estilo móvil
   - En celulares/tablets: opción para cambiar entre cámara frontal y trasera
   - Contador de fotos restantes

2. **Subir desde Galería/Archivo**
   - Permite subir fotos ya existentes
   - Compatible con múltiples formatos (JPEG, PNG, etc.)
   - Soporte para selección múltiple

### Límites y Validaciones

- **Máximo de fotos**: 4 por vehículo
- **Formato**: Solo imágenes (JPEG, PNG, etc.)
- **Compresión**: Las fotos capturadas se comprimen a 80% calidad JPEG
- **Almacenamiento**: Base64 en memoria del navegador

## 🔧 Implementación Técnica

### Componente: `CapturaFotos.tsx`

```typescript
interface CapturaFotosProps {
  onFotosChange: (fotos: string[]) => void;
  maxFotos?: number;
}
```

### APIs Utilizadas

- **`getUserMedia()`**: Acceso a cámara del dispositivo
- **`FileReader`**: Lectura de archivos desde galería
- **Canvas API**: Captura de frames de video y conversión a imagen

### Permisos Necesarios

El navegador solicitará permisos de cámara al hacer clic en "📸 Cámara". El usuario debe:
1. Permitir el acceso a la cámara en el navegador
2. En HTTPS (producción), los permisos persisten
3. En HTTP (desarrollo local), se solicita cada vez

## 📱 Uso en Diferentes Dispositivos

### En Celular

1. **Opción 1 - Cámara directa**:
   - Toca "📸 Cámara"
   - El navegador abrirá la cámara trasera por defecto
   - Toca "🔄 Cambiar" para usar la cámara frontal
   - Toca el botón circular blanco para capturar
   - Repite hasta 4 fotos

2. **Opción 2 - Desde galería**:
   - Toca "📁 Galería"
   - Selecciona fotos existentes
   - Puedes seleccionar múltiples fotos a la vez

### En Tablet

- Funciona igual que en celular
- Pantalla más grande para mejor vista previa
- Cámara frontal y trasera disponibles

### En PC con Webcam

1. Clic en "📸 Cámara"
2. El navegador solicitará permiso para usar la webcam
3. Vista previa en pantalla completa
4. Clic en botón circular para capturar
5. La opción "🔄 Cambiar" no aplica (solo una cámara)

## 🚧 Estado Actual (Versión 1.0)

### ✅ Implementado

- Captura desde cámara en vivo
- Subir desde galería/archivo
- Vista previa de fotos
- Eliminar fotos individuales
- Cambio entre cámara frontal/trasera (móviles)
- Contador de fotos
- Validación de límite máximo
- Compresión automática

### ⏳ Pendiente (Futuras Versiones)

- **Almacenamiento en Backend**: Actualmente las fotos se guardan en Base64 en memoria del navegador. En una futura versión:
  - Se enviará al backend como archivos
  - Se almacenarán en servicio de storage (AWS S3, Cloudinary, etc.)
  - Se asociarán al registro del vehículo en la base de datos

- **Sincronización con Backend**:
  ```python
  # Modelo a agregar en backend/app/models/vehiculo.py
  fotos_urls = Column(ARRAY(String), default=[])  # URLs de fotos en storage
  ```

- **Funcionalidades adicionales**:
  - Zoom digital
  - Flash (si disponible en dispositivo)
  - Edición básica (rotar, recortar)
  - Marca de agua con timestamp y placa

## 💡 Buenas Prácticas

1. **Iluminación**: Capturar fotos con buena luz natural o artificial
2. **Ángulos recomendados**:
   - Vista frontal completa
   - Vista lateral derecha
   - Vista trasera (incluir placa)
   - Detalle de placa legible

3. **Cantidad**: No es obligatorio tomar las 4 fotos, pero se recomienda al menos 2
4. **Momento**: Capturar antes de que el vehículo pase a inspección

## 🔒 Privacidad y Seguridad

- Las fotos se mantienen en el navegador hasta que se envíe el formulario
- Al limpiar el formulario, todas las fotos se eliminan
- No se suben automáticamente sin consentimiento
- En producción (HTTPS), la comunicación con la cámara es segura

## 🐛 Solución de Problemas

### "No se pudo acceder a la cámara"

**Causas comunes**:
- Permisos de cámara bloqueados en el navegador
- Otra aplicación está usando la cámara
- El navegador no soporta `getUserMedia` (muy antiguo)

**Solución**:
1. Verificar permisos del navegador (ícono de cámara en barra de direcciones)
2. Cerrar otras apps que usen la cámara
3. Usar navegador moderno (Chrome, Firefox, Safari, Edge)

### "Botón Galería no funciona en PC"

- Es normal, el botón abre el explorador de archivos
- Selecciona imágenes desde tus carpetas

### Fotos se ven borrosas

- La cámara puede estar desenfocada
- Limpiar lente de cámara
- Mejorar iluminación
- Mantener el dispositivo estable al capturar

## 📊 Especificaciones Técnicas

- **Resolución ideal**: 1920x1080 (Full HD)
- **Formato de salida**: JPEG
- **Compresión**: 80% calidad
- **Tamaño aproximado**: 200-500 KB por foto (depende del contenido)
- **Formato interno**: Base64 (temporal)

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Autor**: Sistema CDA Piendamó
