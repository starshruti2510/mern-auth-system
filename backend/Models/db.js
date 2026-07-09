const mongoose = require('mongoose');
const dns = require('dns');

const mongo_url = process.env.MONGO_CONN;
let connectionError = null;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!mongo_url) {
        connectionError = 'MONGO_CONN is missing in environment';
        console.warn('MongoDB Connection Warning:', connectionError);
        return;
    }

    dns.setServers(['8.8.8.8', '1.1.1.1']);

    try {
        await mongoose.connect(mongo_url, {
            serverSelectionTimeoutMS: 5000,
        });
        connectionError = null;
        console.log('MongoDB Connected....');
    } catch (err) {
        connectionError = err.message;
        console.error('MongoDB Connection Error:', connectionError);
    }
};

connectToDatabase();

module.exports = {
    mongoose,
    connectToDatabase,
    isConnected: () => mongoose.connection.readyState === 1,
    getConnectionError: () => connectionError,
};
