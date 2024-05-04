'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  Option,
} from '@yamada-ui/react'

import { api } from '~/trpc/react'

export function CreateEvent() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [friends, setFriends] = useState<
    {
      id: string
      name: string
    }[]
  >([])
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      setName('')
      setDate(new Date())
      setIsOpen(false)
      router.refresh()
    },
  })
  api.friend.list.useQuery({}, {
    onSuccess: (data) => {
      setFriends(data)
    },
  })

  return (
    <>
      <Button colorScheme="primary" onClick={() => setIsOpen(true)}>
        新規作成
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>できごと</ModalHeader>
        <ModalBody className="h-100">
          <Input
            type="text"
            placeholder="タイトル"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <MultiSelect
            placeholder="友達を選ぶ"
            value={selectedFriendIds}
            onChange={(v) => {
              setSelectedFriendIds(v)
            }}
          >
            {friends.map((friend) => (
              <Option key={friend.id} value={friend.id}>
                {friend.name}
              </Option>
            ))}
          </MultiSelect>
          <Input type="date" />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="blue"
            disabled={createEvent.isLoading}
            onClick={() => {
              createEvent.mutate({
                name,
                date,
                friendIds: selectedFriendIds,
              })
            }}
          >
            作成
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
