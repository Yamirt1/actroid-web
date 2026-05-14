from fastapi import FastAPI
from routers import cars_info,history,users,prediction

app = FastAPI()
#agregar los routers
app.include_router(prediction.router)
app.include_router(cars_info.router)
app.include_router(history.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return "Hola FastApi"