'use client'

import { Calendar } from '@yamada-ui/calendar'
import { Center, Indicator } from '@yamada-ui/react'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { EventListModal } from './event-list-modal'
import { Event } from '../_util/types'

export const EventCalendar = dynamic(
  () =>
    import('./event-calendar').then(
      ({ EventCalendarDynamic }) => EventCalendarDynamic,
    ),
  {
    ssr: false,
  },
)

type Props = {
  events: Event[]
  onChangeMonth: (date: Date) => void
  onDeleted: () => void
}

export function EventCalendarDynamic({ events, onChangeMonth, onDeleted }: Props) {
  
  const [selectedDate, setSelectedDate] = useState<Date | null>()
  
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
      onChangeMonth={onChangeMonth}
      dayProps={{
        h: 'auto',
        _selected: {},
        _hover: {},
        _active: {},
        _ripple: {
          display: 'none',
        },
        transitionProperty: 'none',
        component: ({ date, isSelected }) => {
          const eventOnDay = (
            events.filter(
              (event) =>
                date.getFullYear() === event.date.getFullYear() &&
                date.getMonth() === event.date.getMonth() &&
                date.getDate() === event.date.getDate(),
            ) ?? []
          )
          return (
            <div
              className="p-2"
              onClick={() => {
                if (eventOnDay.length > 0) {
                  setSelectedDate(date)
                }
              }}
            >
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
                isOpen={
                  Boolean(selectedDate) &&
                  dayjs(selectedDate).isSame(date, 'date')
                }
                onClose={() => setSelectedDate(null)}
                events={eventOnDay}
                onDeleted={() => {
                  onDeleted()
                  setSelectedDate(null)
                }}
              />
            </div>
          )
        },
      }}
    />
  )
}
