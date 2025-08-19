"use server";

import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export async function signUpAction() {
  const url = await getSignUpUrl({ returnTo: "/" });
  redirect(url);
}
