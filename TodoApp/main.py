import os
from fastapi import FastAPI, Request, status
from .models import Base
from .database import engine
from .routers import auth, todos, admin, users
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

# Caminho direto para a pasta static que está dentro de TodoApp
current_dir = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(current_dir, "static")

# Debug para o log do Render
print(f"DEBUG: O servidor está procurando o CSS em: {static_path}")

app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
def test(request: Request):
    return RedirectResponse(url="/todos/todo-page", status_code=status.HTTP_302_FOUND)

@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)
