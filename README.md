# 💸 Expense Tracker

A full-stack personal expense tracking app built with **Next.js 15**, **MySQL**, and **Tailwind CSS**. Track, categorize, and manage your daily expenses with a clean and modern UI.

## 🔗 Live Demo
[Click Here](#) <!-- Live link yahan lagana -->

---

## ✨ Features

- 🔐 JWT Authentication (Signup, Login, Logout)
- ➕ Add, ✏️ Edit, 🗑️ Delete expenses
- 📊 Category-wise breakdown with percentages
- 📅 Custom date picker
- 📱 Fully responsive (Mobile + Desktop)
- ☁️ Cloud MySQL database (Railway)

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| Next.js 15 | Next.js Server Actions | MySQL (Railway) |
| Tailwind CSS | JWT + HttpOnly Cookies | mysql2 |
| React Context API | bcrypt | — |

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
`.env.local` file banao:
```env
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

### 4. Run the app
```bash
npm run dev
```

---

## 📁 Project Structure

```
├── app/
│   ├── actions/        # Server Actions (add, update, delete)
│   ├── home/           # Main dashboard
│   ├── login/
│   └── signup/
├── components/         # UI Components
├── context/            # React Context API
└── lib/                # DB connection, constants
```

---

## 🙋‍♂️ Author

**Deepanshu**
- GitHub: [@Dpnxhuu](https://github.com/Dpnxhuu)
- LinkedIn: [idpnshuu](https://linkedin.com/in/idpnshuu)
