const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/Hairdresser')
const Hairdresser = mongoose.model('hairdressers')
require('../models/Categorie')
const Categorie = mongoose.model('categories')
require('../models/Neighborhood')
const Neighborhood = mongoose.model('neighborhoods')
require('../models/User')
const User = mongoose.model('users')
require('../models/Company')
const Company = mongoose.model('companys')

router.get('/index', (req, res) => {
    Company.find().then((companys) => {
        res.render('user/index', { companys: companys.map(Company => Company.toJSON()) })
    }).catch((err) => {
        console.log('Houve um erro' + err)
        res.redirect('/')
    })
})

router.get('/index', (req, res) => {
    res.render('user/index')
})

router.get('/search', (req, res) => {
    Categorie.find().then((categories) => {
        Neighborhood.find().then((neighborhoods) => {
            Hairdresser.find().then((hairdressers) => {
                Company.find().then((companys) => {
                    res.render('user/search', {
                        categories: categories.map(categories => categories.toJSON()),
                        neighborhoods: neighborhoods.map(neighborhoods => neighborhoods.toJSON()),
                        hairdressers: hairdressers.map(hairdressers => hairdressers.toJSON()),
                        companys: companys.map(companys => companys.toJSON())
                    })
                })
            })
        })
    })
})

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {
    // Validação
    var err = []
    var err_name = []
    var err_email = []
    var err_password = []

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        err_name.push({ text: 'Nome Inválido, corrija.' })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        err_email.push({ text: 'Email Inválido, corrija.' })
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        err_password.push({ text: 'Senha Inválida, corrija.' })
    }
    // Tamanhos Password 
    else if (req.body.password.length < 5) {
        err_password.push({ text: 'Senha muito curta, minimo de 5 digitos.' })
    }
    else if (req.body.password.length > 16) {
        err_password.push({ text: 'Senha muito grande, maximo de 16 digitos.' })
    }

    if (req.body.password != req.body.password_2) {
        err.push({ text: 'Senhas não correspondentes, corrija.' })
    }

    if (err.length > 0 || err_name.length > 0 || err_email.length > 0 || err_password.length > 0) {
        res.render('user/register', {
            err: err,
            err_name: err_name,
            err_email: err_email,
            err_password: err_password
        })
    } else {
        User.findOne({ email: req.body.email }).lean().then((user) => {
            if (user) {
                console.log('Email identico encontrado')
                req.flash('error_msg', 'Já existe uma conta com esse email. É você? Acesse sua Conta!')
                res.redirect('/user/register')
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.password, salt, (erro, hash) => {
                        if (erro) {
                            console.log(erro)
                            req.flash('error_msg', 'Houver um erro durante a criação da conta, tente novamnete!')
                            res.redirect('/user/register')
                        }

                        newUser.password = hash

                        newUser.save().then(() => {
                            console.log('usuario registrado')
                            req.flash('success_msg', 'Sua conta foi criada com sucesso, obrigado!')
                            res.redirect('/user/index')
                        }).catch((err) => {
                            console.log(err)
                            req.flash('error_msg', 'Não foi possivel criar sua conta, tente novamente!')
                            res.redirect('/user/register')
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/user/register')
        })
    }
})

router.get('/hairdresserDetails/:id', (req, res) => {
    Hairdresser.findOne({_id: req.params.id}).lean().then((hairdresser) => {
        res.render('user/hairdresserDetails', {hairdresser: hairdresser})
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/index',
        failureRedirect: '/user/register',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogado com Sucesso!")
    res.redirect('/')
})

module.exports = router