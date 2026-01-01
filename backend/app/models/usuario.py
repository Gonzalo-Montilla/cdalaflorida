"""
Modelo de Usuario
"""
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.database import Base


class RolEnum(str, enum.Enum):
    """Roles de usuario"""
    ADMINISTRADOR = "administrador"
    CAJERO = "cajero"
    RECEPCIONISTA = "recepcionista"
    CONTADOR = "contador"


class Usuario(Base):
    """Usuario del sistema"""
    __tablename__ = "usuarios"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    nombre_completo = Column(String(200), nullable=False)
    rol = Column(SQLEnum(RolEnum), nullable=False, default=RolEnum.CAJERO)
    activo = Column(Boolean, default=True, nullable=False)
    
    # Auditoría
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    reset_tokens = relationship("PasswordResetToken", back_populates="usuario", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Usuario {self.email} - {self.rol}>"
