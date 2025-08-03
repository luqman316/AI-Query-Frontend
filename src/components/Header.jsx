/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getSignInUrl,
  getSignUpUrl,
  withAuth,
} from "@workos-inc/authkit-nextjs";
import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "../actions/logout";

async function Header() {
  const { user } = await withAuth();
  // const [user, setUser] = (useState < User) | (null > null);
  // Default to Chat-Boot organization for login/signup
  const chatBootOrgId = process.env.WORKOS_DEFAULT_ORGANIZATION_ID;

  const signInUrl = await getSignInUrl({
    returnTo: "/", // After login redirect to home
    ...(chatBootOrgId && { organizationId: chatBootOrgId }),
  });

  const signUpUrl = await getSignUpUrl({
    returnTo: "/", // After signup redirect to home
    ...(chatBootOrgId && { organizationId: chatBootOrgId }),
  });

  return (
    <div className="bg-gray-700">
      {/* {JSON.stringify(user, null, 2)} */}
      <header className="">
        <div className="container flex justify-between items-center px-6 mx-auto py-4 ">
          <Link
            href={"/"}
            className="font-bold text-2xl flex items-center gap-1 animate-pulse "
          >
            ChatGPT-Clone
          </Link>
          <nav className="flex gap-2  ">
            {/* user Exist */}
            {user && (
              <div className="relative inline-block text-left group">
                <div className="flex items-center gap-2 cursor-pointer">
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
                {/* DropDown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 hidden group-hover:block transition-all">
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
              </div>
            )}

            {!user && (
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
            {/* {user && (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md cursor-pointer hover:bg-red-600"
                >
                  Logout
                </button>
              </form>
            )} */}
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;
