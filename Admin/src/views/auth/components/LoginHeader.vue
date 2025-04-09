<template>
  <div class="text-center mb-10">
    <i class="pi pi-user text-5xl text-primary mb-4"></i>
    <h1 class="text-3xl font-semibold text-primary mb-2">{{ $t('auth.welcome') }}</h1>
    <p class="text-gray-600 dark:text-gray-300">{{ $t('auth.signInToContinue') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script> 