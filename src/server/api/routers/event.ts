import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { events, eventParticipants } from '~/server/db/schema'

export const eventRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.events.findMany({
      where: (friend, { eq }) => eq(friend.createdUserId, ctx.session.user.id),
      with: {
        participants: {
          with: {
            friend: true,
          },
        },
      },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.date(),
        friendIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const savedEvents = await ctx.db
        .insert(events)
        .values({
          name: input.name,
          date: input.date,
          createdUserId: ctx.session.user.id,
        })
        .returning()
      const eventId = savedEvents[0]?.id
      if (input.friendIds.length > 0 && eventId) {
        await ctx.db.insert(eventParticipants).values(
          input.friendIds.map((friendId) => ({
            eventId,
            friendId,
          })),
        )
      }
    }),
})
