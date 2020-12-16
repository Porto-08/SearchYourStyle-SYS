const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Hairdresser = new Schema({

    //Hairdresser
        email: {
            type: String,
            require: true
        },

        eAdmin: {
            type: Number,
            default: 0
        },

        password: {
            type: String,
            require: true
        },

        name: {
            type: String,
            require: true   
        },

        gender: {
            type: String,
            require: true
        },
        cellphone: {
            type: String,
            require: true
        },
  
    //Hairdresser Salon

        salonName: {
            type: String,
            require: true
        },
        specialty: {
            type: String,
            require: true
        },
        landline: {
            type: String
        },
        cnpj: {
            type: String,
            require: true
        },
        neighborhood: {
            type: String,
            require: true
        },
        typeAdress: {
            type: String,
            require: true
        },
        adress: {
            type: String,
            require: true
        },
        number: {
            type: String,
            require: true
        },
        complement: {
            type: String
        },
        categorie_1: {
            type: String,
            required: true
        },
        categorie_2: {
            type: String,
            required: true
        },
        categorie_3: {
            type: String,
            required: true
        },
        categorie_4: {
            type: String,
            required: true
        },
        openTime: {
            type: String,
            required: true
        },
        closeTime: {
            type: String,
            required: true
        },
        weekOpen: {
            type: String,
            required: true
        },
        weekClose: {
            type: String,
            required: true
        },
        scheduling: {
            type: String,
            required: true
        },
        img: {
            type: String
        },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('hairdressers', Hairdresser)