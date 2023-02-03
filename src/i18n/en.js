import { en } from 'vuetify/locale'

export default {
  ...en,
  nav: {
    'library': 'Library',
    'add_books': 'Add books',
    'settings': 'Settings',
    'about': 'About',
  },
  library: {
    'search_book': 'Search a book…',
    'results': 'results',
    'open_in_gs': 'Open in Google Sheets',
    'refresh': 'Refresh',
  },
  book: {
    'book': 'Book',
    'bookcase': 'Bookcase',
    'shelf': 'Shelf',
    'title': 'Title',
    'author': 'Author',
    'publisher': 'Publisher',
  },
  insert: {
    'bookcase_mandatory': 'Please specify a bookcase.', 
    'shelf_mandatory': 'Please specify a shelf number.',
    'shelf_numeric_only': 'The shelf field must contain digits only (0-9).',
    'save': 'Save',
    'scan_isbn': 'Scan ISBN',
    'isbn_not_found': 'ISBN not found',
    'clear_fields': 'Clear all fields',
    'gbooks_unreachable': 'Server unreachable',
  },
  settings: {
    'gsheets_doc_url': 'Google sheets document URL',
    'gsheets_app_url': 'Google sheets Librokapto app URL',
    'language': 'Language',
    'save_settings': 'Save settings',
    'share_config': 'Share configuration',
    'config_loaded': 'Configuration loaded from shared link. Please save the settings if you want to keep it.',
    'save_success': 'Your settings has been updated!',
    'save_failure': 'Unable to save settings',
    'copy_success': 'Configuration link copied to clipboard!',
    'copy_failure': 'Cannot copy to clipboard',
  },
  langs: {
    'en': 'English',
    'it': 'Italian',
  },
  about: {
    'title': 'About Librokapto',
  }
}
