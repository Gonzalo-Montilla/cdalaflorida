"""
Utilidades para Auditoría
"""
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import Request

from app.models.audit_log import AuditLog, AuditAction
from app.models.usuario import Usuario


def create_audit_log(
    db: Session,
    action: AuditAction,
    description: str,
    usuario: Optional[Usuario] = None,
    request: Optional[Request] = None,
    metadata: Optional[Dict[str, Any]] = None,
    success: str = "success",
    error_message: Optional[str] = None
) -> AuditLog:
    """
    Crear un registro de auditoría
    
    Args:
        db: Sesión de base de datos
        action: Tipo de acción (enum AuditAction)
        description: Descripción legible de la acción
        usuario: Usuario que realizó la acción (opcional)
        request: Request de FastAPI para obtener IP y User-Agent (opcional)
        metadata: Datos adicionales en formato dict (opcional)
        success: Estado: "success", "failed", "error"
        error_message: Mensaje de error si aplica
    
    Returns:
        AuditLog: El registro creado
    """
    # Extraer información del request
    ip_address = None
    user_agent = None
    
    if request:
        # Obtener IP real (considera proxies)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip_address = forwarded.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else None
        
        user_agent = request.headers.get("User-Agent")
    
    # Crear registro
    audit_log = AuditLog(
        action=action.value if hasattr(action, 'value') else action,
        description=description,
        usuario_id=usuario.id if usuario else None,
        usuario_email=usuario.email if usuario else None,
        usuario_nombre=usuario.nombre_completo if usuario else None,
        usuario_rol=usuario.rol.value if usuario and hasattr(usuario.rol, 'value') else (usuario.rol if usuario else None),
        ip_address=ip_address,
        user_agent=user_agent,
        extra_data=metadata,
        success=success,
        error_message=error_message
    )
    
    db.add(audit_log)
    db.commit()
    
    return audit_log


def audit_login_success(
    db: Session,
    usuario: Usuario,
    request: Request
):
    """Auditar login exitoso"""
    create_audit_log(
        db=db,
        action=AuditAction.LOGIN,
        description=f"Login exitoso: {usuario.email}",
        usuario=usuario,
        request=request,
        success="success"
    )


def audit_login_failed(
    db: Session,
    email: str,
    request: Request,
    reason: str = "Credenciales incorrectas"
):
    """Auditar intento de login fallido"""
    create_audit_log(
        db=db,
        action=AuditAction.FAILED_LOGIN,
        description=f"Intento de login fallido: {email}",
        usuario=None,
        request=request,
        metadata={"email": email, "reason": reason},
        success="failed"
    )


def audit_caja_operation(
    db: Session,
    action: AuditAction,
    description: str,
    usuario: Usuario,
    request: Optional[Request] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """Auditar operaciones de caja"""
    create_audit_log(
        db=db,
        action=action,
        description=description,
        usuario=usuario,
        request=request,
        metadata=metadata
    )


def audit_tesoreria_operation(
    db: Session,
    action: AuditAction,
    description: str,
    usuario: Usuario,
    request: Optional[Request] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """Auditar operaciones de tesorería"""
    create_audit_log(
        db=db,
        action=action,
        description=description,
        usuario=usuario,
        request=request,
        metadata=metadata
    )


def audit_tarifa_operation(
    db: Session,
    action: AuditAction,
    description: str,
    usuario: Usuario,
    request: Optional[Request] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """Auditar operaciones de tarifas"""
    create_audit_log(
        db=db,
        action=action,
        description=description,
        usuario=usuario,
        request=request,
        metadata=metadata
    )
