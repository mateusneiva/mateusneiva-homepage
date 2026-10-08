import messages from '@/i18n/messages/pt.json'
import type { Locale } from './routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}

// Both dictionaries must expose the same translation keys.
type DictionaryShape<T> = {
  [K in keyof T]: T[K] extends string ? string : DictionaryShape<T[K]>
}

import english from '@/i18n/messages/en.json'

const checkedEnglish: DictionaryShape<typeof messages> = english

export type Messages = typeof checkedEnglish
