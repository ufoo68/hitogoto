import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";

export const eventRouter = createTRPCRouter({
  lsit: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.events.findMany({
      where: (friend, { eq }) => eq(friend.createdUserId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), date: z.date() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(events).values({
        name: input.name,
        date: input.date,
        createdUserId: ctx.session.user.id,
      });
    }),
});
