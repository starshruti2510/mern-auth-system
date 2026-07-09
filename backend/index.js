const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
require('./Models/db');

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Auth backend is running',
        routes: ['/ping', '/auth', '/products']
    });
});

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

module.exports = app;
module.exports.default = app;
