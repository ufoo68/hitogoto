"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateEvent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDate(new Date());
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createEvent.mutate({ name, date });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="date"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => setDate(new Date(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-black/10 px-10 py-3 font-semibold transition hover:bg-black/20"
        disabled={createEvent.isLoading}
      >
        イベント新規作成
      </button>
    </form>
  );
}
