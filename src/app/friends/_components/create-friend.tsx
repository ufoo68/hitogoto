'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Avatar,
  Button,
  Loading,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@yamada-ui/react'
import { useS3Upload } from 'next-s3-upload'

import { api } from '~/trpc/react'

export function CreateFriend() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (file: File) => {
    setIsUploading(true)
    const { url } = await uploadToS3(file)
    setImageUrl(url)
    setIsUploading(false)
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
      <Button colorScheme="primary" onClick={() => setIsOpen(true)}>
        新規作成
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>プロフィール</ModalHeader>
        <ModalBody>
          <div className="flex justify-center w-full">
            <FileInput onChange={handleFileChange} />
            <Avatar
              icon={isUploading ? <Loading /> : undefined}
              className="cursor-pointer"
              onClick={openFileDialog}
              src={imageUrl}
              alt="avatar"
              size="xl"
            />
          </div>
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </Modal>
    </>
  )
}
