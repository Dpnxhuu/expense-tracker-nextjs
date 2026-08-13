"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ErrorAlert({ message, redirectTo = "/login" }) {
  const router = useRouter();

  useEffect(() => {
    (async function (){
    if (message) {
      alert(message);
      await axios.post("/api/auth/logout")
      router.push(redirectTo);
    }
    })();
  }, [message, redirectTo, router]);

  return null;
}