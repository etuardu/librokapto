<template>
  <v-container>
    <v-snackbar
      location="top"
      color="error"
      v-model="snackbar_visible"
      multi-line
      style="white-space: pre-line;"
    >
      {{ snackbar_text }}
      <template v-slot:actions>
        <v-btn
          variant="icon"
          @click="snackbar_visible = false"
          icon="mdi-close"
        >
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="quagga_visible"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="quagga_visible=false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <quagga-scanner @onscan="onscan" ref="quagga" v-if="quagga_visible"></quagga-scanner>
      </v-card>
    </v-dialog>


    <v-form @submit.prevent="save_book">
      <v-row class="mb-2">
        <v-col cols="7">
          <v-combobox
            :label="i18n_t('book.bookcase')"
            variant="outlined"
            density="comfortable"
            v-model="bookcase"
            :items="bookcase_items"
            clearable
            :rules="[ v => !!v || i18n_t('insert.bookcase_mandatory') ]"
            hide-details
            hide-no-data
          >
            <template v-slot:selection="data">
              <v-chip
                :key="data.item.title"
                v-bind="data.attrs"
                :model-value="data.selected"
                :disabled="data.disabled"
                size="small"
                @click:close="data.parent.selectItem(data.item)"
                :color="string2color(data.item.title)"
              >{{data.item.title}}</v-chip>
            </template>
            <template v-slot:item="{ index, item, props }">
              <v-list-item v-bind="props" title="">
                <v-chip
                  v-bind="props"
                  size="small"
                  :color="string2color(item.title)"
                >{{item.title}}</v-chip>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="5">
          <v-text-field
            :label="i18n_t('book.shelf')"
            variant="outlined"
            density="comfortable"
            v-model="shelf"
            type="number"
            bg-color="white"
            :rules="[ v => !!`${v}` || i18n('insert.shelf_mandatory') , v => !!`${v}`.match(/^[0-9]+$/) || i18n('insert.shelf_numeric_only') ]"
            hide-details
          >
            <template v-slot:append>
              <v-icon
                size="x-small"
                icon="mdi-plus"
                @click="shelf=shelf*1+1"
              />
            </template>
            <template v-slot:prepend>
              <v-icon
                size="x-small"
                icon="mdi-minus"
                @click="shelf=shelf > 0 ? shelf*1-1 : shelf"
              />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-scale-transition mode="out-in" origin="center center">
        <v-btn
          position="fixed"
          location="bottom right"
          class="mb-4 mr-4"
          style="z-index: 99;"
          min-width="150"

          v-if="is_bookinfo_filled"
          :loading="loading_book_saving"
          color="blue-darken-3"
          :elevation="12"
          size="x-large"
          rounded="pill"
          stacked
          prepend-icon="mdi-content-save"
          type="submit"
        >
          {{ i18n_t('insert.save') }}
        </v-btn>
        <v-btn
          position="fixed"
          location="bottom right"
          class="mb-4 mr-4"
          style="z-index: 99;"
          min-width="150"

          v-else
          color="amber"
          :elevation="12"
          size="x-large"
          rounded="pill"
          stacked
          prepend-icon="mdi-barcode-scan"
          @click="quagga_visible=true"
        >
          {{ i18n_t('insert.scan_isbn') }}
        </v-btn>
      </v-scale-transition>
    </v-form>

    <v-sheet
      elevation="1"
      rounded
      border
    >
      <v-progress-linear
        :color="is_bookinfo_filled ? 'blue-lighten-3' : 'amber-lighten-4'"
        :model-value="100"
        :indeterminate="loading_book_info || loading_book_saving"
      ></v-progress-linear>
      <v-text-field
        label="ISBN"
        prepend-inner-icon="mdi-barcode"
        v-model="bookinfo.isbn"
        density="comfortable"
        hide-details
        variant="outlined"
        class="ma-3"
      >
        <template v-slot:append-inner>
          <v-btn
            icon
            flat
            density="compact"
            :loading="loading_book_info"
            @click="fetch_book_info"
          >
            <v-icon
              size="small"
              icon="mdi-sync"
            />
          </v-btn>
        </template>
      </v-text-field>

      <v-text-field
        :label="i18n_t('book.title')"
        prepend-inner-icon="mdi-format-title"
        v-model="bookinfo.title"
        density="comfortable"
        clearable
        hide-details
        variant="outlined"
        class="ma-3"
      >
      </v-text-field>

      <v-text-field
        :label="i18n_t('book.author')"
        prepend-inner-icon="mdi-account-tie"
        v-model="bookinfo.author"
        density="comfortable"
        clearable
        hide-details
        variant="outlined"
        class="ma-3"
      >
      </v-text-field>

      <v-text-field
        :label="i18n_t('book.publisher')"
        prepend-inner-icon="mdi-factory"
        v-model="bookinfo.publisher"
        density="comfortable"
        clearable
        variant="outlined"
        hide-details
        class="ma-3"
      >
      </v-text-field>

      <div class="ma-3 d-flex justify-center">

        <div
          class="text-caption text-error"
          v-show="show_isbn_not_found"
        >
          <v-icon>mdi-alert-circle-outline</v-icon> {{ i18n_t('insert.isbn_not_found') }}
        </div>

        <v-spacer></v-spacer>

        <v-btn
          text
          flat
          size="small"
          class="text-medium-emphasis"
          @click="clear_bookinfo"
          right
        >
          <v-icon class="me-2">mdi-close</v-icon> {{ i18n_t('insert.clear_fields') }}
        </v-btn>

      </div>

    </v-sheet>

    <v-img
      v-show="is_bookinfo_filled"
      class="mt-5"
      width="150"
      :src="bookinfo.image || '/no_cover.png'"
      contain
    >
    </v-img>
    
  </v-container>
