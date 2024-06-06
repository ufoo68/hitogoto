'use client'

import { monthEnd, monthStart } from '@formkit/tempo'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { CreateEvent } from './create-event'
import { EventCalendar } from './event-calendar'

export function Main() {
  const [month, setMonth] = useState<Date>(new Date())
  const events = api.event.list.useQuery({
    startAt: monthStart(month),
    endAt: monthEnd(month),
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            できごと
          </h1>
          <CreateEvent onCreated={() => events.refetch()} />
        </div>
        <div className="relative overflow-x-auto">
          <EventCalendar
            events={events?.data ?? []}
            onChangeMonth={setMonth}
            onDeleted={() => events.refetch()}
          />
        </div>
      </div>
    </main>
  )
}
