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
          <Link href="/">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              戻る
            </button>
          </Link>
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
