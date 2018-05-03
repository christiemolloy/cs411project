const mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/capthat')
}
//Use the existing connection if there is one

const db = mongoose.connection
const user = mongoose.Schema({
    name: String,
    username: String,
    uploads: [{}],		//stores the photo-caption pairs saved by user
    twitterID: String
})


const User = mongoose.model('user', user)

module.exports = User