"use server";

import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export async function loginAction() {
  const url = await getSignInUrl({ returnTo: "/" });
  redirect(url);
}
