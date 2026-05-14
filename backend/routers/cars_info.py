from fastapi import APIRouter

router = APIRouter()

@router.get("/car")
async def root():
    return "Hola car info"