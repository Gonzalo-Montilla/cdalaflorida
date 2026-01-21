"""
Script para agregar 'mixto' al enum metodopago en PostgreSQL
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

print("🔧 Agregando 'mixto' al enum metodopago...")

try:
    with engine.connect() as conn:
        # Agregar 'mixto' al enum
        conn.execute(text("""
            ALTER TYPE metodopago ADD VALUE IF NOT EXISTS 'mixto';
        """))
        conn.commit()
        
        print("✅ Valor 'mixto' agregado exitosamente al enum metodopago")
        
except Exception as e:
    print(f"❌ Error al agregar valor al enum: {e}")
    exit(1)

print("✅ Migración completada")
