require('dotenv').config();
const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connected MongoDB');
    } catch (error) {
        if (error) throw error;
    }
}
module.exports = { connect };
