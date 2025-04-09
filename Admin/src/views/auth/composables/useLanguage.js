import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale } = useI18n()

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Tiếng Việt', code: 'vi' },
    { name: '한국어', code: 'ko' }
  ]

  // Initialize language from localStorage or default
  const savedLanguage = localStorage.getItem('language')
  const defaultLanguage = languages.find(lang => lang.code === savedLanguage) || languages[0]
  const selectedLanguage = ref(defaultLanguage)

  // Update locale when component is created
  locale.value = selectedLanguage.value.code

  const changeLanguage = (event) => {
    const newLang = event.value.code
    localStorage.setItem('language', newLang)
    locale.value = newLang // Update locale immediately
  }

  // Watch locale changes
  watch(locale, (newLocale) => {
    console.log('Language changed to:', newLocale)
  })

  return {
    languages,
    selectedLanguage,
    changeLanguage
  }
} 