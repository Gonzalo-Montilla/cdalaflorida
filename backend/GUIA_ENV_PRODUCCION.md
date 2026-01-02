# Guía de Variables de Entorno para Producción

## 📋 Checklist de Configuración

Antes de deployar a producción, asegúrate de configurar correctamente todas las variables de entorno en el VPS de Hostinger.

---

## 🔐 Variables Críticas de Seguridad

### SECRET_KEY
**Descripción:** Clave secreta para firmar tokens JWT  
**Requerido:** ✅ SÍ  
**Valor actual:** ❌ Debe generarse única para producción

**Generar nueva clave:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

**Ejemplo de output:**
```
xPz9kL3mN7qR2tS5vW8yA1bC4dE6fG9hI0jK3lM6nO9pQ2rS5tU8vW1xY4zA7bC
```

**Configurar en .env:**
```bash
SECRET_KEY=tu_clave_generada_aqui
```

---

### DATABASE_URL
**Descripción:** URL de conexión a PostgreSQL  
**Requerido:** ✅ SÍ  
**Formato:** `postgresql://usuario:password@host:puerto/database`

**Recomendaciones de Seguridad:**
- ❌ NO usar usuario `postgres`
- ✅ Crear usuario específico: `cda_app_user`
- ✅ Password fuerte (mínimo 16 caracteres, alfanumérico + símbolos)
- ✅ Considerar puerto no estándar (diferente a 5432)

**Crear usuario en PostgreSQL:**
```sql
-- Conectar como postgres
psql -U postgres

-- Crear base de datos
CREATE DATABASE cda_laflorida_prod;

-- Crear usuario con password fuerte
CREATE USER cda_app_user WITH ENCRYPTED PASSWORD 'TuPasswordSeguroAqui123!@#';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE cda_laflorida_prod TO cda_app_user;
GRANT ALL ON SCHEMA public TO cda_app_user;
```

**Configurar en .env:**
```bash
DATABASE_URL=postgresql://cda_app_user:TuPasswordSeguroAqui123!@#@localhost:5432/cda_laflorida_prod
```

---

### BACKEND_CORS_ORIGINS
**Descripción:** Dominios permitidos para hacer requests al backend  
**Requerido:** ✅ SÍ  
**Valor actual:** ⚠️ `["*"]` (permite todos - INSEGURO para producción)

**Configurar en .env:**
```bash
# Si tu dominio es cdalaflorida.com
BACKEND_CORS_ORIGINS=["https://cdalaflorida.com","https://www.cdalaflorida.com"]

# Si usas subdominios
BACKEND_CORS_ORIGINS=["https://app.cdalaflorida.com"]

# Desarrollo local + Producción (durante testing)
BACKEND_CORS_ORIGINS=["https://cdalaflorida.com","http://localhost:5173"]
```

---

## 📧 Configuración SMTP (Email)

### SMTP_HOST
**Descripción:** Servidor SMTP para envío de emails  
**Requerido:** ⚠️ Recomendado (para recuperación de contraseña)  
**Valor por defecto:** `smtp.gmail.com`

### SMTP_PORT
**Descripción:** Puerto SMTP  
**Requerido:** ⚠️ Recomendado  
**Valor por defecto:** `587` (TLS)

### SMTP_USER
**Descripción:** Email de Gmail para enviar correos  
**Requerido:** ⚠️ Recomendado  
**Formato:** `tucorreo@gmail.com`

### SMTP_PASSWORD
**Descripción:** Contraseña de aplicación de Gmail  
**Requerido:** ⚠️ Recomendado  
**⚠️ IMPORTANTE:** NO uses tu contraseña normal de Gmail

**Crear App Password en Gmail:**
1. Ir a: https://myaccount.google.com/security
2. Activar "Verificación en 2 pasos"
3. Ir a "Contraseñas de aplicaciones"
4. Seleccionar "Correo" y "Otro"
5. Nombrar "CDA La Florida Backend"
6. Copiar la contraseña de 16 dígitos generada

**Configurar en .env:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cda.laflorida@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

---

