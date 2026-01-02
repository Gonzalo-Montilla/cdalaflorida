# 🚀 Guía de Deployment - CDA La Florida en Hostinger VPS

**Sistema:** CDA La Florida - Sistema de Gestión RTM y SOAT  
**Stack:** FastAPI (Backend) + React/Vite (Frontend) + PostgreSQL  
**Servidor:** Hostinger VPS  
**Fecha:** Enero 2026

---

## 📋 Pre-requisitos

### En tu VPS de Hostinger necesitarás:
- Ubuntu 20.04 o 22.04 LTS
- Acceso root o sudo
- IP pública del servidor
- Dominio apuntando al servidor (ej: cdalaflorida.com)

### En tu máquina local:
- Git instalado
- Acceso SSH al VPS
- Código del proyecto listo (este repositorio)

---

## 🏗️ PARTE 1: Preparar el Servidor VPS

### 1.1 Conectarse al VPS

```bash
# Desde tu terminal local (PowerShell, CMD, o terminal)
ssh root@TU_IP_DEL_VPS

# Ejemplo:
ssh root@185.123.45.67
```

### 1.2 Actualizar el Sistema

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl wget git vim ufw software-properties-common
```

### 1.3 Crear Usuario para la Aplicación

```bash
# Crear usuario (más seguro que usar root)
sudo adduser cda
sudo usermod -aG sudo cda

# Cambiar a este usuario
su - cda
```

### 1.4 Configurar Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Verificar
sudo ufw status
```

---

## 🐘 PARTE 2: Instalar y Configurar PostgreSQL

### 2.1 Instalar PostgreSQL

```bash
# Instalar PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Verificar que esté corriendo
sudo systemctl status postgresql
```

### 2.2 Configurar Base de Datos

```bash
# Conectarse a PostgreSQL
sudo -u postgres psql

# Dentro del prompt de PostgreSQL:
```

```sql
-- Crear base de datos
CREATE DATABASE cda_laflorida_prod;

-- Crear usuario (cambiar PASSWORD por una clave segura)
CREATE USER cda_app_user WITH ENCRYPTED PASSWORD 'TuPasswordSeguro123!@#';

-- Otorgar todos los permisos
GRANT ALL PRIVILEGES ON DATABASE cda_laflorida_prod TO cda_app_user;

-- Salir
\q
```

### 2.3 Configurar Acceso Local

```bash
# Editar pg_hba.conf para permitir conexiones locales con password
sudo vim /etc/postgresql/15/main/pg_hba.conf

# Cambiar esta línea:
# local   all             all                                     peer
# Por:
# local   all             all                                     md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### 2.4 Probar Conexión

```bash
# Probar conexión con el nuevo usuario
psql -U cda_app_user -d cda_laflorida_prod -h localhost

# Si te pide password y te conecta, ¡funciona!
# Salir con \q
```

---

## 🐍 PARTE 3: Instalar Python y Configurar Backend

### 3.1 Instalar Python 3.12

```bash
# Agregar PPA de Python
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Instalar Python 3.12
sudo apt install -y python3.12 python3.12-venv python3.12-dev

# Verificar instalación
python3.12 --version
```

### 3.2 Clonar el Repositorio

```bash
# Ir al directorio home
cd ~

# Clonar el repositorio (ajustar URL según tu repo)
git clone https://github.com/TU_USUARIO/cda-la-florida.git

# O si usas otra fuente, copiar archivos al servidor
# Puedes usar SCP desde tu máquina local:
# scp -r C:\Users\USUARIO\Documents\cda-la-florida root@TU_IP:/home/cda/

cd cda-la-florida/backend
```

### 3.3 Crear Entorno Virtual

```bash
# Crear entorno virtual con Python 3.12
python3.12 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Actualizar pip
pip install --upgrade pip
```

### 3.4 Instalar Dependencias

```bash
# Instalar todas las dependencias
pip install -r requirements.txt

