const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({

    name: {
        type: String,
        require: true   
    },  

    email: {
        type: String,
        require: true
    },

    eUser: {
        type: Number,
        default: 0
    },

    password: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('users', User)