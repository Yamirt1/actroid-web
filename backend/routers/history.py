from fastapi import APIRouter

router = APIRouter()

@router.get("/history")
async def root():
    return "Hola history"