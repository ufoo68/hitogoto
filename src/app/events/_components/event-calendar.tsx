'use client'

import { monthEnd, monthStart } from '@formkit/tempo'
import { Calendar } from '@yamada-ui/calendar'
import { Center, Indicator } from '@yamada-ui/react'
import 'dayjs/locale/ja'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { EventListModal } from './event-list-modal'

export const EventCalendar = dynamic(
  () =>
    import('./event-calendar').then(
      ({ EventCalendarDynamic }) => EventCalendarDynamic,
    ),
  {
    ssr: false,
  },
)

export function EventCalendarDynamic() {
  const [month, setMonth] = useState<Date>(new Date())
  const events = api.event.list.useQuery({
    startAt: monthStart(month),
    endAt: monthEnd(month),
  })
  useEffect(() => {
    events.refetch()
  }, [month])
  return (
    <Calendar
      suppressHydrationWarning
      dateFormat="YYYY年 MMMM"
      locale="ja"
      size="full"
      type="date"
      headerProps={{ mb: 2 }}
      tableProps={{
        border: '1px solid',
        borderColor: 'border',
        th: { border: '1px solid', borderColor: 'border' },
        td: { border: '1px solid', borderColor: 'border' },
      }}
      onChangeMonth={setMonth}
      dayProps={{
        h: 'auto',
        p: 3,
        _selected: {},
        _hover: {},
        _active: {},
        _ripple: {
          display: 'none',
        },
        transitionProperty: 'none',
        component: ({ date, isSelected }) => {
          const eventOnDay = (
            events.data?.filter(
              (event) =>
                date.getFullYear() === event.date.getFullYear() &&
                date.getMonth() === event.date.getMonth() &&
                date.getDate() === event.date.getDate(),
            ) ?? []
          ).map((event) => {
            return {
              id: event.id,
              name: event.name,
              description: event.description ?? '',
              date: event.date,
              participants: event.participants.map((participant) => {
                return {
                  id: participant.id,
                  name: participant.friend?.name ?? '',
                  thmbnailUrl: participant.friend?.thmbnailUrl ?? '',
                }
              }),
            }
          })
          return (
            <div>
              <Indicator
                size="sm"
                showZero={false}
                label={eventOnDay.length}
                ping
                pingScale={1.4}
                withBorder
              >
                <Center
                  bg={isSelected ? 'secondary' : undefined}
                  w={8}
                  lineHeight={8}
                  rounded="full"
                  color={isSelected ? 'white' : undefined}
                  transitionProperty="background"
                  transitionDuration="normal"
                >
                  {date.getDate()}
                </Center>
              </Indicator>
              <EventListModal
                isSelected={isSelected && eventOnDay.length > 0}
                events={eventOnDay}
              />
            </div>
          )
        },
      }}
    />
  )
}
