# Sistemas Externos - CDA Piendamó

## 🌐 Integraciones con Sistemas Externos

Después de cobrar un vehículo, la cajera debe registrar la inspección en **3 sistemas externos** del gobierno y entidad financiera.

---

## 1. RUNT (Registro Único Nacional de Tránsito)

**URL:**
```
https://b2crunt2prd.b2clogin.com/runtprologin.runt.gov.co/b2c_1a_singin/oauth2/v2.0/authorize?client_id=4e0d509e-3bb5-44b9-b712-53e221b97393&scope=https%3A%2F%2FB2Crunt2prd.onmicrosoft.com%2FRNFTransversalMS%2Faccess.all%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fruntpro.runt.gov.co%2F
```

**Propósito:**
- Registro oficial de la revisión técnico-mecánica
- Sistema del Ministerio de Transporte
- Obligatorio para generar certificado RTM válido

**Datos a registrar:**
- Placa del vehículo
- Resultado de la inspección (aprobado/rechazado)
- Certificado RTM

---

## 2. SICOV (Sistema de Control de Vehículos)

**URL:**
```
https://sicovindra.com:9093/
```

**Propósito:**
- Sistema de control y seguimiento de inspecciones
- Plataforma de INDRA para centros de diagnóstico
- Registro de trazabilidad

**Datos a registrar:**
- Información del vehículo
- Datos del propietario
- Detalles de la inspección realizada

---

## 3. INDRA Paynet

**URL:**
```
https://indra.paynet.com.co:14443/Login.aspx?ReturnUrl=%2fInformacionSeguridad.aspx
```

**Propósito:**
- Plataforma de pagos y gestión financiera
- Sistema de INDRA para procesar transacciones
- Registro de pagos del servicio

**Datos a registrar:**
- Información de cobro
- Método de pago
- Comprobante de transacción

---

## 📋 Flujo de Registro en Sistema CDA Piendamó

### Pantalla de Cobro (Cajera)

Después de cobrar, la cajera verá **3 botones/modals**:

```
┌────────────────────────────────────────────────────┐
│ REGISTROS EXTERNOS OBLIGATORIOS                    │
├────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 🏛️ RUNT - Ministerio de Transporte         │   │
│ │                                             │   │
│ │    [ABRIR RUNT] 🔗 (Modal/iframe)          │   │
│ │                                             │   │
│ │    [✓] Ya registré en RUNT                 │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 📋 SICOV - Control de Vehículos            │   │
│ │                                             │   │
│ │    [ABRIR SICOV] 🔗 (Modal/iframe)         │   │
│ │                                             │   │
│ │    [✓] Ya registré en SICOV                │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 💳 INDRA Paynet - Sistema de Pagos        │   │
│ │                                             │   │
│ │    [ABRIR INDRA] 🔗 (Modal/iframe)         │   │
│ │                                             │   │
│ │    [✓] Ya registré en INDRA                │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ⚠️ Debes marcar las 3 casillas para continuar     │
│                                                     │
│ [✅ CONFIRMAR PAGO] (Deshabilitado hasta         │
│                      marcar las 3)                 │
└────────────────────────────────────────────────────┘
```

---

## 🔧 Implementación Técnica

### Backend (Ya implementado)

1. **Modelo `VehiculoProceso`** incluye:
   ```python
   registrado_runt: bool
   registrado_sicov: bool
   registrado_indra: bool  # ✅ Nuevo
   ```

2. **Endpoint de configuración**:
   ```
   GET /api/v1/config/urls-externas
   ```
   Retorna:
   ```json
   {
     "runt_url": "https://...",
     "sicov_url": "https://...",
     "indra_url": "https://..."
   }
   ```

3. **Validación en cobro**:
   - El sistema guarda el estado de cada registro
   - Frontend puede validar que los 3 estén marcados

### Frontend (Por implementar)

```typescript
// Componente: RegistrosExternos
interface RegistrosExternosProps {
  vehiculo: Vehiculo;
  onComplete: (data: RegistrosData) => void;
}

// Estado de registros
const [registros, setRegistros] = useState({
  runt: false,
  sicov: false,
  indra: false
});

// URLs desde backend
const { data: urls } = useQuery('urls-externas', 
  () => api.get('/config/urls-externas')
);

// Modals para cada sistema
<Modal url={urls.runt_url} onClose={() => setRegistros({...registros, runt: true})} />
<Modal url={urls.sicov_url} onClose={() => setRegistros({...registros, sicov: true})} />
<Modal url={urls.indra_url} onClose={() => setRegistros({...registros, indra: true})} />

// Validación
const todosRegistrados = registros.runt && registros.sicov && registros.indra;
```

---

## ⚠️ Consideraciones Importantes

### Seguridad
- Las URLs son largas y contienen parámetros de autenticación
- Se almacenan en variables de entorno (no hardcodeadas)
- Cada sistema tiene su propio login

### Conectividad
- Requiere conexión a internet activa
- Los sistemas externos pueden estar temporalmente fuera de servicio
- El sistema CDA debe permitir marcar manualmente si es necesario

### Flujo Alternativo
Si un sistema externo está caído:
1. Cajera intenta abrir el sistema
2. Si falla, puede marcar manualmente con observación
3. Administrador puede revisar después en logs de auditoría

---

## 📊 Endpoints Backend

### Obtener URLs
```http
GET /api/v1/config/urls-externas
Authorization: Bearer {token}

Response:
{
  "runt_url": "https://b2crunt2prd.b2clogin.com/...",
  "sicov_url": "https://sicovindra.com:9093/",
  "indra_url": "https://indra.paynet.com.co:14443/..."
}
```

### Cobrar con Registros
```http
POST /api/v1/vehiculos/cobrar
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehiculo_id": "uuid",
  "metodo_pago": "efectivo",
  "tiene_soat": true,
  "registrado_runt": true,
  "registrado_sicov": true,
  "registrado_indra": true,
  "numero_factura_dian": "F-12345"
}
```

---

## ✅ Estado de Implementación

- ✅ Backend: URLs configuradas
- ✅ Backend: Campo `registrado_indra` agregado
- ✅ Backend: Endpoint de configuración
- ✅ Backend: Validación en cobro
- ⏳ Frontend: Modals con iframes
- ⏳ Frontend: Checkboxes de confirmación
- ⏳ Frontend: Validación de 3 registros

---

**Última actualización**: 13 de Noviembre 2025
