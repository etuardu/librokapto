<template>
  <v-container>

    <v-text-field
      :label="i18n_t('settings.gsheets_doc_url')"
      v-model="doc_url"
      placeholder="https://docs.google.com/spreadsheets/d/…/edit#gid=0"
      persistent-placeholder
      variant="outlined"
    ></v-text-field>

    <v-text-field
      :label="i18n_t('settings.gsheets_app_url')"
      v-model="app_url"
      placeholder="https://script.google.com/macros/s/…/exec"
      persistent-placeholder
      variant="outlined"
    ></v-text-field>

    <v-select
      :label="i18n_t('settings.language')"
      variant="outlined"
      :items="lang_items"
      item-value="code"
      item-title="name"
      v-model="lang"
    ></v-select>

    <div class="d-flex flex-column flex-sm-row align-sm-center">
      <v-btn
        @click="save"
      >{{ i18n_t('settings.save_settings') }}</v-btn>
      <v-btn
        text
        variant="text"
        size="small"
        class="ml-lg-6 mt-6 mt-sm-0 text-medium-emphasis"
        @click="copySettingsUrl"
      >
        <v-icon class="me-1">mdi-link</v-icon> {{ i18n_t('settings.share_config') }}
      </v-btn>
    </div>

    <v-alert
      class="mt-5"
      :type="alert_type"
      v-if="alert_visible"
      variant="tonal"
      closable
    >{{ alert_text }}</v-alert>

  </v-container>
</template>
<script>
import { setMany, getMany } from 'idb-keyval'
export default {
  data: () => ({
    doc_url: undefined,
    app_url: undefined,
    lang: undefined,
    alert_type: 'success',
    alert_visible: false,
    alert_text: '',
  }),
  async created() {
    this.lang = await this.i18n_get_lang()

    let search = new URL(window.location.href).searchParams
    // check if the user reached the page through a shared configuration
    // In this case the url would contain search parameters.
    if (search.has('a') && search.has('d')) {
      this.doc_url = search.get('d')
      this.app_url = search.get('a')
      this.alert_text = this.i18n_t('settings.config_loaded')
      this.alert_visible = true
      this.alert_type = 'info'
      return
    }
    // otherwise load the values from indexeddb
    [this.doc_url, this.app_url] = await getMany(['u_gsheet_doc_url', 'u_gsheet_app_url'])
  },
  computed: {
    lang_items() {
      return Object.entries(this.i18n_langs).map(l => ({
        // l = [ 'en', 'English' ]
        code: l[0],
        name: this.i18n_t(`langs.${l[0]}`)
      }))
    }
  },
  methods: {
    async save() {
      this.alert_visible = false
      try {
        await this.i18n_set_lang(this.lang)
        await setMany([
          ['u_gsheet_doc_url', this.doc_url],
          ['u_gsheet_app_url', this.app_url]
        ])
        this.alert_type = 'success'
        this.alert_text = this.i18n_t('settings.save_success')
        this.alert_visible = true
      } catch(e) {
        this.alert_type = 'error'
        this.alert_text = this.i18n_t('settings.save_failure')
        this.alert_visible = true
      }
    },
    async copySettingsUrl() {
      this.alert_visible = false
      let url = new URL(window.location.href)
      url.searchParams.append('d', this.doc_url)
      url.searchParams.append('a', this.app_url)
      try {
        await navigator.clipboard.writeText(url);
        this.alert_type = 'success'
        this.alert_text = this.i18n_t('settings.copy_success')
        this.alert_visible = true
      } catch(e) {
        this.alert_type = 'error'
        this.alert_text = this.i18n_t('settings.copy_failure')
        this.alert_visible = true
      }
    }
  },
}
</script>
