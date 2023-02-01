<template>
  <v-container>
    Home page
    <v-btn @click="reloadLibrary" :loading="reloading">reload</v-btn>

    <v-sheet
      rounded
      border
      class="mt-2"
    >
      <v-progress-linear
        indeterminate
        v-if="initializing"
      ></v-progress-linear>
      <v-table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Bookcase</th>
            <th>Shelf</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="initializing">
            <tr v-for="i in Array(6)">
              <td v-for="j in Array(3)">
                <v-divider thickness="15" style="border-radius:10px; opacity: 0.07;"></v-divider></td>
            </tr>
          </template>
          <tr
            v-for="book in library"
            :key="book.title"
          >
            <td>
              <div class="d-flex align-center">
                <div class="mr-2 my-1">
                  <v-img :src="book.image || '/no_cover.png'" width="40" class="ma-1"></v-img>
                </div>
                <div>
                  <div>{{ book.title }}</div>
                  <div class="text-caption">{{ [book.author, book.publisher].filter(v=>v).join(' • ') }}</div>
                </div>
              </div>
            </td>
            <td><v-chip :color="string2color(book.bookcase)">{{ book.bookcase }}</v-chip></td>
            <td>{{ book.shelf }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
  </v-container>
</template>
<script>
import { get } from 'idb-keyval'
import { mapActions } from 'pinia'
import { useLibraryStore } from '../stores/library'
export default {
  data: () => ({
    library: undefined,
    reloading: false,
    initializing: true,
  }),
  async created() {
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
    string2color(txt) {
      let hash = [...txt].reduce((acc, c) => {
        return c.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      return `hsl(${hash % 360}, 95%, 35%)`;
    },
  }
}
</script>
