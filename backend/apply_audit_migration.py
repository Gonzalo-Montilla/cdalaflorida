"""
Script para aplicar la migración de auditoría
"""
import psycopg2
import os

# Leer el SQL de la migración
with open('migrations/create_audit_logs.sql', 'r', encoding='utf-8') as f:
    migration_sql = f.read()

# Leer .env para obtener DATABASE_URL
try:
    with open('.env', 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('DATABASE_URL='):
                db_url = line.split('=', 1)[1].strip()
                break
except FileNotFoundError:
    print("❌ Archivo .env no encontrado")
    exit(1)

# Conectar a la base de datos
try:
    # Extraer componentes de DATABASE_URL
    # Formato: postgresql://usuario:password@host:puerto/database
    if db_url.startswith('postgresql://'):
        db_url = db_url.replace('postgresql://', '')
    
    # Parsear URL
    auth, rest = db_url.split('@')
    user, password = auth.split(':')
    host_port, database = rest.split('/')
    host, port = host_port.split(':')
    
    # Conectar
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password
    )
    
    print("✅ Conectado a la base de datos")
    
    # Ejecutar migración
    cursor = conn.cursor()
    cursor.execute(migration_sql)
    conn.commit()
    
    print("✅ Migración aplicada exitosamente")
    print("✅ Tabla 'audit_logs' creada")
    print("✅ Tipo 'audit_action_enum' creado")
    print("✅ Índices creados")
    
    cursor.close()
    conn.close()
    
    print("\n🎉 Sistema de auditoría listo para usar")
    
except Exception as e:
    print(f"❌ Error al aplicar migración: {e}")
    print(f"\nIntenta ejecutar manualmente:")
    print(f"1. Abre pgAdmin o tu cliente de PostgreSQL")
    print(f"2. Ejecuta el contenido de: migrations/create_audit_logs.sql")
