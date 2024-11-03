'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Avatar,
  Button,
  Input,
  Loading,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@yamada-ui/react'
import { usePresignedUpload } from 'next-s3-upload'

import { api } from '~/trpc/react'

type Props = {
  onCreated: () => void
}

export function CreateFriend({ onCreated }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const { uploadToS3 } = usePresignedUpload()
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
          <div className="flex justify-center w-full flex-col items-center">
            <Avatar
              icon={isUploading ? <Loading /> : undefined}
              className="cursor-pointer"
              src={imageUrl}
              alt="avatar"
              size="xl"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0])
                }
              }}
            />
          </div>
          <Input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="blue"
            disabled={createFriend.isLoading}
            onClick={() => {
              createFriend.mutate(
                {
                  name,
                  thmbnailUrl: imageUrl,
                },
                {
                  onSuccess() {
                    onCreated()
                  },
                },
              )
            }}
          >
            作成
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
