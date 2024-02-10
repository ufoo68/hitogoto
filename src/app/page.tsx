import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          人と出来事のメモアプリ
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/friends"
            className="rounded-lg border border-gray-200 bg-white p-6 text-2xl font-bold shadow"
          >
            HITO
          </Link>
          <Link
            href="/events"
            className="rounded-lg border border-gray-200 bg-white p-6 text-2xl font-bold shadow"
          >
            GOTO
          </Link>
        </div>
      </div>
    </main>
  );
}
