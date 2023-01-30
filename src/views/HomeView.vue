<template>
  <v-container>

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

    <v-row class="mt-2">
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
    </v-row>

    <v-img
      v-if="is_bookinfo_filled"
      height="110"
      width="80"
      :src="bookinfo.image || '/no_cover.png'"
      contain
    >
    </v-img>
    
  </v-container>
  <v-footer app bottom fixed class="pa-1" elevation="3">
    <v-container fluid class="pa-0">
      <v-row align="center" justify="center">
      <!--
        <v-col d-flex class="flex-shrink-1 flex-grow-0">
          <v-img
            v-if="is_bookinfo_filled"
            height="110"
            width="80"
            :src="bookinfo.image || '/no_cover.png'"
            contain
          >
          </v-img>
        </v-col>
        -->
        <v-col d-flex class="flex-shrink-0 flex-grow-1">
          <v-text-field
            density="compact"
            label="Bookcase"
            v-model="bookcase"
            hide-details
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Shelf"
            v-model="shelf"
            hide-details
          >
            <template v-slot:append-inner>
              <v-icon
                icon="mdi-plus"
              />
            </template>
            <template v-slot:prepend-inner>
              <v-icon
                icon="mdi-minus"
              />
            </template>
          </v-text-field>
        </v-col>
        <v-col d-flex class="flex-shrink-1 flex-grow-0">
          <v-scale-transition mode="out-in" origin="center center">
            <v-btn
              v-if="is_bookinfo_filled"
              :loading="loading_book_saving"
              color="blue-darken-3"
              style="width: 150px"
              size="x-large"
              rounded="pill"
              stacked
              prepend-icon="mdi-content-save"
              @click="save_book"
            >
              Save
            </v-btn>
            <v-btn
              v-else
              color="amber-lighten-2"
              style="width: 150px"
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
    </v-container>
  </v-footer>


</template>
<script>
import TheWelcome from '../components/TheWelcome.vue'
import QuaggaScanner from '../components/QuaggaScanner.vue'
export default {
  components: {
    'quagga-scanner': QuaggaScanner
  },
  data: () => ({
    gsheet_app_url: 'https://script.google.com/macros/s/AKfycbzMVK1k3p2t4iqK-tbxcTsHpk3uY0pwtjVAZDrqO5ubra9fE8HaOqcSaG03OqTTTjuz/exec',
    quagga_visible: false,
    bookinfo: {
      image: '',
      isbn: '',
      title: '',
      author: '',
      publisher: '',
    },
    bookcase: 'Test bookcase',
    shelf: 1,
    loading_book_info: false,
    loading_book_saving: false,
  }),
  computed: {
    is_bookinfo_filled() {
      // true if at least the title is filled
      return this.bookinfo.title
    },
  },
  methods: {
    onscan(code) {
      this.bookinfo.isbn = code
      this.quagga_visible = false
      this.fetch_book_info()
    },
    toggle_quagga() {
      this.quagga_visible = !this.quagga_visible
    },
    async save_book() {
      this.loading_book_saving = true
      const resp = await this.post_to_gsheet({
        op: 'addBook',
        bookinfo: {
          title: this.bookinfo.title,
          author: this.bookinfo.author,
          publisher: this.bookinfo.publisher,
          image: this.bookinfo.image,
          isbn: this.bookinfo.isbn,
          place: this.bookcase,
          shelf: this.shelf,
        }
      })
      this.loading_book_saving = false
      // TODO: snackbar "Saved!"
      // TODO: error handling
      this.clear_bookinfo()
    },
    async post_to_gsheet(data) {
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

