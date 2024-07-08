const mongoose = require('mongoose');
const axios = require('axios');
const ProductTransaction = require('./models/ProductTransaction');

const dbUri = 'mongodb://localhost:27017/product_transactions';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchAndSeedData() {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await ProductTransaction.deleteMany({});
        await ProductTransaction.insertMany(transactions);

        console.log('Database seeded successfully');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding the database:', error);
        mongoose.disconnect();
    }
}

fetchAndSeedData();
