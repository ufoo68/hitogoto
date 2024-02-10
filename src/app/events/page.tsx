import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateEvent } from "~/app/events/_components/create-event";

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
          イベント一覧
        </h1>
        <CreateEvent />
        <EventList />
      </div>
    </main>
  );
}

async function EventList() {
  const events = await api.event.lsit.query();
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {new Date(event.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </th>
              <td className="text-2xl font-extrabold">{event.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
