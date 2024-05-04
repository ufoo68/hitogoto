import { redirect } from 'next/navigation'
import { ProfileCard } from './_components/profile-card'

export default async function Friend({ params }: { params: { id: string } }) {
  const { id } = params
  if (typeof id !== 'string') {
    redirect('/friends')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <ProfileCard  friendId={id} />
    </main>
  )
}
