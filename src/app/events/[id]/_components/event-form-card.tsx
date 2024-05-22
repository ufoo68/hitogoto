'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  MultiSelect,
  Option,
} from '@yamada-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'

type Props = {
  eventId: string
}

export function EventFormCard(props: Props) {
  const { eventId } = props
  const router = useRouter()
  const event = api.event.get.useQuery({ id: eventId })
  const friends = api.friend.list.useQuery({})
  const updateEvent = api.event.update.useMutation()
  const deleteEvent = api.event.delete.useMutation()
  const [eventData, setEventData] = useState({
    name: event.data?.name ?? '',
    date: event.data?.date ?? new Date(),
    friendIds: event.data?.participants.map((p) => p.friend?.id ?? '') ?? [],
  })
  useEffect(() => {
    setEventData({
      name: event.data?.name ?? '',
      date: event.data?.date ?? new Date(),
      friendIds: event.data?.participants.map((p) => p.friend?.id ?? '') ?? [],
    })
  }, [event.data])
  return (
    <Card>
      <CardHeader>できごと</CardHeader>
      <CardBody className="h-100">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            updateEvent.mutate({
              id: eventId,
              name: eventData.name,
              date: eventData.date,
              friendIds: eventData.friendIds,
            })
            router.push('/events')
          }}
        >
          <Input
            type="text"
            placeholder="タイトル"
            value={eventData.name}
            onChange={(e) =>
              setEventData({
                ...eventData,
                name: e.target.value,
              })
            }
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <MultiSelect
            placeholder="友達を選ぶ"
            value={eventData.friendIds}
            onChange={(v) => {
              setEventData({
                ...eventData,
                friendIds: v,
              })
            }}
          >
            {friends?.data?.map((friend) => (
              <Option key={friend.id} value={friend.id}>
                {friend.name}
              </Option>
            ))}
          </MultiSelect>
          <Input
            type="date"
            value={dayjs(eventData.date).format('YYYY-MM-DD')}
            onChange={(e) => {
              setEventData({
                ...eventData,
                date: dayjs(e.target.value, 'YYYY-MM-DD').toDate(),
              })
            }}
          />
          <div className="flex justify-between">
            <Button type="submit" color="blue">
              更新
            </Button>
            <Button
              color="red"
              onClick={() => {
                deleteEvent.mutate({
                  id: eventId,
                })
                router.push('/events')
              }}
            >
              削除
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
