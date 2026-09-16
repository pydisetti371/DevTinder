const mongoose = require('mongoose');
const connectDb = async () => {
   await mongoose.connect("mongodb+srv://revannth:Revanth123@sampleproject.uw2rz0m.mongodb.net/devTinder")
}

module.exports = { connectDb }
