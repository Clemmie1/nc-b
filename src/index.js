const app = require('./app');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 5000;

app.listen(port, async () => {
    const keyPath = path.join(__dirname, 'oci', 'key.pem');
    const privateKey = fs.readFileSync(keyPath, 'utf-8');

    console.log(`Listening: http://localhost:${port}`);
    // console.log(privateKey);
});