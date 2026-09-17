# 💸 Expense Tracker

A full-stack personal expense tracking application built with **Next.js**, **NextAuth.js**, **Prisma ORM**, and **MySQL (Aiven)**. Track, categorize, and manage your daily expenses through a clean, responsive, and secure interface — with a fully unit-tested authentication system.

**Live App:** [https://expensetrackerbydpnshuu.vercel.app](https://expensetrackerbydpnshuu.vercel.app)

---

## ✨ Features

### Authentication & Security
- 🔐 Secure authentication powered by **NextAuth.js** (Credentials + Google OAuth 2.0)
- 📧 Email verification flow on signup (token-based, expiry-controlled)
- 🔁 Forgot Password / Reset Password flow with time-limited reset tokens
- 🔒 Password hashing with **bcrypt**
- 🔄 Session invalidation on password change (token versioning)
- 🛡️ Route protection via NextAuth middleware (`authorized` callback)
- ✅ Zod-based schema validation on every auth endpoint

### Expense Management
- ➕ Add, ✏️ Edit, and 🗑️ Delete expenses
- 📊 Category-wise expense breakdown with percentage insights
- 📅 Custom, timezone-safe date picker
- 📱 Fully responsive UI (mobile + desktop)

### Testing & Quality
- ✅ Backend authentication routes covered with **Jest** unit tests
- 🎯 100% test coverage on signup, login, email verification, and password reset flows
- 🧪 Prisma and bcrypt fully mocked — tests run independently of the live database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Language** | JavaScript |
| **Styling** | Tailwind CSS |
| **Authentication** | NextAuth.js (Credentials Provider + Google OAuth) |
| **Database** | MySQL, hosted on **Aiven** |
| **ORM** | Prisma |
| **Validation** | Zod |
| **Password Hashing** | bcryptjs |
| **Emails** | Nodemailer / Resend |
| **Testing** | Jest (with mocked Prisma & bcrypt) |
| **State Management** | React Context API |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Dpnxhuu/expense-tracker-nextjs.git
cd expense-tracker-nextjs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Database (Aiven MySQL)
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# NextAuth
AUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email service (for verification & password reset emails)
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

### 4. Generate Prisma Client & run migrations
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🧪 Running Tests

This project uses **Jest** to test the authentication system — signup, login, email verification, and password reset — with Prisma and bcrypt mocked so tests never touch the real database.

Run all tests:
```bash
npm test
```

Run tests with a coverage report:
```bash
npm test -- --coverage
```

---

## 📁 Project Structure

```text
├── __tests__/                   # Jest unit tests (signup, login, verify, password reset)
├── app/
│   ├── actions/                 # Server Actions (add, update, delete expense)
│   ├── api/
│   │   ├── auth/                 # Signup, email verification, NextAuth handlers
│   │   └── forgot-password/      # Forgot & reset password routes
│   ├── home/                     # Main dashboard
│   ├── login/
│   ├── signup/
│   └── forgot-password/
├── components/                  # Reusable UI components
├── context/                     # React Context API providers
├── lib/                         # Prisma client, auth logic, mailer, constants
├── prisma/                      # Prisma schema & migrations
├── auth.js                      # NextAuth configuration
└── jest.config.js               # Jest configuration
```

---

## 🙋‍♂️ Author

**Deepanshu**
- GitHub: [@Dpnxhuu](https://github.com/Dpnxhuu)
- LinkedIn: [idpnshuu](https://linkedin.com/in/idpnshuu)
