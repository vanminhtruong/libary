<template>
  <Button 
    type="button" 
    @click="handleToggleDarkMode" 
    :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'" 
    class="p-button-rounded p-button-text p-button-secondary"
    :aria-label="isDarkTheme ? 'Toggle light mode' : 'Toggle dark mode'"
  />
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

const { isDarkTheme, handleToggleDarkMode } = useTheme()
</script> 