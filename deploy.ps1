# Script de Deployment a Producción - CDA La Florida
# Ejecutar con: .\deploy.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT A PRODUCCIÓN - CDA LA FLORIDA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$SERVER = "root@31.97.144.9"
$REMOTE_PATH = "/var/www/cda-la-florida"
$BACKUP_DATE = Get-Date -Format "yyyyMMdd_HHmmss"

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".\frontend\dist")) {
    Write-Host "❌ Error: No se encuentra el directorio frontend/dist" -ForegroundColor Red
    Write-Host "   Asegúrate de estar en el directorio raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Paso 1: Confirmación
Write-Host "📋 Este script realizará:" -ForegroundColor Yellow
Write-Host "   1. Backup del código actual en el servidor" -ForegroundColor White
Write-Host "   2. Subida del frontend (dist/) al servidor" -ForegroundColor White
Write-Host "   3. Subida del backend al servidor" -ForegroundColor White
Write-Host "   4. Reinicio de servicios (cda-backend, nginx)" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "¿Deseas continuar? (s/n)"
if ($confirm -ne "s") {
    Write-Host "❌ Deployment cancelado" -ForegroundColor Red
    exit 0
}

# Paso 2: Verificar que el build existe
Write-Host ""
Write-Host "🔍 Verificando build del frontend..." -ForegroundColor Cyan
if (-not (Test-Path ".\frontend\dist\index.html")) {
    Write-Host "❌ Error: Build no encontrado. Ejecuta 'npm run build' primero" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build encontrado" -ForegroundColor Green

# Paso 3: Crear backup en servidor (solo estructura)
Write-Host ""
Write-Host "💾 Creando backup en servidor..." -ForegroundColor Cyan
Write-Host "⚠️  IMPORTANTE: Ejecuta manualmente en el servidor:" -ForegroundColor Yellow
Write-Host "   ssh $SERVER" -ForegroundColor White
Write-Host "   cd $REMOTE_PATH" -ForegroundColor White
Write-Host "   cp -r frontend frontend.backup_$BACKUP_DATE" -ForegroundColor White
Write-Host "   cp -r backend backend.backup_$BACKUP_DATE" -ForegroundColor White
Write-Host ""

$backupDone = Read-Host "¿Ya creaste el backup? (s/n)"
if ($backupDone -ne "s") {
    Write-Host "⚠️  Por favor crea el backup antes de continuar" -ForegroundColor Yellow
    exit 0
}

# Paso 4: Verificar script SQL de comisiones
Write-Host ""
Write-Host "🗄️  Verificando script SQL de comisiones SOAT..." -ForegroundColor Cyan
if (Test-Path ".\backend\scripts\verificar_comisiones_soat.sql") {
    Write-Host "✅ Script SQL encontrado" -ForegroundColor Green
    Write-Host "⚠️  RECUERDA: Ejecutar este script en la BD de producción" -ForegroundColor Yellow
    Write-Host "   psql -U cda_user -d cda_la_florida_prod -f backend/scripts/verificar_comisiones_soat.sql" -ForegroundColor White
} else {
    Write-Host "⚠️  Script SQL no encontrado (opcional)" -ForegroundColor Yellow
}

# Paso 5: Subir frontend
Write-Host ""
Write-Host "📤 Subiendo frontend al servidor..." -ForegroundColor Cyan
Write-Host "⚠️  Ejecuta manualmente (rsync no está disponible en PowerShell):" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Opción 1: Usando WSL o Git Bash" -ForegroundColor White
Write-Host "rsync -avz --delete frontend/dist/ $SERVER`:$REMOTE_PATH/frontend/" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Opción 2: Usando SCP" -ForegroundColor White
Write-Host "scp -r frontend/dist/* $SERVER`:$REMOTE_PATH/frontend/" -ForegroundColor Cyan
Write-Host ""

# Paso 6: Subir backend
Write-Host ""
Write-Host "📤 Subiendo backend al servidor..." -ForegroundColor Cyan
Write-Host "⚠️  Ejecuta manualmente:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Opción 1: Usando WSL o Git Bash" -ForegroundColor White
Write-Host "rsync -avz --exclude='__pycache__' --exclude='*.pyc' --exclude='venv' backend/ $SERVER`:$REMOTE_PATH/backend/" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Opción 2: Usando SCP" -ForegroundColor White
Write-Host "scp -r backend/* $SERVER`:$REMOTE_PATH/backend/" -ForegroundColor Cyan
Write-Host ""

Read-Host "Presiona Enter después de subir los archivos..."

# Paso 7: Reiniciar servicios
Write-Host ""
Write-Host "🔄 Reiniciando servicios en el servidor..." -ForegroundColor Cyan
Write-Host "⚠️  Ejecuta manualmente en el servidor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "ssh $SERVER" -ForegroundColor White
Write-Host "systemctl restart cda-backend" -ForegroundColor Cyan
Write-Host "systemctl restart nginx" -ForegroundColor Cyan
Write-Host "systemctl status cda-backend" -ForegroundColor Cyan
Write-Host "systemctl status nginx" -ForegroundColor Cyan
Write-Host ""

# Paso 8: Verificación post-deployment
Write-Host ""
Write-Host "✅ PASOS COMPLETADOS" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 TESTS POST-DEPLOYMENT (ver PRE_DEPLOYMENT_CHECKLIST.md):" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Test campos numéricos:" -ForegroundColor White
Write-Host "   - Abrir caja con monto inicial" -ForegroundColor Gray
Write-Host "   - Registrar gasto" -ForegroundColor Gray
Write-Host "   - Cerrar caja con arqueo" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test comisiones SOAT editables:" -ForegroundColor White
Write-Host "   - Cobrar vehículo con SOAT" -ForegroundColor Gray
Write-Host "   - Verificar checkbox de comisión" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test venta SOAT independiente:" -ForegroundColor White
Write-Host "   - Usar botón 'Venta SOAT'" -ForegroundColor Gray
Write-Host "   - Verificar PDF generado" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test PDF recibo RTM:" -ForegroundColor White
Write-Host "   - Cobrar vehículo normal" -ForegroundColor Gray
Write-Host "   - Verificar PDF automático" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  URL: http://31.97.144.9" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
