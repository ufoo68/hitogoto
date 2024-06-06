'use client'

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Input,
  List,
  ListItem,
} from '@yamada-ui/react'
import { useRouter } from 'next/navigation'
import { MdDelete, MdEditDocument } from 'react-icons/md'
import { api } from '~/trpc/react'
import { Friend } from '../_util/types'

type Props = {
  friends: Friend[]
  onSearch: (keyword: string) => void
  onDeleted: () => void
}

export function FriendList({ friends, onSearch, onDeleted }: Props) {
  const router = useRouter()
  const deleteFriend = api.friend.delete.useMutation()
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <Input
          className="max-w-sm flex-1 w-full"
          placeholder="Search"
          type="search"
          onChange={(e) => onSearch(e.target.value)}
        />
      </CardHeader>
      <CardBody className="grid gap-4 pt-4">
        <List>
          {friends.map((friend) => (
            <ListItem
              key={friend.id}
              className="flex justify-between items-center w-full p-4 border-b border-gray-200 gap-5"
            >
              <div
                className="flex items-center space-x-4 w-full"
              >
                <Avatar
                  className="w-10 h-10"
                  src={friend.thmbnailUrl ?? ''}
                  name={friend.name}
                ></Avatar>
                <div className="text-xl">{friend.name}</div>
              </div>
              <div className="flex gap-2">
                <MdEditDocument
                  className="cursor-pointer"
                  size={30}
                  onClick={() => {
                    router.push(`/friends/${friend.id}`)
                  }}
                />
                <MdDelete
                  className="cursor-pointer"
                  size={30}
                  onClick={() => {
                    deleteFriend.mutate(
                      {
                        id: friend.id,
                      },
                      {
                        onSuccess() {
                          onDeleted()
                        },
                      },
                    )
                  }}
                />
              </div>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  )
}
