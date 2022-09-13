import { createProtectedRouter } from "./context";
import { generateSlug } from "random-word-slugs"

export const roomRouter = createProtectedRouter()
  .mutation("create", {
    async resolve({ ctx }) {
      return ctx.prisma.room.create({
        data: {

          userId: ctx.session.user.id,
          name: generateSlug(3),
          memberships: {
            create: [
              { userId: ctx.session.user.id }
            ]
          }
        }
      })
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.room.findMany({
        include: {
          memberships: {
            include: { user: true }
          }
        },
        where: {
          memberships: { some: { userId: ctx.session.user.id } }
        }

      })
    },
  });
