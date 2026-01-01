"""
Script para renombrar columna metadata a extra_data
"""
import psycopg2

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
    
    cursor = conn.cursor()
    
    # Renombrar columna
    cursor.execute("ALTER TABLE audit_logs RENAME COLUMN metadata TO extra_data;")
    conn.commit()
    
    print("✅ Columna 'metadata' renombrada a 'extra_data'")
    print("✅ Sistema de auditoría actualizado correctamente")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nSi la tabla no existe, ejecuta primero: python apply_audit_migration.py")
