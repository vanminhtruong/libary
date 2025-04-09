<template>
  <Dropdown
    v-model="selectedLanguage"
    :options="languages"
    optionLabel="name"
    @change="changeLanguage"
    class="w-40 rounded-lg dark:bg-surface-800 dark:border-surface-700"
  />
</template>

<script setup>
import { useLanguage } from '../composables'

const { languages, selectedLanguage, changeLanguage } = useLanguage()
</script>

<style scoped>
:deep(.p-dropdown-panel) {
  background: var(--surface-0);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

:deep(.app-dark) :deep(.p-dropdown) {
  background: var(--surface-800);
  border-color: var(--surface-700);
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown .p-dropdown-label),
:deep(.app-dark) :deep(.p-dropdown .p-dropdown-trigger) {
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown-panel) {
  background: var(--surface-800);
  border-color: var(--surface-700);
}

:deep(.app-dark) :deep(.p-dropdown-item) {
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown-item:hover) {
  background: var(--surface-700);
}
</style> 