import os
from fastapi import FastAPI, Request, status
from .models import Base
from .database import engine
from .routers import auth, todos, admin, users
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# --- LÓGICA DE CAMINHO PARA O RENDER ---
# Pega o diretório onde este arquivo (main.py) está
script_dir = os.path.dirname(os.path.realpath(__file__))

# Tenta achar a pasta static dentro da pasta do app (TodoApp/static)
static_path = os.path.join(script_dir, "static")

# Se não existir ali, tenta na raiz do projeto (importante para o Render)
if not os.path.exists(static_path):
    static_path = os.path.join(os.getcwd(), "static")

# Monta os arquivos estáticos com o caminho absoluto
app.mount("/static", StaticFiles(directory=static_path), name="static")
# ---------------------------------------

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
