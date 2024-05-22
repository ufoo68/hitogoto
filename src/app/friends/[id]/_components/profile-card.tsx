'use client'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
  Loading,
} from '@yamada-ui/react'
import { useS3Upload } from 'next-s3-upload'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
type Props = {
  friendId: string
}

export function ProfileCard(props: Props) {
  const { friendId } = props
  const router = useRouter()
  const friend = api.friend.get.useQuery({ id: friendId })
  const updateFriend = api.friend.update.useMutation()
  const deleteFriend = api.friend.delete.useMutation()
  const [profile, setProfile] = useState({
    name: friend.data?.name ?? '',
    thmbnailUrl: friend.data?.thmbnailUrl ?? '',
  })
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()
  const [isUploading, setIsUploading] = useState(false)
  useEffect(() => {
    setProfile({
      name: friend.data?.name ?? '',
      thmbnailUrl: friend.data?.thmbnailUrl ?? '',
    })
  }, [friend.data])

  const handleFileChange = async (file: File) => {
    setIsUploading(true)
    const { url } = await uploadToS3(file)
    setProfile({ ...profile, thmbnailUrl: url })
    setIsUploading(false)
  }
  return (
    <Card>
      <CardHeader>プロフィール</CardHeader>
      <CardBody>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            updateFriend.mutate(
              {
                id: friendId,
                name: profile.name,
                thmbnailUrl: profile.thmbnailUrl,
              },
              {
                onSuccess: () => {
                  friend.refetch()
                },
              },
            )
            router.push('/friends')
          }}
        >
          <div className="w-full flex justify-center">
            <FileInput onChange={handleFileChange} />
            <Avatar
              icon={isUploading ? <Loading /> : undefined}
              className="cursor-pointer"
              onClick={openFileDialog}
              src={isUploading ? undefined : profile.thmbnailUrl}
              alt="avatar"
              size="md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              value={profile.name}
              id="name"
              type="text"
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit" color="blue">
              更新
            </Button>
            <Button
              color="red"
              onClick={() => {
                deleteFriend.mutate({
                  id: friendId,
                })
                router.push('/friends')
              }}
            >
              削除
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
