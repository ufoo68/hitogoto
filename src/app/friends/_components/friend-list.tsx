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
import { useState } from 'react'
import { api } from '~/trpc/react'

export function FriendList() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const frineds = api.friend.list.useQuery({ keyword })
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <Input
          className="max-w-sm flex-1 w-full"
          placeholder="Search"
          type="search"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </CardHeader>
      <CardBody className="grid gap-4 pt-4">
        <List>
          {frineds.data?.map((friend) => (
            <ListItem
              key={friend.id}
              className="flex items-center space-x-4 w-full cursor-pointer"
              onClick={() => router.push(`/friends/${friend.id}`)}
            >
              <Avatar
                className="w-10 h-10"
                src={friend.thmbnailUrl ?? ''}
                name={friend.name}
              ></Avatar>
              <div className="text-xl">{friend.name}</div>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  )
}
