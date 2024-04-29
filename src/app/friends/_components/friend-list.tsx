'use client'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  List,
  ListItem,
} from '@yamada-ui/react'
import { api } from '~/trpc/react'

export function FriendList() {
  const frineds = api.friend.list.useQuery()
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <Input
          className="max-w-sm flex-1 w-full"
          placeholder="Search"
          type="search"
        />
      </CardHeader>
      <CardBody className="grid gap-4 pt-4">
        <List>
          {frineds.data?.map((friend) => (
            <ListItem key={friend.id} className="flex items-center space-x-4 w-full">
              <Avatar
                className="w-10 h-10"
                src={friend.thmbnailUrl ?? ''}
                name={friend.name}
              ></Avatar>
              <div className="flex-1">
                <div className="font-medium">{friend.name}</div>
              </div>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  )
}
