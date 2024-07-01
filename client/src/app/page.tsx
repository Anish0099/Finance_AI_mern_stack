"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {user ? (
        <div className="flex gap-4 items-center justify-center">
          <Link href={"/dashboard"}>
            <Button>Go to DashBoard</Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link href={"/sign-in"}>
          <Button>Sign-in</Button>
        </Link>
      )}
    </main>
  );
}
