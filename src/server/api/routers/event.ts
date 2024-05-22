import { get } from 'http'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { events, eventParticipants } from '~/server/db/schema'

export const eventRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        startAt: z.date(),
        endAt: z.date(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.events.findMany({
        where: (friend, { eq, between, and }) =>
          and(
            eq(friend.createdUserId, ctx.session.user.id),
            between(events.date, input.startAt, input.endAt),
          ),
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
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.events.findFirst({
        where: (event, { eq }) => eq(event.id, input.id),
        with: {
          participants: {
            with: {
              friend: true,
            },
          },
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        date: z.date().optional(),
        friendIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(events)
        .set({
          name: input.name,
          date: input.date,
        })
        .where(eq(events.id, input.id))
      if (input.friendIds) {
        await ctx.db
          .delete(eventParticipants)
          .where(eq(eventParticipants.eventId, input.id))
        await ctx.db.insert(eventParticipants).values(
          input.friendIds.map((friendId) => ({
            eventId: input.id,
            friendId,
          })),
        )
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(events).where(eq(events.id, input.id))
    }),
})
