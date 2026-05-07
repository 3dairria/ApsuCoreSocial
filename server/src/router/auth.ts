import { z } from 'zod'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { router, publicProcedure } from './trpc.js'
import { users } from '../db/schema.js'
import { signToken } from '../lib/jwt.js'

function nanoid() {
  return Math.random().toString(36).slice(2, 11)
}

const AVATAR_COLORS = ['#7C3AED', '#D4A843', '#1e6e4e', '#9D5FF5', '#c04a8a', '#2563eb', '#16a34a']

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(60),
      handle: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/, 'Alleen kleine letters, cijfers en _'),
      email: z.string().email(),
      password: z.string().min(8, 'Minimaal 8 tekens'),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.handle, input.handle))
        .limit(1)

      if (existing.length > 0) {
        throw new Error('Deze gebruikersnaam is al in gebruik')
      }

      const passwordHash = await bcrypt.hash(input.password, 10)
      const id = `user_${nanoid()}`
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

      await ctx.db.insert(users).values({
        id,
        handle: input.handle,
        name: input.name,
        bio: '',
        avatarColor: color,
        passwordHash,
        createdAt: new Date(),
      })

      const token = await signToken(id)
      return { token, userId: id, name: input.name, handle: input.handle, avatarColor: color }
    }),

  login: publicProcedure
    .input(z.object({
      handle: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.handle, input.handle.toLowerCase()))
        .limit(1)

      if (!user || !user.passwordHash) {
        throw new Error('Gebruikersnaam of wachtwoord onjuist')
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash)
      if (!valid) {
        throw new Error('Gebruikersnaam of wachtwoord onjuist')
      }

      const token = await signToken(user.id)
      return { token, userId: user.id, name: user.name, handle: user.handle, avatarColor: user.avatarColor }
    }),
})
