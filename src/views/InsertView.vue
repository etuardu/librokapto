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

    <v-text-field
      label="ISBN"
      prepend-inner-icon="mdi-barcode"
      :loading="loading_book_info"
      v-model="bookinfo.isbn"
      density="comfortable"
    >
      <template v-slot:append-inner>
        <v-icon
          icon="mdi-sync"
          @click="fetch_book_info"
        />
      </template>
    </v-text-field>

    <v-text-field
      label="Title"
      prepend-inner-icon="mdi-format-title"
      v-model="bookinfo.title"
      density="comfortable"
      clearable
    >
    </v-text-field>

    <v-text-field
      label="Author"
      prepend-inner-icon="mdi-account-tie"
      v-model="bookinfo.author"
      density="comfortable"
      clearable
    >
    </v-text-field>

    <v-text-field
      label="Publisher"
      prepend-inner-icon="mdi-factory"
      v-model="bookinfo.publisher"
      density="comfortable"
      clearable
    >
    </v-text-field>

    <div class="d-flex justify-space-between mb-6 mt-2">
      <div>
        <v-img
          v-if="is_bookinfo_filled"
          height="110"
          width="80"
          :src="bookinfo.image || '/no_cover.png'"
          contain
        >
        </v-img>
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
        <v-icon class="me-2">mdi-close</v-icon> Clear all fields
      </v-btn>
    </div>

    
  </v-container>
  <v-footer app bottom fixed class="pa-1" color="grey-lighten-3">
    <v-container fluid class="pa-1">
      <v-form
        @submit.prevent="save_book"
      >
        <v-row align="center" justify="center">
          <v-col d-flex class="flex-shrink-0 flex-grow-1">
            <v-text-field
              density="compact"
              label="Shelf"
              v-model="shelf"
              type="number"
              bg-color="white"
              hide-details
              class="mb-2"
              :rules="[ v => !!`${v}` || 'Please specify a shelf number.', v => !!`${v}`.match(/^[0-9]+$/) || 'The shelf field must contain digits only (0-9).' ]"
            >
              <template v-slot:append>
                <v-icon
                  icon="mdi-plus"
                  @click="shelf=shelf*1+1"
                />
              </template>
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-minus"
                  @click="shelf=shelf > 0 ? shelf*1-1 : shelf"
                />
              </template>
            </v-text-field>
            <v-combobox
              density="compact"
              label="Bookcase"
              v-model="bookcase"
              :items="bookcase_items"
              bg-color="white"
              hide-details
              clearable
              :rules="[ v => !!v || 'Please specify a bookcase.' ]"
            ></v-combobox>
          </v-col>
          <v-col d-flex class="flex-shrink-1 flex-grow-0">
            <v-scale-transition mode="out-in" origin="center center">
              <v-btn
                v-if="is_bookinfo_filled"
                :loading="loading_book_saving"
                color="blue-darken-3"
                style="width: 130px"
                size="x-large"
                rounded="pill"
                stacked
                prepend-icon="mdi-content-save"
                type="submit"
              >
                Save
              </v-btn>
              <v-btn
                v-else
                color="amber-lighten-2"
                style="width: 130px"
                size="x-large"
                rounded="pill"
                stacked
                prepend-icon="mdi-barcode-scan"
                @click="quagga_visible=true"
              >
                Scan ISBN
              </v-btn>
            </v-scale-transition>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-footer>
</template>
<script>
import { get, getMany, setMany } from 'idb-keyval'
import TheWelcome from '../components/TheWelcome.vue'
import QuaggaScanner from '../components/QuaggaScanner.vue'
import { mapActions } from 'pinia'
import { useLibraryStore } from '../stores/library'
export default {
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
      )]
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
      this.loading_book_saving = true

      const bookinfo = {
        title: this.bookinfo.title,
        author: this.bookinfo.author,
        publisher: this.bookinfo.publisher,
        image: this.bookinfo.image,
        isbn: this.bookinfo.isbn,
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

      this.loading_book_info = true

      let response, data

      try {
        response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${this.bookinfo.isbn}`);
        data = await response.json();
      } catch(e) {
        console.log("Server unreachable") // TODO: snackbar
        return
      } finally {
        this.loading_book_info = false
      }

      if (!data.items || data.items.length == 0) {
        console.log("No book was found") // TODO: snackbar
        return
      }

      const info = data.items[0].volumeInfo;

      this.bookinfo.title = info.title
      this.bookinfo.author = info.authors.join(", ")
      this.bookinfo.publisher = info.publisher
      this.bookinfo.image = info.imageLinks?.thumbnail || ''

    },
    clear_bookinfo() {
      this.bookinfo.image = ''
      this.bookinfo.title = ''
      this.bookinfo.author = ''
      this.bookinfo.publisher = ''
      this.bookinfo.isbn = ''
    }
  }
}
</script>
