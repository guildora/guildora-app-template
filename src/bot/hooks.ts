// Bot hook handlers for My App.
// All hooks declared in manifest.botHooks must be exported here.
// The NewGuildPlus host calls these functions when the corresponding events fire.

import type {
  BotContext,
  VoiceActivityPayload,
  RoleChangePayload,
  MemberJoinPayload,
  InteractionPayload
} from '@newguildplus/app-sdk'

/**
 * onVoiceActivity — fires when a member joins, leaves, or moves in voice.
 *
 * We award points when a member leaves a voice channel, based on how long
 * they were in there and the guild's configured rate.
 */
export async function onVoiceActivity(payload: VoiceActivityPayload, ctx: BotContext) {
  // Only award points when the member leaves (or moves away), and we know the duration
  if ((payload.action === 'leave' || payload.action === 'move') && payload.durationSeconds) {
    const pointsPerMinute = (ctx.config.pointsPerMinute as number) ?? 1
    const earned = Math.floor(payload.durationSeconds / 60) * pointsPerMinute

    // Only write to DB if they actually earned something
    if (earned > 0) {
      const current = ((await ctx.db.get(`points:${payload.memberId}`)) as number) ?? 0
      await ctx.db.set(`points:${payload.memberId}`, current + earned)
    }
  }
}

/**
 * onRoleChange — fires when a member's roles are updated.
 *
 * We use this to log tier role gains or removals.
 */
export async function onRoleChange(payload: RoleChangePayload, ctx: BotContext) {
  const tierRoles = ['bronze', 'silver', 'gold']
  const topTier = (ctx.config.topTier as string) ?? 'gold'

  const gainedTopTier = payload.addedRoles.includes(topTier)
  if (gainedTopTier) {
    // Log the tier achievement to the KV store
    await ctx.db.set(`tier:${payload.memberId}`, {
      tier: topTier,
      achievedAt: new Date().toISOString()
    })
  }

  // If a tier role was removed, clear the tier record
  const lostTierRole = payload.removedRoles.some((r) => tierRoles.includes(r))
  if (lostTierRole) {
    await ctx.db.delete(`tier:${payload.memberId}`)
  }
}

/**
 * onMemberJoin — fires when a new member joins the Discord server.
 *
 * We send a welcome message and set starting points.
 */
export async function onMemberJoin(payload: MemberJoinPayload, ctx: BotContext) {
  const welcomeChannelId = ctx.config.welcomeChannelId as string | undefined
  if (welcomeChannelId) {
    await ctx.bot.sendMessage(
      welcomeChannelId,
      `Welcome to the server, <@${payload.memberId}>!`
    )
  }

  // Initialize their points entry so they appear in the leaderboard
  const existing = await ctx.db.get(`points:${payload.memberId}`)
  if (existing === null) {
    await ctx.db.set(`points:${payload.memberId}`, 0)
  }
}

/**
 * onInteraction — fires when a slash command is used.
 *
 * We handle the /points command to show a member's current balance.
 */
export async function onInteraction(payload: InteractionPayload, ctx: BotContext) {
  if (payload.commandName !== 'points') return

  const points = ((await ctx.db.get(`points:${payload.memberId}`)) as number) ?? 0

  // Write an audit log entry
  await ctx.db.set(`audit:${payload.memberId}:${Date.now()}`, {
    command: 'points',
    result: points,
    at: payload.occurredAt
  })
}
