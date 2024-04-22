import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { friends } from '~/server/db/schema'

export const friendRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.friends.findMany({
      where: (friend, { eq }) => eq(friend.createdUserId, ctx.session.user.id),
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
})
