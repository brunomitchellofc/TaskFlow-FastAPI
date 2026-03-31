# 📋 TaskFlow — Task Manager

A fullstack task manager built with Python and FastAPI. Users can register, log in, and manage their personal tasks with a clean interface and real authentication.

🔗 [Live Demo](https://taskflow-fastapi-59z2.onrender.com)

## ✨ Technologies

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- bcrypt
- Jinja2
- JavaScript
- Pytest
- Render + Supabase

## 🚀 Features

- JWT authentication with token expiration and bcrypt password hashing
- Each user only sees and manages their own tasks — fully private
- Full CRUD — create, edit, delete and mark tasks as complete
- Priority levels from 1 to 5 for each task
- Role-based authorization — admins can view and delete any user's tasks
- Password and phone number editable from the profile
- Pytest test suite with fixtures, async tests and a dedicated test database

## 🧠 The Process

I wanted to build something that went beyond following a tutorial. I wanted to understand how a real backend actually works, not just make it run, but be able to explain every single decision.

Starting with FastAPI felt natural because of Python, but authentication was where things got interesting. Understanding how JWT tokens work, why the payload isn't encrypted, why the `owner_id` has to come from the token and never from the request body, and how bcrypt verification works under the hood, these were the moments that made this project worth building.

Deployment taught me more than the code itself. SQLite worked perfectly locally and broke immediately on Render. Moving to PostgreSQL, managing environment variables properly, and understanding why secrets should never live in the codebase, all of that came from actually shipping something live.

By the end I could explain every line. That was the goal.

## 🔧 Running the Project

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Windows: `venv\Scripts\activate`)
4. Install dependencies: `pip install -r requirements.txt`
5. Set environment variables:
```
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
```
6. Run: `uvicorn TodoApp.main:app --reload`
7. Open `http://localhost:8000` in your browser

## 🎬 Preview
Login

https://github.com/user-attachments/assets/0c995a86-5eae-4e6f-a5b2-900424dc140b

Add Todo and Delete

https://github.com/user-attachments/assets/4628a04b-f8b6-4902-944e-f6abd980d2fa

[LinkedIn](https://www.linkedin.com/in/bruno-mitchell-246b4a2a6/) · [GitHub](https://github.com/brunomitchellofc)