# Verificar que se instaló todo
pip list | grep fastapi
pip list | grep sqlalchemy
```

### 3.5 Configurar Variables de Entorno

```bash
# Crear archivo .env en backend/
vim .env
```

**Contenido del archivo `.env`:**

```bash
# ==================== APLICACIÓN ====================
APP_NAME=CDA La Florida
APP_VERSION=1.0.0
ENVIRONMENT=production
DEBUG=False

# ==================== BASE DE DATOS ====================
DATABASE_URL=postgresql://cda_app_user:TuPasswordSeguro123!@#@localhost:5432/cda_laflorida_prod

# ==================== SEGURIDAD ====================
# Generar con: python -c "import secrets; print(secrets.token_urlsafe(64))"
SECRET_KEY=AQUI_TU_SECRET_KEY_UNICA_GENERADA_CON_64_CARACTERES
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ==================== CORS ====================
BACKEND_CORS_ORIGINS=["https://cdalaflorida.com","https://www.cdalaflorida.com"]

# ==================== SMTP (EMAIL) - OPCIONAL ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cda.laflorida@gmail.com
SMTP_PASSWORD=tu_app_password_de_gmail

# ==================== FRONTEND ====================
FRONTEND_URL=https://cdalaflorida.com

# ==================== TIMEZONE ====================
TIMEZONE=America/Bogota
LOCALE=es_CO
```

**⚠️ IMPORTANTE:** Generar SECRET_KEY único:

```bash
python3.12 -c "import secrets; print(secrets.token_urlsafe(64))"
# Copiar el resultado y pegarlo en SECRET_KEY
```

### 3.6 Crear Tablas de Base de Datos

```bash
# Asegurarse de estar en backend/ y con venv activado
cd ~/cda-la-florida/backend
source venv/bin/activate

# Ejecutar script de inicialización
python -c "from app.db.database import init_db; init_db()"

# Aplicar migraciones SQL manualmente
psql -U cda_app_user -d cda_laflorida_prod -h localhost -f migrations/create_audit_logs.sql
psql -U cda_app_user -d cda_laflorida_prod -h localhost -f migrations/create_password_reset_tokens.sql
psql -U cda_app_user -d cda_laflorida_prod -h localhost -f migrations/add_desglose_efectivo_cierre.sql
psql -U cda_app_user -d cda_laflorida_prod -h localhost -f migrations/add_desglose_efectivo_tesoreria.sql
psql -U cda_app_user -d cda_laflorida_prod -h localhost -f migrations/add_sistecredito_metodopago.sql
```

### 3.7 Crear Usuario Administrador

```bash
# Desde backend/ con venv activado
python3.12 -c "
from app.db.database import SessionLocal
from app.models.usuario import Usuario
from app.core.security import get_password_hash

db = SessionLocal()
admin = Usuario(
    email='admin@cdalaflorida.com',
    hashed_password=get_password_hash('Admin123!'),
    nombre_completo='Administrador CDA',
    rol='administrador',
    activo=True
)
db.add(admin)
db.commit()
print('✅ Usuario admin creado: admin@cdalaflorida.com / Admin123!')
db.close()
"
```

### 3.8 Cargar Tarifas 2025

```bash
# Ejecutar script de carga de tarifas
python scripts/cargar_tarifas_2025.py
```

### 3.9 Probar Backend Localmente

```bash
# Ejecutar servidor de prueba
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Desde otra terminal, probar:
curl http://localhost:8000/health

# Deberías ver: {"status":"ok","app":"CDA La Florida",...}
# Ctrl+C para detener
```

---

## 🔧 PARTE 4: Configurar Uvicorn como Servicio (Systemd)

### 4.1 Crear Archivo de Servicio

```bash
sudo vim /etc/systemd/system/cda-backend.service
```

**Contenido:**

```ini
[Unit]
Description=CDA La Florida - FastAPI Backend
After=network.target postgresql.service

[Service]
Type=notify
User=cda
Group=cda
WorkingDirectory=/home/cda/cda-la-florida/backend
Environment="PATH=/home/cda/cda-la-florida/backend/venv/bin"
ExecStart=/home/cda/cda-la-florida/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Reiniciar automáticamente si falla
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 4.2 Habilitar y Arrancar el Servicio

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar para que arranque al iniciar el sistema
sudo systemctl enable cda-backend

