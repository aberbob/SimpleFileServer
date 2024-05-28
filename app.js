const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');
const cors = require('cors');
const volleyball = require('volleyball');
const app = express();

// Set this constant to true for HTTPS, false for HTTP
const USE_HTTPS = false;
// Folder for servering files from
const PublicDir = 'public';
// Server Port
const PORT = 7108;

// Create folder if it doesn't exist
if (!fs.existsSync(PublicDir)){
    fs.mkdirSync(PublicDir, { recursive: true });
}

// Enable volleyball HTTP request logging
app.use(volleyball);

// Disable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, PublicDir)));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

if (USE_HTTPS) {
    const pems = selfsigned.generate(null, { days: 365 });

    fs.writeFileSync('./cert.pem', pems.cert);
    fs.writeFileSync('./key.pem', pems.private);

    const credentials = { key: pems.private, cert: pems.cert };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server is running on port ${PORT}`);
    });
} else {
    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
        console.log(`HTTP Server is running on port ${PORT}`);
    });
}
