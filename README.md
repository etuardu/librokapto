# Librokapto

A book catalogation web app.

# Usage

A public instance of Librokapto, available to use for anyone, is running at https://librokapto.web.app

# Configuration

To use Librokapto you first need to setup a Google Sheet document for data storage and a Google Web App as endpoint to insert books.
Once done, you can configure Librokapto with their respective URLs.

## Google Sheets document URL

- Create a new Google Sheet
- Put these headers in A1-H1: `Insertion date | Bookcase | Shelf | Title | Author | Publisher | ISBN | Image`
- Share the sheet so that anyone on the internet with the link can view it
- Get the sheet sharing link and put it in the Librokapto *Google Sheet document URL*

## Google Sheets App URL

- In the Google Sheet you created, go to Extensions → Apps Script
- Copy and paste the following code in `Code.gs`:

```js
function addBook({bookcase, shelf, title, author, publisher, isbn, image}) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  const values = [new Date(), "'"+bookcase, shelf, "'"+title, "'"+author, "'"+publisher, "'"+isbn, image];
  sheet.appendRow(values);
  return values;
}
function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  let response = { status: "err", message: "Unsupported request" }
  if (data.op == 'addBook') {
    const ret = addBook(data.bookinfo)
    response = { status: "ok", values: ret }
  }
  return ContentService.createTextOutput(JSON.stringify({
    request_echo: e,
    postData: data,
    response
  })).setMimeType(ContentService.MimeType.JSON);
}
```

- Deploy the app clicking on Deploy → New deployment
- As deployment type choose "Web App"
- As "Execute as" choose "Me"
- As "Who has access" choose "Anyone"
- Click on Deploy
- Copy the Web App URL, which is in the form `https://script.google.com/macros/s/…/exec` and put it in the Librokapto *Google Sheet Librokapto app URL*
