<template>
  <v-container>
    Home page
    <v-btn @click="reloadLibrary" :loading="reloading">reload</v-btn>

    <v-table>
      <tbody>
        <tr
          v-for="book in library"
          :key="book.title"
        >
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td><v-img v-if="book.image" :src="book.image" width="40" class="ma-1"></v-img></td>
        </tr>
      </tbody>
    </v-table>
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
  }),
  async created() {
    this.library = await this.getLibrary()
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
    }
  }
}
</script>