## 🌐 URLs y Frontend

### FRONTEND_URL
**Descripción:** URL del frontend para enlaces en emails  
**Requerido:** ⚠️ Recomendado  
**Valor por defecto:** `http://localhost:5173`

**Configurar en .env:**
```bash
# Producción
FRONTEND_URL=https://cdalaflorida.com

# O con subdominio
FRONTEND_URL=https://app.cdalaflorida.com
```

---

## 🚀 Configuración de Aplicación

### ENVIRONMENT
**Descripción:** Ambiente de ejecución  
**Requerido:** ✅ SÍ  
**Valores posibles:** `development`, `production`

### DEBUG
**Descripción:** Habilitar modo debug  
**Requerido:** ✅ SÍ  
**Valores:** `True` o `False`

**⚠️ CRÍTICO:** En producción SIEMPRE debe ser `False`

**Configurar en .env:**
```bash
ENVIRONMENT=production
DEBUG=False
```

---

## 📝 Archivo .env Completo para Producción

Crear archivo `/var/www/cda-la-florida/backend/.env`:

```bash
# ==================== APLICACIÓN ====================
APP_NAME=CDA La Florida
APP_VERSION=1.0.0
ENVIRONMENT=production
DEBUG=False

# ==================== BASE DE DATOS ====================
DATABASE_URL=postgresql://cda_app_user:TuPasswordSeguro123!@#@localhost:5432/cda_laflorida_prod

# ==================== SEGURIDAD ====================
SECRET_KEY=tu_clave_generada_con_secrets_aqui_64_caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ==================== CORS ====================
BACKEND_CORS_ORIGINS=["https://cdalaflorida.com","https://www.cdalaflorida.com"]

# ==================== SMTP (EMAIL) ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cda.laflorida@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop

# ==================== FRONTEND ====================
FRONTEND_URL=https://cdalaflorida.com

# ==================== TIMEZONE ====================
TIMEZONE=America/Bogota
LOCALE=es_CO
```

---

## 🔒 Seguridad del Archivo .env

### Permisos del Archivo
```bash
# Solo el owner puede leer/escribir
chmod 600 .env

# Verificar permisos
ls -la .env
# Debe mostrar: -rw------- 1 usuario usuario
```

### Agregar a .gitignore
```bash
echo ".env" >> .gitignore
echo ".env.production" >> .gitignore
```

### ⚠️ NUNCA:
- ❌ Commitear el archivo .env al repositorio
- ❌ Compartir el SECRET_KEY o passwords
- ❌ Usar valores de desarrollo en producción
- ❌ Dejar DEBUG=True en producción

---

## ✅ Verificación de Configuración

Después de configurar, verificar que todo funciona:

```bash
# Ir al directorio del backend
cd /var/www/cda-la-florida/backend

# Activar entorno virtual
source venv/bin/activate

# Probar carga de configuración
python -c "from app.core.config import settings; print('✅ Configuración cargada correctamente'); print(f'Environment: {settings.ENVIRONMENT}'); print(f'Debug: {settings.DEBUG}'); print(f'CORS: {settings.BACKEND_CORS_ORIGINS}')"
```

**Output esperado:**
```
✅ Configuración cargada correctamente
Environment: production
Debug: False
CORS: ['https://cdalaflorida.com', 'https://www.cdalaflorida.com']
```

---

## 🔄 Backup de Configuración

Hacer backup del .env (sin compartir):

```bash
# Backup cifrado
tar -czf env-backup-$(date +%Y%m%d).tar.gz .env
gpg -c env-backup-$(date +%Y%m%d).tar.gz
rm env-backup-$(date +%Y%m%d).tar.gz

# Guardar en ubicación segura fuera del servidor
```

---

## 📞 Contacto en Caso de Problemas

Si hay problemas con la configuración:
1. Verificar logs del servidor: `journalctl -u cda-backend -n 50`
2. Verificar que todas las variables estén definidas
3. Verificar permisos del archivo .env
4. Verificar conexión a base de datos
5. Verificar configuración SMTP (opcional pero recomendado)
