import Link from 'next/link'
import { FaUserFriends, FaCalendar } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/friends"
            className="flex gap-1 items-center rounded-lg border border-gray-200 bg-white pb-6 pl-12 pr-12 pt-6 text-3xl font-bold shadow"
          >
            <FaUserFriends />
            <span>ともだち</span>
          </Link>
          <Link
            href="/events"
            className="flex gap-1 items-center rounded-lg border border-gray-200 bg-white pb-6 pl-12 pr-12 pt-6 text-3xl font-bold shadow"
          >
            <FaCalendar />
            <span>できごと</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
