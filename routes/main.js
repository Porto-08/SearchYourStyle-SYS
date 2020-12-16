const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/User')
const User = mongoose.model('users')
require('../models/Hairdresser')
const Hairdresser = mongoose.model('hairdressers')
require('../models/Categorie')
const Categorie = mongoose.model('categories')
require('../models/Neighborhood')
const Neighborhood = mongoose.model('neighborhoods')

router.get('/search', (req, res) => {
    Categorie.find().then((categories) => {
        Neighborhood.find().then((neighborhoods) => {
            Hairdresser.find().then((hairdressers) => {
                res.render('main/search', {
                    categories: categories.map(categories => categories.toJSON()),
                    neighborhoods: neighborhoods.map(neighborhoods => neighborhoods.toJSON()),
                    hairdressers: hairdressers.map(hairdressers => hairdressers.toJSON())
                })
            })
        })
    })
})

router.get('/hairdresserDetails/:id', (req, res) => {
    Hairdresser.findOne({_id: req.params.id}).lean().then((hairdresser) => {
        res.render('main/hairdresserDetails', {hairdresser: hairdresser})
    })
})

// Cadastro
router.get('/typeRegister', (req, res) => {
    User.find().then((users) => {
        Hairdresser.find().then((hairdressers) => {
            res.render('main/typeRegister', {
                users: users.map(User => User.toJSON()),
                hairdressers: hairdressers.map(Hairdresser => Hairdresser.toJSON()),
            })
        })
    })
})

module.exports = router