<template>
  <v-sheet
    rounded
    border
    class="mt-2"
  >
    <v-progress-linear
      indeterminate
      v-if="loading"
    ></v-progress-linear>
    <v-table>
      <thead>
        <tr>
          <th>{{ i18n_t('book.book') }}</th>
          <th>{{ i18n_t('book.bookcase') }}</th>
          <th>{{ i18n_t('book.shelf') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="i in Array(6)">
            <td v-for="j in Array(3)">
              <v-divider thickness="15" style="border-radius:10px; opacity: 0.07;"></v-divider></td>
          </tr>
        </template>
        <template v-if="library && library.length > 0">
          <tr
            v-for="book in renderedLibrary"
            :key="book.title"
          >
            <td>
              <div class="d-flex align-center">
                <div class="mr-2 my-1">
                  <v-img :src="book.image || '/no_cover.png'" width="40" height="80" contain class="ma-1"></v-img>
                </div>
                <div>
                  <div>{{ book.title }}</div>
                  <div class="text-caption">{{ [book.author, book.publisher].filter(v=>v).join(' • ') }}</div>
                </div>
              </div>
            </td>
            <td>
              <v-chip v-if="book.bookcase" :color="string2color(book.bookcase)">{{ book.bookcase }}</v-chip>
              <span v-else class="text-disabled">—</span>
            </td>
            <td>
              <span v-if="book.shelf">{{ book.shelf }}</span>
              <span v-else class="text-disabled">—</span>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>
    <div v-intersect="onIntersect"></div>
  </v-sheet>

</template>
<script>
export default {
  props: [ 'library', 'loading' ],
  data: () => ({
    max_items: 10,
  }),
  methods: {
    string2color(txt) {
      let hash = [...txt].reduce((acc, c) => {
        return c.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      return `hsl(${hash % 360}, 95%, 35%)`;
    },
    onIntersect(isIntersecting, entries, observer) {
      if (!isIntersecting) return
      this.max_items += 5
    }
  },
  computed: {
    renderedLibrary() {
      return this.library.slice(0, this.max_items)
    }
  },
  watch: {
    library() {
      this.max_items = 10
    }
  }
}
</script>
