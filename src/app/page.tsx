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
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          hitogoto
        </h1>
        <div className="flex flex-col items-center">
          <Link href="/friends" className="text-2xl font-bold">
            友達一覧
          </Link>
          <Link href="/events" className="text-2xl font-bold">
            イベント一覧
          </Link>
        </div>
      </div>
    </main>
  );
}
