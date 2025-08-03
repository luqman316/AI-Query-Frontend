"use server";

import { signOut } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export async function logoutAction() {
  // "use server";
  await signOut();
  redirect("/"); // Redirect to home page after logout
}
