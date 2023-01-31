<template>
  <v-container>
    Home page
  </v-container>
</template>
<script>
import { get } from 'idb-keyval'
export default {
  async created() {
    this.fetch_library()
  },
  methods: {
    gvzDate(txt) {
      // parse to date a string such as 'Date(2023,0,30,23,36,36)'
      // returns undefined if invalid
      if (!txt) return undefined
      const m = `${txt}`.match(/^Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)$/)
      if (!m) return undefined
      return new Date(...m.slice(1))
    },
    async fetch_library() {
      const gsheet_url = new URL('gviz/tq', await get('u_gsheet_doc_url'))
      gsheet_url.searchParams.append('gid', '0')
      gsheet_url.searchParams.append('tq', 'SELECT A,B,C,D,E,F,G,H')
      
      const text = await (await fetch(gsheet_url)).text()

      // strip off the bits added by google that surrounds the json:
      // "/*O_o*/\ngoogle.visualization.Query.setResponse({ … });"
      // => "{ … }"
      const response = JSON.parse(
        text.slice(
          text.indexOf('{'),
          text.lastIndexOf('}')+1,
        )
      )

      const table = response.table.rows.map(
        row => row.c.map(
          cell => cell?.v
        )
      )
      // table == [
      //   [ 'Date(2023,0,30,23,36,36)', <bookcase>, <shelf>, <title>, <author>, <publisher>, <isbn>, <image> ],
      //   …
      // ]
      // Note that the first element is a string containing a date

      table.forEach((e, i) => {
        table[i] = [ this.gvzDate(e[0]), ...e.slice(1) ]
      })
      // replace the date string in the first element with a date object

      console.log(table)
    }
  }
}
</script>
