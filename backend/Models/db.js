const mongoose = require('mongoose');
const dns = require('dns');

const mongo_url = process.env.MONGO_CONN;

if (!mongo_url) {
    console.error('MongoDB Connection Error: MONGO_CONN is missing in .env');
    process.exit(1);
}

dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose.connect(mongo_url, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('MongoDB Connected....');
    }).catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
    })
