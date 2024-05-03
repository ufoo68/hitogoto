import Link from 'next/link'
import { CreateEvent } from '~/app/events/_components/create-event'
import { EventCalendar } from './_components/event-calendar'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            できごと
          </h1>
          <CreateEvent />
        </div>
        <EventList />
      </div>
    </main>
  )
}

async function EventList() {
  return (
    <div className="relative overflow-x-auto">
      <EventCalendar />
    </div>
  )
}
