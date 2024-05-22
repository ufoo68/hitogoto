import { redirect } from 'next/navigation'
import { EventFormCard } from './_components/event-form-card'

export default async function Event({ params }: { params: { id: string } }) {
  const { id } = params
  if (typeof id !== 'string') {
    redirect('/events')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <EventFormCard eventId={id} />
    </main>
  )
}
