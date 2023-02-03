import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import i18n from '@/mixins/i18n.js'
import it from '@/i18n/it.js'
import en from '@/i18n/en.js'

const app = createApp(App)

app.mixin(i18n)

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { it, en },
  }
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
