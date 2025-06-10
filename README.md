# 📝 TaskList App

**TaskList** is a full-stack backend application that enables users to securely manage their personal tasks. With user authentication and route protection, only authorized users can access and modify their own task data.

## 🔧 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Testing**: Postman (manual)

---

## 🎯 Project Objectives

- Build a secure, multi-user task management system.
- Enable full CRUD functionality for user-owned tasks.
- Protect task routes using JWT-based middleware.
- Enforce access control: users can only manage their own tasks.

---

## 🗃️ Database Schema

### Users Table

| Field     | Type    | Constraints          |
|-----------|---------|----------------------|
| id        | SERIAL  | Primary Key          |
| username  | TEXT    | UNIQUE, NOT NULL     |
| password  | TEXT    | Hashed, NOT NULL     |

### Tasks Table

| Field     | Type     | Constraints                      |
|-----------|----------|----------------------------------|
| id        | SERIAL   | Primary Key                      |
| title     | TEXT     | NOT NULL                         |
| done      | BOOLEAN  | Default `false`, NOT NULL        |
| user_id   | INTEGER  | Foreign Key → users.id (CASCADE) |

---

## 🔐 Authentication & Middleware

JWT-based middleware protects all task routes.

- Valid token required to access `/tasks` routes
- Middleware:
  - Reads token from headers
  - Verifies with JWT_SECRET
  - Attaches decoded user info to `req.user`
- Sends `401 Unauthorized` if no/invalid token
- Sends `403 Forbidden` if accessing tasks owned by another user

---

## 📡 API Endpoints

### 👤 Users

- `POST /users/register`  
  - Registers a new user
  - Hashes password
  - Returns JWT token

- `POST /users/login`  
  - Verifies credentials
  - Returns JWT token if valid

---

### ✅ Tasks (Protected Routes 🔒)

- `POST /tasks`  
  - Creates a task for the logged-in user

- `GET /tasks`  
  - Retrieves all tasks belonging to the logged-in user

- `PUT /tasks/:id`  
  - Updates a task (only if owned by the logged-in user)

- `DELETE /tasks/:id`  
  - Deletes a task (only if owned by the logged-in user)
