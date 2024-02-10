"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Modal, Datepicker } from "flowbite-react";

import { api } from "~/trpc/react";

export function CreateEvent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      setName("");
      setDate(new Date());
      setIsOpen(false);
      router.refresh();
    },
  });
  api.friend.list.useQuery(undefined, {
    onSuccess: (data) => {
      setFriends(data);
    },
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>新規作成</Button>
      <Modal show={isOpen} dismissible onClose={() => setIsOpen(false)}>
        <Modal.Body className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder="タイトル"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <select
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(e) => {
              setSelectedFriendIds([e.target.value]);
            }}
          >
            <option selected>友達を選択</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
          <Datepicker
            inline
            onSelectedDateChanged={(d) => {
              setDate(d);
            }}
            showClearButton={false}
          />
          <Button
            className="w-full"
            type="submit"
            color="blue"
            disabled={createEvent.isLoading}
            onClick={() => {
              createEvent.mutate({
                name,
                date,
                friendIds: selectedFriendIds,
              });
            }}
          >
            作成
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
