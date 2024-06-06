import {
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
} from '@yamada-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { MdDelete, MdEditDocument } from 'react-icons/md'
import { api } from '~/trpc/react'
import { Event } from '../_util/types'

type Props = {
  isOpen: boolean
  onClose: () => void
  events: Event[]
  onDeleted: () => void
}

export function EventListModal({ isOpen, onClose, events, onDeleted }: Props) {
  const eventDate = events[0]?.date
  const router = useRouter()
  const deleteEvent = api.event.delete.useMutation()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        {dayjs(eventDate).format('YYYY年MM月DD日')}のできごと
      </ModalHeader>
      <ModalBody>
        <List className="w-full">
          {events.map((event) => (
            <ListItem
              key={event.id}
              className="flex justify-between items-center w-full p-4 border-b border-gray-200 gap-5"
            >
              <div className="flex gap-1 items-center">
                <AvatarGroup max={3}>
                  {event.participants.map((participant) => (
                    <Avatar
                      key={participant.id}
                      name={participant.friend?.name}
                      src={participant.friend?.thmbnailUrl ?? ''}
                    />
                  ))}
                </AvatarGroup>
                <div className="text-xl truncate max-w-52">{event.name}</div>
              </div>
              <div className="flex gap-2">
                <MdEditDocument
                  className="cursor-pointer"
                  size={30}
                  onClick={() => router.push(`/events/${event.id}`)}
                />
                <MdDelete
                  className="cursor-pointer"
                  size={30}
                  onClick={() => {
                    deleteEvent.mutate(
                      {
                        id: event.id,
                      },
                      {
                        onSuccess() {
                          onDeleted()
                        },
                      },
                    )
                  }}
                />
              </div>
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  )
}
