import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings

async def delete_all_movements():
    # Convertir DATABASE_URL a async
    database_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        try:
            # Primero eliminar los desgloses (tienen FK a movimientos)
            result = await session.execute(text("DELETE FROM desglose_efectivo_tesoreria"))
            desgloses_eliminados = result.rowcount
            
            # Luego eliminar los movimientos
            result = await session.execute(text("DELETE FROM movimientos_tesoreria"))
            movimientos_eliminados = result.rowcount
            
            await session.commit()
            
            print(f"\n✅ Datos eliminados exitosamente:")
            print(f"   - {desgloses_eliminados} desgloses de efectivo")
            print(f"   - {movimientos_eliminados} movimientos de tesorería")
            print("\nAhora puedes probar con datos frescos.\n")
            
        except Exception as e:
            await session.rollback()
            print(f"\n❌ Error al eliminar datos: {e}\n")
            raise
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(delete_all_movements())
