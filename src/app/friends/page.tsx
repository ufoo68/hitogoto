import { FriendList } from './_components/friend-list'
import { CreateFriend } from '~/app/friends/_components/create-friend'
export default async function Friends() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            ともだち
          </h1>
          <CreateFriend />
        </div>
        <FriendList />
      </div>
    </main>
  )
}
