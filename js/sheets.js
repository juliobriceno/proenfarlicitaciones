var google = require('googleapis');

module.exports = {
    GetSheetRange: function GetSheetRange(jwtClient, Range, SheetId, callback)
    {
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: SheetId,
            range: Range,
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            return callback(response.values);
        });
    }
}
