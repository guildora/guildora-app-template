<template>
  <div class="p-6 font-sans">
    <div class="mb-6">
      <h1 class="text-3xl font-bold" style="color: var(--color-text, #111)">Manage Points</h1>
      <p class="mt-1 text-sm" style="color: var(--color-text-muted, #666)">
        Award points to members or reset their balance.
      </p>
    </div>

    <!-- Award points form -->
    <div
      style="border: 1px solid var(--color-border, #e5e7eb); background: var(--color-surface, #fff); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"
    >
      <h2 class="mb-3 font-bold" style="color: var(--color-text, #111)">Award Points</h2>
      <form style="display: flex; gap: 0.5rem; flex-wrap: wrap;" @submit.prevent="awardPoints">
        <input
          v-model="awardTarget"
          type="text"
          placeholder="Member ID"
          style="flex: 1; min-width: 140px; border: 1px solid var(--color-border, #d1d5db); border-radius: 0.25rem; padding: 0.5rem 0.75rem; font-size: 0.875rem;"
        />
        <input
          v-model.number="awardAmount"
          type="number"
          min="1"
          placeholder="Amount"
          style="width: 80px; border: 1px solid var(--color-border, #d1d5db); border-radius: 0.25rem; padding: 0.5rem 0.75rem; font-size: 0.875rem;"
        />
        <button
          type="submit"
          :disabled="awarding"
          style="background: var(--color-accent, #ff206e); color: #fff; border: none; border-radius: 0.25rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; opacity: 1;"
        >
          {{ awarding ? 'Awarding…' : 'Award' }}
        </button>
      </form>
      <p v-if="awardMessage" style="margin-top: 0.5rem; font-size: 0.875rem; color: #16a34a;">{{ awardMessage }}</p>
      <p v-if="awardError" style="margin-top: 0.5rem; font-size: 0.875rem; color: #dc2626;">{{ awardError }}</p>
    </div>

    <!-- Reset points form -->
    <div
      style="border: 1px solid var(--color-border, #e5e7eb); background: var(--color-surface, #fff); padding: 1rem; border-radius: 0.5rem;"
    >
      <h2 class="mb-3 font-bold" style="color: var(--color-text, #111)">Reset Points</h2>
      <form style="display: flex; gap: 0.5rem;" @submit.prevent="resetPoints">
        <input
          v-model="resetTarget"
          type="text"
          placeholder="Member ID"
          style="flex: 1; border: 1px solid var(--color-border, #d1d5db); border-radius: 0.25rem; padding: 0.5rem 0.75rem; font-size: 0.875rem;"
        />
        <button
          type="submit"
          :disabled="resetting"
          style="background: #dc2626; color: #fff; border: none; border-radius: 0.25rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;"
        >
          {{ resetting ? 'Resetting…' : 'Reset to 0' }}
        </button>
      </form>
      <p v-if="resetMessage" style="margin-top: 0.5rem; font-size: 0.875rem; color: #16a34a;">{{ resetMessage }}</p>
      <p v-if="resetError" style="margin-top: 0.5rem; font-size: 0.875rem; color: #dc2626;">{{ resetError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Award form state
const awardTarget = ref('')
const awardAmount = ref(10)
const awarding = ref(false)
const awardMessage = ref('')
const awardError = ref('')

async function awardPoints() {
  if (!awardTarget.value || !awardAmount.value) return
  awarding.value = true
  awardMessage.value = ''
  awardError.value = ''
  try {
    const res = await fetch('/api/apps/my-app/award', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: awardTarget.value, amount: awardAmount.value })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `HTTP ${res.status}`)
    }
    const data = await res.json()
    awardMessage.value = `Awarded ${awardAmount.value} points to ${awardTarget.value}. New total: ${data.newTotal}`
    awardTarget.value = ''
    awardAmount.value = 10
  } catch (e) {
    awardError.value = `Failed to award points: ${e.message}`
  } finally {
    awarding.value = false
  }
}

// Reset form state
const resetTarget = ref('')
const resetting = ref(false)
const resetMessage = ref('')
const resetError = ref('')

async function resetPoints() {
  if (!resetTarget.value) return
  resetting.value = true
  resetMessage.value = ''
  resetError.value = ''
  try {
    const res = await fetch('/api/apps/my-app/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: resetTarget.value })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `HTTP ${res.status}`)
    }
    resetMessage.value = `Points for ${resetTarget.value} have been reset to 0.`
    resetTarget.value = ''
  } catch (e) {
    resetError.value = `Failed to reset points: ${e.message}`
  } finally {
    resetting.value = false
  }
}
</script>
