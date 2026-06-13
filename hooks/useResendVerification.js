import { useState } from "react";

export default function useResendVerification(){

  const [status, setStatus] = useState(false);
 
  const resendVerification = async () =>{
    try {
      const res = await fetch(`/api/auth/resend-verification`);
      const data = await res.json();

      if (res.ok) {
        setStatus(true)
      }
      else{
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message);
      setStatus(false)
    }
  }

  return {resendVerification, status}

}