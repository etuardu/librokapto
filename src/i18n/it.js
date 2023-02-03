import { it } from 'vuetify/locale'

export default {
  ...it,
  nav: {
    'library': 'Libreria',
    'add_books': 'Aggiungi libri',
    'settings': 'Impostazioni',
    'about': 'Informazioni',
  },
  library: {
    'search_book': 'Cerca un libro…',
    'results': 'risultati',
    'open_in_gs': 'Apri in Google Sheets',
    'refresh': 'Ricarica',
  },
  book: {
    'book': 'Libro',
    'bookcase': 'Scaffale',
    'shelf': 'Ripiano',
    'title': 'Titolo',
    'author': 'Autore',
    'publisher': 'Casa editrice',
  },
  insert: {
    'bookcase_mandatory': 'Specificare uno scaffale', 
    'shelf_mandatory': 'Specificare un ripiano.',
    'shelf_numeric_only': 'Il ripiano deve essere un numero.',
    'save': 'Salva',
    'scan_isbn': 'Scansiona',
    'isbn_not_found': 'ISBN non trovato',
    'clear_fields': 'Resetta tutti i campi',
    'gbooks_unreachable': 'Server irraggiungibile',
  },
  settings: {
    'gsheets_doc_url': 'URL del foglio Google',
    'gsheets_app_url': 'URL dell\'app Google fogli per Librokapto',
    'language': 'Lingua',
    'save_settings': 'Salva impostazioni',
    'share_config': 'Condividi configurazione',
    'config_loaded': 'La configurazione è stata caricata dal link condiviso. Salva le impostazioni se la vuoi conservare.',
    'save_success': 'Le impostazioni sono state salvate!',
    'save_failure': 'Impossibile salvare le impostazioni',
    'copy_success': 'Il link di configurazione è stato copiato negli appunti!',
    'copy_failure': 'Impossibile copiare negli appunti',
  },
  langs: {
    'en': 'Inglese',
    'it': 'Italiano',
  },
  about: {
    'title': 'Informazioni su Librokapto'
  }
}
