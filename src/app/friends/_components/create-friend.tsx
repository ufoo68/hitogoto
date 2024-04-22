'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button, Modal } from 'flowbite-react'
import { useS3Upload } from 'next-s3-upload'
import { Avatar } from 'flowbite-react'

import { api } from '~/trpc/react'

export function CreateFriend() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  const handleFileChange = async (file: File) => {
    const { url } = await uploadToS3(file)
    setImageUrl(url)
  }

  const createFriend = api.friend.create.useMutation({
    onSuccess: () => {
      setName('')
      setImageUrl('')
      setIsOpen(false)
      router.refresh()
    },
  })

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>新規作成</Button>
      <Modal show={isOpen} dismissible onClose={() => setIsOpen(false)}>
        <Modal.Body className="flex flex-col gap-2">
          <FileInput onChange={handleFileChange} />
          <Avatar img={imageUrl} alt="avatar" rounded size="xl" />
          <Button color="gray" onClick={openFileDialog}>
            写真を選択
          </Button>
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <Button
            type="submit"
            color="blue"
            disabled={createFriend.isLoading}
            onClick={() => {
              createFriend.mutate({
                name,
                thmbnailUrl: imageUrl,
              })
            }}
          >
            作成
          </Button>
        </Modal.Body>
      </Modal>
    </>
  )
}
