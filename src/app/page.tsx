import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateFriend } from "./_components/create-friend";
import { CreateEvent } from "./_components/create-event";

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
        <div className="flex flex-row gap-1">
          <div className="flex flex-col items-center">
            <h2>友達一覧</h2>
            <FriendList />
          </div>
          <div className="flex flex-col items-center">
            <h2>イベント一覧</h2>
            <EventList />
          </div>
        </div>
      </div>
    </main>
  );
}

async function FriendList() {
  const friends = await api.friend.lsit.query();
  return (
    <div className="w-full">
      {friends.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {friends.map((friend) => (
            <li key={friend.id} className="flex items-center gap-2">
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>友達が登録されていません</p>
      )}
      <CreateFriend />
    </div>
  );
}

async function EventList() {
  const events = await api.event.lsit.query();
  return (
    <div className="w-full">
      {events.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {events.map((event) => (
            <li key={event.id} className="flex items-center gap-2">
              <span>{event.name}</span>
              <span>{new Date(event.date).toISOString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>イベントが登録されていません</p>
      )}
      <CreateEvent />
    </div>
  );
}
