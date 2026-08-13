"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ErrorAlert({ message, redirectTo = "/login" }) {
  const router = useRouter();

  useEffect(() => {
    if (!message) return;

    const logout = async () => {
      const logoutPromise = axios.post("/api/auth/logout");
      alert(message);                                       
      await logoutPromise;                                    
      router.push(redirectTo);                               
    };

    logout();
  }, [message, redirectTo, router]);

  return null;
}