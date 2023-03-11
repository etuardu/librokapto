import { getMany } from 'idb-keyval'
export default {
  methods: {
    async is_configured() {
      const [doc_url, app_url] = await getMany([
        'u_gsheet_doc_url',
        'u_gsheet_app_url'
      ])
      return doc_url && app_url
    }
  }
}