</template>
<script>
import { get, getMany, setMany } from 'idb-keyval'
import QuaggaScanner from '../components/QuaggaScanner.vue'
import String2color from '@/mixins/string2color.js'
import { mapActions } from 'pinia'
import { useLibraryStore } from '../stores/library'
export default {
  mixins: [
    String2color,
  ],
  components: {
    'quagga-scanner': QuaggaScanner
  },
  async created() {
    this.gsheet_app_url = await get('u_gsheet_app_url')
    this.bookcase = await get('u_last_bookcase') || ''
    this.shelf = await get('u_last_shelf') || 1
    this.library = await this.getLibrary()
  },
  data: () => ({
    show_isbn_not_found: false,
    snackbar_visible: false,
    snackbar_text: '',
    library: undefined,
    gsheet_app_url: '',
    quagga_visible: false,
    bookinfo: {
      image: '',
      isbn: '',
      title: '',
      author: '',
      publisher: '',
    },
    bookcase: '',
    shelf: 1,
    loading_book_info: false,
    loading_book_saving: false,
  }),
  computed: {
    is_bookinfo_filled() {
      // true if at least the title is filled
      return this.bookinfo.title
    },
    bookcase_items() {
      if (!this.library) return []
      return [...new Set(
        this.library.map(
          book => book.bookcase
        )
      )].filter(txt => txt) // skip empty
    }
  },
  methods: {
    ...mapActions(useLibraryStore, [
      'appendToLibrary',
      'getLibrary'
    ]),
    onscan(code) {
      this.bookinfo.isbn = code
      this.quagga_visible = false
      this.fetch_book_info()
    },
    toggle_quagga() {
      this.quagga_visible = !this.quagga_visible
    },
    async save_book(e) {
      const ret = await e
      if (!ret.valid) {
        this.snackbar_text = ret.errors.map(
          e => Object.values(e.errorMessages)
        ).join("\n")
        this.snackbar_visible = true
        return
      }

      this.show_isbn_not_found = false
      this.loading_book_saving = true

      const bookinfo = {
        title: this.bookinfo.title,
        author: this.bookinfo.author || '',
        publisher: this.bookinfo.publisher || '',
        image: this.bookinfo.image || '',
        isbn: this.bookinfo.isbn || '',
        bookcase: this.bookcase,
        shelf: this.shelf,
      }

      const resp = await this.post_to_gsheet({
        op: 'addBook',
        bookinfo
      })
      this.appendToLibrary({ date: new Date(), ...bookinfo })

      this.library = await this.getLibrary()
      // we update the library so that bookcase_items
      // which populates the items of the combobox for
      // bookcase selection will be updated

      await setMany([
        ['u_last_bookcase', this.bookcase],
        ['u_last_shelf', this.shelf]
      ])

      this.clear_bookinfo()

      this.loading_book_saving = false
      // TODO: error handling
    },
    async post_to_gsheet(data) {
      console.log('posting:', data)
      const response = await fetch(this.gsheet_app_url, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        redirect: 'follow',
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    async fetch_book_info() {

      if (!this.bookinfo.isbn) return

      this.show_isbn_not_found = false
      this.loading_book_info = true

      let response, data

      try {
        response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${this.bookinfo.isbn}`);
        data = await response.json();
      } catch(e) {
        // server unreachable
        this.snackbar_text = this.i18n_t('insert.gbooks_unreachable')
        this.snackbar_visible = true
        return
      } finally {
        this.loading_book_info = false
      }

      if (!data.items || data.items.length == 0) {
        console.log("No book was found")
        this.show_isbn_not_found = true
        return
      }

      const info = data.items[0].volumeInfo;

      this.bookinfo.title = info.title
      this.bookinfo.author = info.authors.join(", ")
      this.bookinfo.publisher = info.publisher
      this.bookinfo.image = info.imageLinks?.thumbnail || ''

    },
    clear_bookinfo() {
      this.show_isbn_not_found = false
      this.bookinfo.image = ''
      this.bookinfo.title = ''
      this.bookinfo.author = ''
      this.bookinfo.publisher = ''
      this.bookinfo.isbn = ''
    }
  }
}
</script>
