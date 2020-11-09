// The last "domLoading" Time //
var currentDocumentTimestamp =
new Date(performance.timing.domLoading).getTime();
// Current Time //
var now = Date.now();
// Ten Seconds //
var tenSec = 10 * 1000;
// Plus Ten Seconds //
var plusTenSec = currentDocumentTimestamp + tenSec;
if (now > plusTenSec) {
location.reload();
} else {}
reloadPage();