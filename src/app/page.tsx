import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { SignOutButton } from "~/app/_component/sign-out-button";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Link
          href="/friends"
          className="rounded-lg border border-gray-200 bg-white pb-6 pl-12 pr-12 pt-6 text-3xl font-bold shadow"
        >
          ヒト
        </Link>
        <Link
          href="/events"
          className="rounded-lg border border-gray-200 bg-white pb-6 pl-12 pr-12 pt-6 text-3xl font-bold shadow"
        >
          ゴト
        </Link>
      </div>
      <SignOutButton />
      </div>
    </main>
  );
}
