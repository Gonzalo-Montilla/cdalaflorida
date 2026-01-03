from app.db.database import engine, Base

# Importar todos los modelos
from app.models.usuario import Usuario
from app.models.vehiculo import VehiculoProceso
from app.models.tarifa import Tarifa, ComisionSOAT
from app.models.caja import Caja, MovimientoCaja, DesgloseEfectivoCierre
from app.models.tesoreria import MovimientoTesoreria, DesgloseEfectivoTesoreria, ConfiguracionTesoreria
from app.models.audit_log import AuditLog
from app.models.password_reset_token import PasswordResetToken

print("Creando tablas en la base de datos...")
Base.metadata.create_all(bind=engine)
print("Tablas creadas exitosamente")
