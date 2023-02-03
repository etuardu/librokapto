import { get, set } from 'idb-keyval'
export default {
  data: () => ({
    i18n_langs: [
      'en',
      'it'
    ]
  }),
  methods: {
    i18n_t() {
      let args = [...arguments]
      args[0] = "$vuetify." + args[0]
      return this.$vuetify.locale.t(...args)
    },
    async i18n_set_lang(code) {
      await set('u_current_lang', code)
      this.$vuetify.locale.current = code
    },
    async i18n_get_lang() {

      let code = await get('u_current_lang') 

      if (this.i18n_langs.includes(code)) {
        // a legit code was stored in indexeddb
        return code
      }

      code = navigator.language.split('-')[0]
      // get the browser language, skipping
      // the possible country code (es. 'it-IT')

      if (!this.i18n_langs.includes(code)) {
        // the browser language is unsupported
        code = 'en'
      }

      await this.i18n_set_lang(code)
      return code

    },
  }
}
