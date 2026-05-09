from fastapi import APIRouter

router = APIRouter()

@router.get("/predict")
async def root():
    return "Hola predict"