import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { friends } from '~/server/db/schema'

export const friendRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { keyword } = input
      return ctx.db.query.friends.findMany({
        where: (friend, { eq, and, like }) =>
          keyword
            ? and(
                eq(friend.createdUserId, ctx.session.user.id),
                like(friend.name, `%${keyword}%`),
              )
            : eq(friend.createdUserId, ctx.session.user.id),
      })
    }),
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), thmbnailUrl: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(friends).values({
        name: input.name,
        thmbnailUrl: input.thmbnailUrl,
        createdUserId: ctx.session.user.id,
      })
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.friends.findFirst({
        where: (friend, { eq }) => eq(friend.id, input.id),
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        thmbnailUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(friends)
        .set({
          name: input.name,
          thmbnailUrl: input.thmbnailUrl,
        })
        .where(eq(friends.id, input.id))
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(friends).where(eq(friends.id, input.id))
    }),
})
