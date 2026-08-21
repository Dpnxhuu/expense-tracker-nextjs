# 💸 Expense Tracker

A full-stack personal expense tracking app built with **Next.js 16**, **MySQL (Aiven)**, **Prisma ORM**, and **Tailwind CSS**. Track, categorize, and manage your daily expenses with a clean and modern UI.

## 🔗 Live Demo
[Click Here](https://expensetrackerbydpnshuu.vercel.app)

---

## ✨ Features

- 🔐 JWT Authentication (Signup, Login, Logout) with HttpOnly cookies
- 🔑 **Sign in with Google** (OAuth 2.0)
- 📧 Email verification on signup
- 🔁 Forgot Password / Reset Password flow (email-based)
- 🔒 Session invalidation on password change (token versioning)
- ➕ Add, ✏️ Edit, 🗑️ Delete expenses
- 📊 Category-wise breakdown with percentages
- 📅 Custom date picker (timezone-safe date handling)
- 📱 Fully responsive (Mobile + Desktop)
- ☁️ Cloud MySQL database (Aiven) via Prisma ORM

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| Next.js 16 (App Router) | Next.js Server Actions + Route Handlers | MySQL (Aiven) |
| Tailwind CSS | JWT + HttpOnly Cookies | Prisma ORM |
| React Context API | bcryptjs | @prisma/adapter-mariadb |
| Zod (validation) | Nodemailer / Resend (emails) | — |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Dpnxhuu/expense-tracker-nextjs.git
cd expense-tracker-nextjs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables setup
`.env` file:
```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Generate Prisma Client & run migrations
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the app
```bash
npm run dev
```

---

## 📁 Project Structure

```text
├── app/
│ ├── actions/ # Server Actions (add, update, delete expense)
│ ├── api/
│ │ ├── auth/ # Login, logout, me, google OAuth
│ │ └── forgot-password/ # Forgot & reset password routes
│ ├── home/ # Main dashboard
│ ├── login/
│ ├── signup/
│ └── forgot-password/
├── components/ # UI Components
├── context/ # React Context API
├── lib/ # Prisma client, auth helpers, mailer, constants
└── prisma/ # Prisma schema & migrations
```

## 🙋‍♂️ Author
**Deepanshu**
- GitHub: [@Dpnxhuu](https://github.com/Dpnxhuu)
- LinkedIn: [idpnshuu](https://linkedin.com/in/idpnshuu)
