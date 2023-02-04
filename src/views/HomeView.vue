<template>
  <v-container>

    <v-text-field
      variant="outlined"
      v-model="search_string"
      prepend-inner-icon="mdi-magnify"
      :placeholder="i18n_t('library.search_book')"
      clearable
      hide-details
    >
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              icon="mdi-dots-vertical"
              :loading="reloading"
            >
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              :title="i18n_t('library.open_in_gs')"
              prependIcon="mdi-google-spreadsheet"
              appendIcon="mdi-open-in-new"
              :href="gsheet_doc_url"
              target="_blank"
            >
            </v-list-item>
            <v-list-item
              :title="i18n_t('library.refresh')"
              prependIcon="mdi-sync"
              @click="reloadLibrary"
            >
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-text-field>

    <div class="my-4 text-caption">
      {{ filtered_library.length }} {{ i18n_t('library.results') }}
    </div>

    <books-table
      :library="filtered_library"
      :loading="initializing"
    >
    </books-table>

  </v-container>
</template>
<script>
import { get } from 'idb-keyval'
import { mapActions } from 'pinia'
import { useLibraryStore } from '../stores/library'
import BooksTable from '@/components/BooksTable.vue'
export default {
  components: {
    'books-table': BooksTable,
  },
  data: () => ({
    library: undefined,
    reloading: false,
    initializing: true,
    search_string: '',
    gsheet_doc_url: undefined,
  }),
  async created() {
    this.gsheet_doc_url = await get('u_gsheet_doc_url')
    this.library = await this.getLibrary()
    this.initializing = false
    console.log(this.library)
  },
  methods: {
    ...mapActions(useLibraryStore, [
     'getLibrary',
     'fetchLibrary',
    ]),
    async reloadLibrary() {
      this.reloading = true
      this.library = await this.fetchLibrary()
      this.reloading = false
    },
  },
  computed: {
    filtered_library() {
      if (!this.library) return []
      return this.library.filter(book => {
        if (this.search_string === '') return true
        const s = this.search_string.toLowerCase()
        for (const k of ['title', 'author', 'publisher']) {
          if (book[k]?.toLowerCase().includes(s)) return true
        }
      }).sort((a, b) => {
        return b.date - a.date
      })
    }
  },
}
</script>
