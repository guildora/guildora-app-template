<template>
  <div class="p-6 font-sans">
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold" style="color: var(--color-text, #111)">
        My App
      </h1>
      <p class="mt-1 text-sm" style="color: var(--color-text-muted, #666)">
        A short description of what your app does.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="pending" style="color: var(--color-text-muted, #666)">Loading…</div>

    <!-- Error state -->
    <div
      v-else-if="error"
      style="border: 1px solid #f87171; background: #fef2f2; padding: 1rem; border-radius: 0.5rem; color: #b91c1c;"
    >
      Failed to load stats. Please refresh the page.
    </div>

    <!-- Content -->
    <div v-else class="space-y-4">
      <!-- Your points card -->
      <div
        style="border: 1px solid var(--color-border, #e5e7eb); background: var(--color-surface, #fff); padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
      >
        <p class="text-sm font-semibold" style="color: var(--color-text-muted, #666); text-transform: uppercase; letter-spacing: 0.05em;">
          Your Points
        </p>
        <p class="mt-1 text-4xl font-bold" style="color: var(--color-accent, #ff206e)">
          {{ stats?.myPoints ?? 0 }}
        </p>
        <p class="mt-1 text-xs" style="color: var(--color-text-muted, #666)">
          Rank: #{{ stats?.myRank ?? '—' }}
        </p>
      </div>

      <!-- Leaderboard preview -->
      <div
        v-if="stats?.topMembers?.length"
        style="border: 1px solid var(--color-border, #e5e7eb); background: var(--color-surface, #fff); padding: 1rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
      >
        <h2 class="mb-3 font-bold" style="color: var(--color-text, #111)">Top Members</h2>
        <ol>
          <li
            v-for="(entry, index) in stats.topMembers"
            :key="entry.memberId"
            style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; padding: 0.25rem 0;"
          >
            <span style="width: 1.25rem; text-align: right; font-weight: bold; color: var(--color-text-muted, #666)">
              {{ index + 1 }}.
            </span>
            <span style="flex: 1; color: var(--color-text, #111)">{{ entry.displayName }}</span>
            <span style="font-weight: 600; color: var(--color-accent, #ff206e)">{{ entry.points }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref(null)
const pending = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/apps/my-app/stats')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    stats.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }
})
</script>
