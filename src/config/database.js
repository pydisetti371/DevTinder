const mongoose = require('mongoose');
console.log(process.env.mongoURL)
const connectDb = async () => {
   await mongoose.connect(process.env.MONGO_URL)
}

module.exports = { connectDb }
