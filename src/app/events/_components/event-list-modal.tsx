import {
  Avatar,
  AvatarGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from '@yamada-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

type Props = {
  isOpen: boolean
  onClose: () => void
  events: {
    id: string
    name: string
    description: string
    date: Date
    participants: {
      id: string
      name: string
      thmbnailUrl: string
    }[]
  }[]
}

export function EventListModal({ isOpen, onClose, events }: Props) {
  const eventDate = events[0]?.date
  const router = useRouter()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        {dayjs(eventDate).format('YYYY年MM月DD日')}のできごと
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-1 overflow-hidden">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <AvatarGroup max={3}>
                {event.participants.map((participant) => (
                  <Avatar
                    key={participant.id}
                    name={participant.name}
                    src={participant.thmbnailUrl}
                  />
                ))}
              </AvatarGroup>
              <div className="text-xl truncate max-w-52">{event.name}</div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  )
}
