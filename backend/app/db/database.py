"""
Configuración de base de datos PostgreSQL
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Motor de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()


def get_db():
    """
    Dependency para obtener sesión de base de datos
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Inicializar base de datos: crear tablas y datos iniciales
    """
    from app.models.usuario import Usuario
    from app.models.tarifa import Tarifa, ComisionSOAT
    from app.models.caja import Caja, MovimientoCaja
    from app.models.vehiculo import VehiculoProceso
    from app.core.security import get_password_hash
    from datetime import date
    
    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar si ya existe usuario admin
        admin_exists = db.query(Usuario).filter(Usuario.email == "admin@cdalaflorida.com").first()
        
        if not admin_exists:
            print("📝 Creando usuario administrador inicial...")
            
            # Crear usuario administrador
            admin = Usuario(
                email="admin@cdalaflorida.com",
                hashed_password=get_password_hash("admin123"),
                nombre_completo="Administrador CDA",
                rol="administrador",
                activo=True
            )
            db.add(admin)
            db.flush()
            
            print("✅ Usuario administrador creado")
            print("   Email: admin@cdalaflorida.com")
            print("   Password: admin123")
            
            # Crear tarifas 2025 para motos
            print("\n📋 Creando tarifas 2025...")
            
            tarifas_2025 = [
                # 0-2 años (modelos 2023-2025)
                Tarifa(
                    ano_vigencia=2025,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=date(2025, 12, 31),
                    antiguedad_min=0,
                    antiguedad_max=2,
                    valor_rtm=181596,
                    valor_terceros=24056,
                    valor_total=205652,
                    activa=True,
                    created_by=admin.id
                ),
                # 3-7 años (modelos 2018-2022)
                Tarifa(
                    ano_vigencia=2025,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=date(2025, 12, 31),
                    antiguedad_min=3,
                    antiguedad_max=7,
                    valor_rtm=181896,
                    valor_terceros=24056,
                    valor_total=205952,
                    activa=True,
                    created_by=admin.id
                ),
                # 8-16 años (modelos 2009-2017)
                Tarifa(
                    ano_vigencia=2025,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=date(2025, 12, 31),
                    antiguedad_min=8,
                    antiguedad_max=16,
                    valor_rtm=182196,
                    valor_terceros=24056,
                    valor_total=206252,
                    activa=True,
                    created_by=admin.id
                ),
                # 17+ años (modelos 2008 hacia atrás)
                Tarifa(
                    ano_vigencia=2025,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=date(2025, 12, 31),
                    antiguedad_min=17,
                    antiguedad_max=None,
                    valor_rtm=181896,
                    valor_terceros=24056,
                    valor_total=205952,
                    activa=True,
                    created_by=admin.id
                ),
            ]
            
            for tarifa in tarifas_2025:
                db.add(tarifa)
            
            print("✅ Tarifas 2025 creadas (4 rangos de antigüedad)")
            
            # Crear comisiones SOAT
            print("\n💰 Creando comisiones SOAT...")
            
            comisiones = [
                ComisionSOAT(
                    tipo_vehiculo="moto",
                    valor_comision=30000,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=None,
                    activa=True,
                    created_by=admin.id
                ),
                ComisionSOAT(
                    tipo_vehiculo="carro",
                    valor_comision=50000,
                    vigencia_inicio=date(2025, 1, 1),
                    vigencia_fin=None,
                    activa=True,
                    created_by=admin.id
                ),
            ]
            
            for comision in comisiones:
                db.add(comision)
            
            print("✅ Comisiones SOAT creadas (Moto: $30K, Carro: $50K)")
            
            db.commit()
            print("\n🎉 Base de datos inicializada correctamente\n")
        else:
            print("ℹ️  Base de datos ya inicializada")
            
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        db.rollback()
    finally:
        db.close()
