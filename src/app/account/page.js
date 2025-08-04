"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please log in to view account details.
      </div>
    );
  }

  return (
     <div className="container mx-auto py-10 px-4">
      <div className="bg- rounded-xl shadow-lg p-8 max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={user.profilePictureUrl || "/default-profile.png"}
            alt={user.firstName || "User"}
            width={96}
            height={96}
            className="rounded-full border-2 border-blue-200 shadow"
          />
          <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Account Details</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <span className="font-medium">First Name:</span> {user.firstName}
            </li>
            <li>
              <span className="font-medium">Last Name:</span> {user.lastName}
            </li>
            <li>
              <span className="font-medium">Email:</span> {user.email}
            </li>
            <li>
                <span className="font-medium">Last-Sign-In:</span> {user.lastSignInAt || "N/A"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
