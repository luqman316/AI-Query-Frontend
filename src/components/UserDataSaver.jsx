"use client";
import { useUser } from "@workos-inc/authkit-nextjs";
import { useEffect } from "react";

export default function UserDataSaver() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Save to localStorage whenever user data is available
      localStorage.setItem("userDetails", JSON.stringify(user));
      console.log("✅ User data saved to localStorage");
    }
  }, [user]);

  return null; // This component doesn't render anything
}