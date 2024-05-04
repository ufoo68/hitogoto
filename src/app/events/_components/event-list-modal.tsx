import { List, ListItem, Modal, ModalBody } from '@yamada-ui/react'
import { useEffect, useState } from 'react'

type Props = {
  isSelected: boolean
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

export function EventListModal({
  isSelected,
  events
}: Props) {
  const [isOpen, setIsOpen] = useState(isSelected)
  useEffect(() => {
    setIsOpen(isSelected)
  }, [isSelected])
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalBody>
        <List w="full" gap="sm">
          {events.map((event) => (
            <ListItem key={event.id}>
              <div>{event.name}</div>
              <div>{event.date.toLocaleDateString()}</div>
              <div>{event.description}</div>
              <List w="full" gap="sm">
                {event.participants.map((participant) => (
                  <ListItem key={participant.id}>
                    <div>{participant.name}</div>
                    <div>{participant.thmbnailUrl}</div>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  )
}
