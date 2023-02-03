import { get, set } from 'idb-keyval'
export default {
  data: () => ({
    i18n_langs: {
      'en': 'English',
      'it': 'Italian',
    }
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
      if (Object.keys(this.i18n_langs).includes(code)) {
        return code
      }

      // fallback
      await this.i18n_set_lang('en')
      return 'en'
    },
  }
}
