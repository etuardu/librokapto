<template>
  <v-container>

    <v-text-field
      label="Google sheets document URL"
      v-model="doc_url"
      placeholder="https://docs.google.com/spreadsheets/d/…/edit#gid=0"
      persistent-placeholder
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Google sheets Librokapto app URL"
      v-model="app_url"
      placeholder="https://script.google.com/macros/s/…/exec"
      persistent-placeholder
      variant="outlined"
    ></v-text-field>

    <v-select
      label="Language"
      variant="outlined"
    ></v-select>

    <div class="d-flex flex-column flex-sm-row align-sm-center">
      <v-btn
        @click="save"
      >Save settings</v-btn>
      <v-btn
        text
        variant="text"
        size="small"
        class="ml-lg-6 mt-6 mt-sm-0 text-medium-emphasis"
        @click="copySettingsUrl"
      >
        <v-icon class="me-1">mdi-link</v-icon> Share configuration
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
    alert_type: 'success',
    alert_visible: false,
    alert_text: '',
  }),
  async created() {
    let search = new URL(window.location.href).searchParams
    // check if the user reached the page through a shared configuration
    // In this case the url would contain search parameters.
    if (search.has('a') && search.has('d')) {
      this.doc_url = search.get('d')
      this.app_url = search.get('a')
      this.alert_text = 'Configuration loaded from shared link. Please save the settings if you want to keep it.'
      this.alert_visible = true
      this.alert_type = 'info'
      return
    }
    // otherwise load the values from indexeddb
    [this.doc_url, this.app_url] = await getMany(['u_gsheet_doc_url', 'u_gsheet_app_url'])
  },
  methods: {
    async save() {
      this.alert_visible = false
      try {
        await setMany([
          ['u_gsheet_doc_url', this.doc_url],
          ['u_gsheet_app_url', this.app_url]
        ])
        this.alert_type = 'success'
        this.alert_text = 'Your settings has been updated!'
        this.alert_visible = true
      } catch(e) {
        this.alert_type = 'error'
        this.alert_text = 'Unable to save settings'
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
        this.alert_text = 'Configuration link copied to clipboard!'
        this.alert_visible = true
      } catch(e) {
        this.alert_type = 'error'
        this.alert_text = 'Cannot copy to clipboard'
        this.alert_visible = true
      }
    }
  },
}
</script>
