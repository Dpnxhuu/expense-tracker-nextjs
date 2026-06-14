"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "../auth/AuthShell";

function validateField(name, value, form) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== form.password) return "Passwords do not match";
      return "";
    default:
      return "";
  }
}

export function VerificationSent({ email }) {
  return (
    <div className="dark-page app-gradient min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 mx-auto mb-5">
          <span className="text-2xl">✉️</span>
        </div>

        {/* Text */}
        <p className="section-label mb-2">Almost there</p>
        <h2 className="text-lg font-semibold mb-2">Verify your email</h2>
        <p className="text-sm text-muted mb-1">
          We've sent a verification link to
        </p>
        <p className="text-sm font-medium text-accent mb-6 truncate px-4">
          {email}
        </p>
        <p className="text-sm text-muted mb-6">
          Click the link in the email to activate your account. The link will expire in 24 hours.
        </p>

        {/* Resend */}
        {/* <div className="border-t border-border/40 pt-5">
          <p className="text-xs text-muted/60">
            Didn't receive the email?{" "}
            <button className="text-accent hover:text-accent/80 transition-colors font-medium">
              Resend verification email
            </button>
          </p>
        </div> */}

      </div>
    </div>
  )
}

export default function EmailComp() {

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: validateField("name", form.name, form),
    email: validateField("email", form.email, form),
    password: validateField("password", form.password, form),
    confirmPassword: validateField("confirmPassword", form.confirmPassword, form),
  };

  const isValid = Object.values(errors).every((e) => !e);

  const showError = useCallback(
    (field) => (submitted || touched[field]) && errors[field],
    [submitted, touched, errors]
  );

  const fieldState = useCallback(
    (field) => {
      if (showError(field)) return "error";
      if ((submitted || touched[field]) && !errors[field] && form[field])
        return "valid";
      return "default";
    },
    [showError, errors, submitted, touched, form]
  );

  const inputClass = (field) => {
    const state = fieldState(field);
    if (state === "error") return "input-base input-error";
    if (state === "valid") return "input-base input-valid";
    return "input-base";
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitted(true);

      if (!isValid) return;

      setLoading(true)

      try{

        const res = await fetch("/api/auth/register",{
          method: "POST",
          headers:{
            'Content-Type': "application/json"
          },
          body: JSON.stringify(form)
        })

        const data = await res.json();

        if(res.ok){
          setSent(true);
        }else{
          throw new Error(data.message)
        }

      }catch(error){
        alert(error.message)
      }finally{
        setLoading(false)
      }
    },
    [form, isValid]
  );

  if (sent) return <VerificationSent email={form.email} />

  return (
    <AuthShell
      title="Sign up with email"
      subtitle="Create your Expense Tracker account"
    >
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("name")}
              autoComplete="name"
            />
            {showError("name") && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("email")}
              autoComplete="email"
            />
            {showError("email") && (
              <p className="field-error">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("password")}
              autoComplete="new-password"
            />
            {showError("password") && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("confirmPassword")}
              autoComplete="new-password"
            />
            {showError("confirmPassword") && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-primary mt-1 w-full py-3 shadow-glow">
            {loading? "Signing..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Log In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
