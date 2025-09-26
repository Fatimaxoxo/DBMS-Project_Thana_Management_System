
# Thana Management Project

This project contains two main folders:
- **Admin**
- **Users**

Both folders have separate frontend and backend parts.

This README will guide you through running the project easily.

---

## 1. Setup for Admin

### 1.1 Frontend Setup
1. Open a terminal/command prompt.
2. Navigate to the Admin frontend folder:

```bash
cd Admin/frontend
```

3. Install dependencies:

```bash
npm install
```

4. Run the frontend:

```bash
npm run dev
```

---

### 1.2 Backend Setup
1. Open a new terminal.
2. Navigate to the Admin backend folder:

```bash
cd Admin/backend
```

3. Install dependencies:

```bash
npm install
```

4. Run the backend:

```bash
npm run dev
```

---

## 2. Setup for Users

### 2.1 Frontend Setup
1. Open a terminal.
2. Navigate to the Users frontend folder:

```bash
cd Users/frontend
```

3. Install dependencies:

```bash
npm install
```

4. Run the frontend:

```bash
npm run dev
```

---

### 2.2 Backend Setup
1. Open a new terminal.
2. Navigate to the Users backend folder:

```bash
cd Users/backend
```

3. Install dependencies:

```bash
npm install
```

4. Run the backend:

```bash
npm run dev
```

---

## 3. Backend `.env` File Setup

In the backend root folder (where `package.json` is located), create a file named `.env` and paste the following content:

```env
# MySQL
DB_HOST= Your Host Name
DB_PORT= PORT
DB_USER=root
DB_PASSWORD= Your Password
DB_NAME=thana_management

# Server
PORT=4000
NODE_ENV=development
```

This configures the backend database connection and server settings.

---

## 4. Summary

- Each folder (Admin & Users) has separate frontend and backend.
- In every folder, run `npm install` first to install dependencies.
- Use `npm run dev` to run either frontend or backend.
- Set up the `.env` file in the backend before running it.

With these steps, you can easily run the project.
