import asyncio
import asyncpg
from app.core.config import settings

async def check():
    db_url = settings.DATABASE_URL
    parts = db_url.replace("postgresql://", "").split("@")
    user_pass = parts[0].split(":")
    host_db = parts[1].split("/")
    host_port = host_db[0].split(":")
    
    conn = await asyncpg.connect(
        user=user_pass[0],
        password=user_pass[1],
        host=host_port[0],
        port=int(host_port[1]),
        database=host_db[1]
    )
    
    result = await conn.fetch("SELECT unnest(enum_range(NULL::metodopago))::text as value")
    print('Valores actuales en enum metodopago:')
    for r in result:
        print(f'  - {r["value"]}')
    
    await conn.close()

asyncio.run(check())
