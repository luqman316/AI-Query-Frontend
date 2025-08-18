"use client";
import {
  getSignInUrl,
  getSignUpUrl,
  withAuth,
} from "@workos-inc/authkit-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "../actions/logout";

function Header() {
  const [user, setUser] = useState(null);
  const [signInUrl, setSignInUrl] = useState("#");
  const [signUpUrl, setSignUpUrl] = useState("#");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const { user } = await withAuth();

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        await fetch("http://localhost:5000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePictureUrl: user.profilePictureUrl,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastSignInAt: user.lastSignInAt,
          }),
        });
        setUser(user);
      } else {
        setUser(null);
        window.localStorage.removeItem("user");
      }

      const chatBootOrgId =
        process.env.NEXT_PUBLIC_WORKOS_DEFAULT_ORGANIZATION_ID;
      const [signIn, signUp] = await Promise.all([
        getSignInUrl({
          returnTo: "/",
          ...(chatBootOrgId && { organizationId: chatBootOrgId }),
        }),
        getSignUpUrl({
          returnTo: "/",
          ...(chatBootOrgId && { organizationId: chatBootOrgId }),
        }),
      ]);
      setSignInUrl(signIn);
      setSignUpUrl(signUp);
    };

    fetchAuth();
  }, []);

  // ! Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-700">
      <header>
        <div className="container flex justify-between items-center px-6 mx-auto py-4">
          <Link
            href={"/"}
            className="font-bold text-2xl flex items-center gap-1 animate-pulse"
          >
            ChatGPT-Clone
          </Link>
          <nav className="flex">
            {/* * user info */}
            {user ? (
              <div
                className="relative inline-block  text-left"
                ref={dropdownRef}
              >
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Image
                    src={user.profilePictureUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full border"
                  />
                  <span className="text-white font-medium">
                    {user.firstName}
                  </span>
                </div>

                {/* !Dropdown - shown on click */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 transition-all">
                    <div className="py-2 text-sm text-gray-700">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Account Info
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
              
                  <Link
                    className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-600"
                    href={signInUrl}
                  >
                    Login
                  </Link>
                  <Link
                    className="bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-green-600"
                    href={signUpUrl}
                  >
                    Sign Up
                  </Link>
                
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;
