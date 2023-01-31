import { defineStore } from 'pinia'
import { get } from 'idb-keyval'

export const useLibraryStore = defineStore({
  id: 'library',
  state: () => ({
    table: undefined,
    loading: false,
  }),
  getters: {
  },
  actions: {
    appendToLibrary(bookinfo) {
      this.library = [ ...this.library, bookinfo ]
    },
    async fetchLibrary() {
      console.log("fetching the library")
      this.loading = true

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

      function gvzDate(txt) {
        // parse to date a string such as 'Date(2023,0,30,23,36,36)'
        // returns undefined if invalid
        if (!txt) return undefined
        const m = `${txt}`.match(/^Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)$/)
        if (!m) return undefined
        return new Date(...m.slice(1))
      }

      table.forEach((e, i) => {
        table[i] = [ gvzDate(e[0]), ...e.slice(1) ]
      })
      // replace the date string in the first element with a date object

      this.library = table.map(
        r => ({
          date: r[0],
          bookcase: r[1],
          shelf: r[2],
          title: r[3],
          author: r[4],
          publisher: r[5],
          isbn: r[6],
          image: r[7],
        })
      )
      this.loading = false

      return this.library
    },
    async getLibrary() {
      // will always return a library, wether after fecthing or immediately

      if (this.library !== undefined) {
        // already fetched, return immediately
        console.log("already fetched, return immediately")
        return this.library
      }

      if (this.loading) {
        // is fetching: wait until fetched then return
        function timeout(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        while (this.loading) {
          await timeout(500)
        }
        return this.library
      }

      // not fetched nor fetching, will fetch now
      console.log("not fetched nor fetching, will fetch now")

      return await this.fetchLibrary()

    },
  }
})
