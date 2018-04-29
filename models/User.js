const mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/capthat')
}

const db = mongoose.connection
const user = mongoose.Schema({
    name: String,
    username: String,
    uploads: [{}],
    twitterID: String
})


const User = mongoose.model('user', user)

module.exports = User