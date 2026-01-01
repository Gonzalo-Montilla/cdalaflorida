# Estado Actual - Comprobantes de Egreso

## Fecha
Diciembre 31, 2024 - 20:00

## Resumen
Se implementó el sistema de comprobantes de egreso en PDF pero tiene problemas de CORS al descargar desde el frontend.

## Lo que SÍ funciona

### Backend ✅
- `reportlab` instalado correctamente
- Función `generar_comprobante_egreso()` en `app/utils/comprobantes.py` - **FUNCIONA** (probado con script de prueba)
- Endpoint `/tesoreria/movimientos/{id}/comprobante` creado
- Genera PDFs profesionales con:
  - Encabezado con número y fecha
  - Beneficiario y concepto
  - Monto destacado en rojo
  - Desglose de efectivo (si aplica)
  - Espacios para firmas

### Frontend ✅ (parcialmente)
- Campo "Beneficiario" agregado al formulario de egreso
- Concepto se construye automáticamente: `Beneficiario - Concepto`
- Bot botón "Comprobante" visible en egresos del historial

## El Problema 🔴

**CORS Policy** está bloqueando la descarga del PDF desde el navegador:

```
Access to fetch at 'http://localhost:8000/api/v1/tesoreria/movimientos/.../comprobante' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**También hay un error 500** en el backend al intentar generar el PDF para algunos movimientos.

## Soluciones Intentadas (no funcionaron)

1. ❌ Usar `axios` con `responseType: 'blob'`  
2. ❌ Usar `fetch` API con token manual
3. ❌ Agregar token como query parameter
4. ❌ Crear formulario POST temporal

## Solución Recomendada para Mañana

### Opción 1: Endpoint sin autenticación para PDFs (más simple)

Crear un endpoint alternativo que no requiera autenticación pero use un token temporal:

**Backend:**
```python
@router.get("/movimientos/{movimiento_id}/comprobante/download/{temp_token}")
def descargar_comprobante_publico(
    movimiento_id: str,
    temp_token: str,
    db: Session = Depends(get_db)
):
    # Validar temp_token (expira en 1 minuto)
    # Generar y retornar PDF
```

**Frontend:**
```typescript
// 1. Solicitar token temporal
const { temp_token } = await apiClient.get(`/tesoreria/movimientos/${id}/comprobante/token`);

// 2. Abrir en nueva pestaña
window.open(`${API_URL}/tesoreria/movimientos/${id}/comprobante/download/${temp_token}`);
```

### Opción 2: Proxy en el frontend (más complejo)

Configurar Vite para hacer proxy de las peticiones PDF:

**vite.config.ts:**
```typescript
server: {
  proxy: {
    '/api/pdf': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/pdf/, '/api/v1')
    }
  }
}
```

### Opción 3: Usar iframe oculto (workaround)

**Frontend:**
```typescript
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = `${API_URL}/tesoreria/movimientos/${id}/comprobante`;
document.body.appendChild(iframe);
```

## Archivos Modificados Hoy

### Backend
- ✅ `app/utils/comprobantes.py` - Creado
- ✅ `app/api/v1/endpoints/tesoreria.py` - Endpoint agregado (líneas 476-571)
- ✅ `requirements.txt` - Ya tenía reportlab

### Frontend  
- ✅ `src/api/tesoreria.ts` - Función `descargarComprobanteEgreso()` agregada
- ✅ `src/pages/Tesoreria.tsx` - Campo beneficiario + botón comprobante

## Debug Info

### Logs importantes del navegador:
```
Token encontrado: SÍ
Keys en localStorage: ['refresh_token', 'access_token']
CORS policy: No 'Access-Control-Allow-Origin' header
Error 500 (Internal Server Error)
```

### Configuración CORS actual (main.py):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)
```

## Próximos Pasos (Para Mañana)

1. **Revisar logs del backend** cuando se hace clic en el botón para ver el error 500
2. **Implementar Opción 1** (endpoint con token temporal) - **RECOMENDADO**
3. **Probar** que el PDF se descarga correctamente
4. **Limpiar código** de debug (console.log)
5. **Documentar** funcionamiento final

## Notas Adicionales

- El módulo de Tesorería ya tiene:
  - ✅ Desglose de efectivo obligatorio para movimientos en efectivo
  - ✅ Validación correcta de denominaciones
  - ✅ Lógica de inventario de billetes/monedas correcta
  
- La paleta de colores CDA La Florida está completa:
  - Primary: Azul marino (#0a1d3d)
  - Secondary: Amarillo dorado (#f59e0b)

## Comando para reiniciar backend
```bash
cd backend
uvicorn app.main:app --reload
```

## Comando para reiniciar frontend  
```bash
cd frontend
npm run dev
```

## Testing
Una vez funcionando, probar con:
1. Egreso en efectivo con desglose
2. Egreso con transferencia
3. Egreso con cheque
4. Verificar que PDF incluya toda la información correcta
