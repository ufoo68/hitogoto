'use client'

import { monthEnd, monthStart } from '@formkit/tempo'
import { Calendar } from '@yamada-ui/calendar'
import { Center, List, ListItem, VStack } from '@yamada-ui/react'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'

export function EventCalendar() {
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
      dateFormat="YYYY年 MMMM"
      locale="ja"
      size="full"
      type="date"
      headerProps={{ mb: 2 }}
      labelProps={{ pointerEvents: 'none', icon: { display: 'none' } }}
      tableProps={{
        border: '1px solid',
        borderColor: 'border',
        th: { border: '1px solid', borderColor: 'border' },
        td: { border: '1px solid', borderColor: 'border' },
      }}
      onChangeMonth={setMonth}
      dayProps={{
        h: 'auto',
        p: 2,
        _selected: {},
        _hover: {},
        _active: {},
        _ripple: {
          display: 'none',
        },
        transitionProperty: 'none',
        component: ({ date, isSelected }) => {
          const eventOnDay =
            events.data?.filter(
              (event) =>
                date.getFullYear() === event.date.getFullYear() &&
                date.getMonth() === event.date.getMonth() &&
                date.getDate() === event.date.getDate(),
            ) ?? []
          return (
            <VStack alignItems="center">
              <Center
                bg={isSelected ? 'primary' : undefined}
                w={8}
                lineHeight={8}
                rounded="full"
                color={isSelected ? 'white' : undefined}
                transitionProperty="background"
                transitionDuration="normal"
              >
                {date.getDate()}
              </Center>
              <List w="full" gap="sm">
                {eventOnDay.map((event) => (
                  <ListItem
                    key={event.id}
                    w="full"
                    py="1"
                    px="2"
                    bg="secondary"
                    color="white"
                    fontSize="sm"
                    lineHeight="taller"
                    rounded="md"
                  >
                    {event.name}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )
        },
      }}
    />
  )
}
