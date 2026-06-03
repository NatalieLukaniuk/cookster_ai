"use client";
import { useUserEmail } from "@/app/_lib/UserContext";
import Link from "next/link";

export default function Header() {
     const userEmail = useUserEmail();
  return (
    <header className="w-full py-4 px-6 bg-white dark:bg-black shadow-sm">
      <Link
        href="/"
        className="text-2xl font-bold text-zinc-950 dark:text-white"
      >
        Cookster AI: додайте рецепт разом з ШІ! 🍳
      </Link>
        {userEmail && (
          <p className="text-sm text-muted-foreground">
            Logged in as: {userEmail}
          </p>
        )}
    </header>
  );
}
