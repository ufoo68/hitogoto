'use client'

import { useState } from 'react'
import { api } from '~/trpc/react'
import { CreateFriend } from './create-friend'
import { FriendList } from './friend-list'

export function Main() {
  const [keyword, setKeyword] = useState('')
  const friends = api.friend.list.useQuery({
    keyword,
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            ともだち
          </h1>
          <CreateFriend
            onCreated={() => {
              friends.refetch()
            }}
          />
        </div>
        <FriendList
          friends={friends?.data ?? []}
          onSearch={(word) => setKeyword(word)}
          onDeleted={() => {
            friends.refetch()
          }}
        />
      </div>
    </main>
  )
}
