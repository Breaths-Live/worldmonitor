const fs = require('fs');
const content = fs.readFileSync('ts_errors.log', 'utf16le');
fs.writeFileSync('ts_errors_utf8.log', content, 'utf8');
