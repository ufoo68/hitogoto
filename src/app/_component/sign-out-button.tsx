"use client";

import { Button } from "flowbite-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>ログアウト</Button>;
}