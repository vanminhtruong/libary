<template>
  <form @submit.prevent="login" class="space-y-6">
    <div class="space-y-2">
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        <i class="pi pi-envelope mr-2"></i>
        {{ $t('auth.email') }}
      </label>
      <InputText 
        id="email" 
        v-model="email" 
        type="email"
        :class="{'p-invalid': errors.email}"
        :placeholder="$t('auth.emailPlaceholder')"
        class="w-full !p-3 !rounded-lg !border !border-gray-300 dark:!bg-surface-800 dark:!border-surface-700 dark:!text-white focus:!border-primary focus:!ring-2 focus:!ring-primary-200 !transition-colors"
      />
      <small class="text-red-500 text-xs" v-if="errors.email">{{ errors.email[0] }}</small>
    </div>

    <div class="space-y-2">
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        <i class="pi pi-lock mr-2"></i>
        {{ $t('auth.password') }}
      </label>
      <Password
        id="password"
        v-model="password"
        :feedback="false"
        :toggleMask="true"
        :class="{'p-invalid': errors.password}"
        :placeholder="$t('auth.passwordPlaceholder')"
        style="width: 100%; display: block;"
        class="dark:bg-surface-800"
        :inputClass="isDarkTheme ? 'dark:bg-surface-800 dark:text-white dark:border-surface-700' : ''"
        :inputStyle="{ 
          width: '100%', 
          padding: '0.75rem', 
          borderRadius: '0.5rem',
          backgroundColor: isDarkTheme ? 'var(--surface-800)' : 'white',
          color: isDarkTheme ? 'var(--surface-50)' : 'inherit',
          borderColor: isDarkTheme ? 'var(--surface-700)' : 'var(--gray-300)'
        }"
        :panelStyle="{ display: 'none' }"
      />
      <small class="text-red-500 text-xs" v-if="errors.password">{{ errors.password[0] }}</small>
    </div>

    <div class="flex items-center">
      <Checkbox 
        v-model="rememberMe" 
        :binary="true" 
        inputId="remember"
        class="mr-2"
      />
      <label for="remember" class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
        {{ $t('auth.rememberMe') }}
      </label>
    </div>

    <Button 
      type="submit" 
      :label="$t('auth.signIn')"
      :loading="loading"
      class="w-full p-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
    />
  </form>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuth, useTheme } from '../composables'

const { t } = useI18n()
const { isDarkTheme } = useTheme()
const { email, password, rememberMe, loading, errors, login } = useAuth()
</script> 