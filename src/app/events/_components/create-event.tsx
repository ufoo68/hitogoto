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

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      setName("");
      setDate(new Date());
      setIsOpen(false);
      router.refresh();
    },
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>新規作成</Button>
      <Modal show={isOpen} dismissible onClose={() => setIsOpen(false)}>
        <Modal.Header />
        <Modal.Body className="flex flex-col gap-2 items-center">
          <input
            type="text"
            placeholder="タイトル"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
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