# Iniciar el servicio
sudo systemctl start cda-backend

# Verificar estado
sudo systemctl status cda-backend

# Ver logs
sudo journalctl -u cda-backend -f
```

---

## ⚛️ PARTE 5: Compilar y Configurar Frontend

### 5.1 Instalar Node.js

```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 5.2 Compilar Frontend

```bash
# Ir a directorio frontend
cd ~/cda-la-florida/frontend

# Crear archivo .env para producción
vim .env.production
```

**Contenido de `.env.production`:**

```bash
VITE_API_URL=https://api.cdalaflorida.com
```

```bash
# Instalar dependencias
npm install

# Compilar para producción
npm run build

# Esto genera la carpeta 'dist' con los archivos estáticos
ls -la dist/
```

---

## 🌐 PARTE 6: Instalar y Configurar Nginx

### 6.1 Instalar Nginx

```bash
sudo apt install -y nginx

# Verificar que esté corriendo
sudo systemctl status nginx
```

### 6.2 Configurar Sitio

```bash
# Crear configuración del sitio
sudo vim /etc/nginx/sites-available/cda-laflorida
```

**Contenido:**

```nginx
# Backend API
server {
    listen 80;
    server_name api.cdalaflorida.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name cdalaflorida.com www.cdalaflorida.com;

    root /home/cda/cda-la-florida/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cachear assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.3 Habilitar Sitio

```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/cda-laflorida /etc/nginx/sites-enabled/

# Eliminar sitio por defecto
sudo rm /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Si todo está OK, reiniciar nginx
sudo systemctl restart nginx
```

---

## 🔒 PARTE 7: Configurar SSL con Let's Encrypt

### 7.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtener Certificados SSL

```bash
# Para el dominio principal y www
sudo certbot --nginx -d cdalaflorida.com -d www.cdalaflorida.com

# Para el subdominio API
sudo certbot --nginx -d api.cdalaflorida.com

# Seguir las instrucciones:
# - Ingresar email
# - Aceptar términos
# - Elegir opción 2 (Redirect HTTP to HTTPS)
```

### 7.3 Verificar Renovación Automática

```bash
# Probar renovación (dry-run)
sudo certbot renew --dry-run

# Si funciona, los certificados se renovarán automáticamente
```

---

## 🎯 PARTE 8: Verificación Final

### 8.1 Verificar que Todo Funcione

```bash
# 1. Backend funcionando
curl https://api.cdalaflorida.com/health

# Deberías ver: {"status":"ok",...}

# 2. Frontend accesible
curl -I https://cdalaflorida.com

# Deberías ver: HTTP/2 200

# 3. Servicios corriendo
sudo systemctl status cda-backend
sudo systemctl status nginx
sudo systemctl status postgresql
```

### 8.2 Probar desde el Navegador

Abrir en tu navegador:

1. **Frontend:** https://cdalaflorida.com
2. **Login:** admin@cdalaflorida.com / Admin123!
3. **Probar flujo completo:**
   - Abrir caja
   - Registrar vehículo
   - Cobrar vehículo
   - Cerrar caja
   - Ver reportes

---

## 🔧 PARTE 9: Mantenimiento y Monitoreo

### 9.1 Ver Logs

```bash
# Logs del backend
sudo journalctl -u cda-backend -f

# Logs de nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### 9.2 Reiniciar Servicios

```bash
# Reiniciar backend (después de actualizar código)
sudo systemctl restart cda-backend

# Reiniciar nginx (después de cambiar configuración)
sudo systemctl restart nginx

# Reiniciar PostgreSQL (raramente necesario)
sudo systemctl restart postgresql
```

### 9.3 Actualizar el Sistema

```bash
# Ir al directorio del proyecto
cd ~/cda-la-florida

# Hacer pull de los últimos cambios
git pull origin main

# Backend: instalar nuevas dependencias si hay
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Reiniciar backend
sudo systemctl restart cda-backend

# Frontend: recompilar
cd ~/cda-la-florida/frontend
npm install
npm run build

# Nginx recarga automáticamente los archivos estáticos
```

