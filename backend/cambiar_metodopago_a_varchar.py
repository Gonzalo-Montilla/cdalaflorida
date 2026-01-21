"""
Script para cambiar metodo_pago de ENUM a VARCHAR en PostgreSQL
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Error: DATABASE_URL no está configurada en .env")
    exit(1)

# Crear engine
engine = create_engine(DATABASE_URL)

print("🔧 Cambiando tipo de columna metodo_pago de ENUM a VARCHAR...")

try:
    with engine.connect() as conn:
        # Cambiar tipo de columna usando CAST
        conn.execute(text("""
            ALTER TABLE vehiculos_proceso 
            ALTER COLUMN metodo_pago TYPE VARCHAR(50) 
            USING metodo_pago::text;
        """))
        conn.commit()
        
        print("✅ Columna metodo_pago cambiada exitosamente a VARCHAR(50)")
        
except Exception as e:
    print(f"❌ Error al cambiar tipo de columna: {e}")
    exit(1)

print("✅ Migración completada")
