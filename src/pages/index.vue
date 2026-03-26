<template>
  <section class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold md:text-3xl">{{ t('app.title') }}</h1>
      <p class="text-sm opacity-80">{{ t('app.subtitle') }}</p>
    </div>

    <!-- Welcome banner -->
    <div v-if="user" class="card">
      <div class="p-6">
        <p>{{ t('app.welcome', { username: user.displayName }) }}</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="opacity-60">{{ t('loading') }}</div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-error">{{ t('error.load') }}</div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Community overview card -->
      <div class="card">
        <div class="p-6">
          <h2 class="mb-4 text-base font-semibold text-[var(--color-text-primary)]">{{ t('app.overview.heading') }}</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="stat">
              <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('app.overview.membersTracked') }}</div>
              <div class="text-2xl font-bold text-[var(--color-accent)]">{{ overview?.membersTracked ?? 0 }}</div>
            </div>
            <div class="stat">
              <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('app.overview.appActive') }}</div>
              <div class="text-2xl font-bold" style="color: var(--color-success);">{{ t('app.overview.active') }}</div>
            </div>
          </div>
          <p v-if="!overview?.membersTracked" class="mt-4 text-sm opacity-60">
            {{ t('app.overview.noData') }}
          </p>
        </div>
      </div>

      <!-- Moderator shortcut -->
      <div v-if="hasRole('moderator')">
        <NuxtLink to="/apps/guildora-app-template/mod" class="inline-flex text-sm text-[var(--color-accent)] hover:underline">
          {{ t('nav.mod') }} →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n, useAuth, useFetch } from '@guildora/hub'

const { t } = useI18n()
const { user, hasRole } = useAuth()

const { data: overview, pending, error } = await useFetch('/api/apps/guildora-app-template/overview')
</script>