---

## 📊 PARTE 10: Backup de Base de Datos

### 10.1 Crear Script de Backup

```bash
# Crear directorio para backups
mkdir -p ~/backups

# Crear script de backup
vim ~/backups/backup-db.sh
```

**Contenido del script:**

```bash
#!/bin/bash

# Configuración
DB_NAME="cda_laflorida_prod"
DB_USER="cda_app_user"
BACKUP_DIR="/home/cda/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cda_backup_$DATE.sql.gz"

# Exportar password (o usar ~/.pgpass)
export PGPASSWORD='TuPasswordSeguro123!@#'

# Crear backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

# Eliminar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "cda_backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup completado: $BACKUP_FILE"
```

```bash
# Hacer ejecutable
chmod +x ~/backups/backup-db.sh

# Probar
~/backups/backup-db.sh
```

### 10.2 Programar Backups Automáticos

```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /home/cda/backups/backup-db.sh >> /home/cda/backups/backup.log 2>&1
```

---

## 🎉 ¡DEPLOYMENT COMPLETADO!

### ✅ Checklist Final

- [ ] PostgreSQL instalado y configurado
- [ ] Base de datos creada con usuario específico
- [ ] Backend corriendo como servicio systemd
- [ ] Frontend compilado y servido por Nginx
- [ ] SSL configurado con Let's Encrypt
- [ ] Usuario administrador creado
- [ ] Tarifas 2025 cargadas
- [ ] Firewall configurado
- [ ] Backups automáticos programados
- [ ] Sistema probado end-to-end

### 🔐 Credenciales de Acceso

**Sistema Web:**
- URL: https://cdalaflorida.com
- Usuario: admin@cdalaflorida.com
- Password: Admin123! (⚠️ CAMBIAR después del primer login)

**Base de Datos:**
- Host: localhost
- Puerto: 5432
- Database: cda_laflorida_prod
- Usuario: cda_app_user
- Password: [la que configuraste]

**SSH:**
- Usuario: cda
- IP: [tu IP del VPS]

---

## 📞 Soporte Post-Deployment

### Comandos Útiles

```bash
# Estado de servicios
sudo systemctl status cda-backend nginx postgresql

# Reiniciar todo
sudo systemctl restart cda-backend nginx

# Ver uso de recursos
htop
df -h
free -h

# Conexión a la base de datos
psql -U cda_app_user -d cda_laflorida_prod -h localhost
```

### Problemas Comunes

**1. Backend no arranca:**
```bash
sudo journalctl -u cda-backend -n 50
# Revisar errores en el log
```

**2. Error de conexión a BD:**
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Probar conexión manual
psql -U cda_app_user -d cda_laflorida_prod -h localhost
```

**3. Frontend muestra página en blanco:**
```bash
# Verificar que el build existe
ls -la ~/cda-la-florida/frontend/dist/

# Verificar permisos
sudo chown -R cda:cda ~/cda-la-florida/frontend/dist/
```

**4. Error 502 Bad Gateway:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/health

# Si no responde, reiniciar backend
sudo systemctl restart cda-backend
```

---

## 🚀 ¡Sistema en Producción!

Tu sistema CDA La Florida ahora está **LIVE** y listo para usar en producción.

**Características Activas:**
- ✅ Recepción de vehículos con fotos
- ✅ Módulo de caja con múltiples métodos de pago
- ✅ Cierre de caja con desglose de denominaciones
- ✅ Tesorería con validación de inventario
- ✅ Reportes y estadísticas
- ✅ PDFs de comprobantes y cierres
- ✅ Sistema de auditoría completo
- ✅ Backups automáticos
- ✅ SSL/HTTPS seguro

**Próximos Pasos Recomendados:**
1. Cambiar password del admin
2. Crear usuarios para cajeros y recepcionistas
3. Capacitar al personal
4. Monitorear logs durante los primeros días
5. Configurar alertas de monitoreo (opcional)

---

**¡Felicidades! 🎉**  
El sistema está listo para operar. 💼🚗
