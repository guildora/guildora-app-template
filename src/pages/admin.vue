<template>
  <section class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold md:text-3xl">{{ t('admin.title') }}</h1>
      <p class="text-sm opacity-80">{{ t('admin.subtitle') }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="pendingConfig || pendingSettings" class="opacity-60">{{ t('loading') }}</div>

    <!-- Error state -->
    <div v-else-if="configError || settingsError" class="alert alert-error">{{ t('error.settings') }}</div>

    <div v-else class="space-y-6">
      <!-- Current configuration -->
      <div class="card">
        <div class="p-6">
          <h2 class="mb-4 text-base font-semibold text-[var(--color-text-primary)]">{{ t('admin.config.heading') }}</h2>
          <div class="flex flex-col gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('admin.config.welcomeEnabled') }}</p>
              <p class="mt-1">{{ config?.welcomeEnabled ? t('admin.config.enabled') : t('admin.config.disabled') }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('admin.config.welcomeMessage') }}</p>
              <p class="mt-1 font-mono">{{ config?.welcomeMessage || t('admin.config.notSet') }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('admin.config.announcementChannelId') }}</p>
              <p class="mt-1 font-mono">{{ config?.announcementChannelId || t('admin.config.notSet') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- App statistics -->
      <div class="card">
        <div class="p-6">
          <h2 class="mb-4 text-base font-semibold text-[var(--color-text-primary)]">{{ t('admin.settings.heading') }}</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="stat">
              <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('admin.settings.version') }}</div>
              <div class="text-2xl font-bold text-[var(--color-accent)]">{{ settings?.version ?? '—' }}</div>
            </div>
            <div class="stat">
              <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{{ t('admin.settings.totalMembers') }}</div>
              <div class="text-2xl font-bold text-[var(--color-accent)]">{{ settings?.totalMembers ?? 0 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n, useFetch } from '@guildora/hub'

const { t } = useI18n()

const { data: config, pending: pendingConfig, error: configError } = await useFetch('/api/apps/guildora-app-template/config')
const { data: settings, pending: pendingSettings, error: settingsError } = await useFetch('/api/apps/guildora-app-template/settings')
</script>
