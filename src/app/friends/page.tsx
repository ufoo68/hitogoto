import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateFriend } from "~/app/friends/_components/create-friend";
export default async function Friends() {
  noStore();
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          友達一覧
        </h1>
        <CreateFriend />
        <FriendList />
      </div>
    </main>
  );
}

async function FriendList() {
  const friends = await api.friend.lsit.query();
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <tbody>
          {friends.map((friend) => (
            <tr
              key={friend.id}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {friend.thmbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-12 w-12 rounded-full"
                    src={friend.thmbnailUrl}
                    alt="Rounded avatar"
                  />
                ) : (
                  <svg
                    className="h-12 w-12 text-gray-400"
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
              </th>
              <td className="px-6 py-4">{friend.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
