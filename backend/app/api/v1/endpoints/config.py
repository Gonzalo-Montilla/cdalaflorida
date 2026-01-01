"""
Endpoints de Configuración
"""
from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.core.config import settings
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/urls-externas")
def obtener_urls_externas(
    current_user: Usuario = Depends(get_current_user)
):
    """
    Obtener URLs de sistemas externos (RUNT, SICOV, INDRA)
    """
    return {
        "runt_url": settings.RUNT_URL,
        "sicov_url": settings.SICOV_URL,
        "indra_url": settings.INDRA_URL
    }
