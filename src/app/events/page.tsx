import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateEvent } from "~/app/events/_components/create-event";
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
        <div className="flex gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            できごと
          </h1>
          <CreateEvent />
          <Link href="/">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              戻る
            </button>
          </Link>
        </div>
        <EventList />
      </div>
    </main>
  );
}

async function EventList() {
  const events = await api.event.list.query();
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
              <td>
                {event.participants.map((participant) => (
                  <div
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white shadow p-1"
                    key={participant.id}
                  >
                    {participant?.friend?.thmbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-8 w-8 rounded-full"
                        src={participant?.friend?.thmbnailUrl}
                        alt="Rounded avatar"
                      />
                    ) : (
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    )}
                    <div>{participant?.friend?.name}</div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
