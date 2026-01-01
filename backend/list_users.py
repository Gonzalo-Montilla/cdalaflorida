"""
Script para listar usuarios de la base de datos
"""
import os
import sys
from pathlib import Path

# Agregar el directorio backend al path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, text

# Database URL
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/cda_La Florida"

# Crear engine
engine = create_engine(DATABASE_URL)

try:
    # Consultar todos los usuarios directamente con SQL
    with engine.connect() as connection:
        result = connection.execute(text("SELECT email, nombre_completo, rol, activo FROM usuarios ORDER BY created_at"))
        usuarios = result.fetchall()
    
    print("\n" + "="*80)
    print("USUARIOS EN LA BASE DE DATOS")
    print("="*80)
    
    if not usuarios:
        print("\n⚠️  No hay usuarios en la base de datos\n")
    else:
        for usuario in usuarios:
            print(f"\n📧 Email: {usuario[0]}")
            print(f"👤 Nombre: {usuario[1]}")
            print(f"🎭 Rol: {usuario[2]}")
            print(f"✅ Activo: {'Sí' if usuario[3] else 'No'}")
            print("-" * 80)
    
    print(f"\nTotal de usuarios: {len(usuarios)}\n")
    
except Exception as e:
    print(f"\n❌ Error al consultar usuarios: {e}\n")
