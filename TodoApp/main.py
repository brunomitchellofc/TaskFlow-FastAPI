import os
from fastapi import FastAPI, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

# Imports absolutos para evitar erros no Linux/Render
from TodoApp.models import Base
from TodoApp.database import engine
from TodoApp.routers import auth, todos, admin, users

app = FastAPI()

# Criar as tabelas no banco de dados (SQLite/Postgres)
Base.metadata.create_all(bind=engine)

# Force finding the static folder
base_dir = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(base_dir, "static")

# Se não achar pelo caminho absoluto, tenta pelo relativo
if not os.path.exists(static_path):
    static_path = "TodoApp/static"

app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
def redirect_to_login(request: Request):
    return RedirectResponse(url="/auth/login-page", status_code=status.HTTP_302_FOUND)

@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}

# Inclusão das rotas
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)
