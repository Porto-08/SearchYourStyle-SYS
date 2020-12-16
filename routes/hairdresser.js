const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../config/authHairdresser')(passport)

require('../models/Hairdresser')
const Hairdresser = mongoose.model('hairdressers')
require('../models/Categorie')
const Categorie = mongoose.model('categories')
require('../models/Neighborhood')
const Neighborhood = mongoose.model('neighborhoods')

router.get('/register', (req, res) => {
    Categorie.find().then((categories) => {
        Neighborhood.find().then((neighborhoods) => {
            res.render('hairdresser/register', {
                categories: categories.map(categories => categories.toJSON()),
                neighborhoods: neighborhoods.map(neighborhoods => neighborhoods.toJSON()),
            })
        })
    })
})

router.post('/register', (req, res) => {
    // Validação
    var err = []
    var muitosErros = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        err.push({ text: 'Nome Inválido, corrija.' })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        err.push({ text: 'Email Inválido, corrija.' })
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        err.push({ text: 'Senha Inválida, corrija.' })
    }
    if (req.body.password.length < 5) {
        err.push({ text: 'Senha muito curta, mínimo de 5 digitos.' })
    }
    if (req.body.password.length > 16) {
        err.push({ text: 'Senha muito grande, máximo de 16 digitos.' })
    }
    if (req.body.password != req.body.password_2) {
        err.push({ text: 'Senhas não correspondentes, corrija.' })
    }
    if (!req.body.cellphone || typeof req.body.cellphone == undefined || req.body.cellphone == null) {
        err.push({ text: 'Número de Celular é Obrigatório' })
    }
    if (req.body.cellphone.length != 15) {
        err.push({ text: 'Celular inválido, corrija de acordo com o exemplo.' })
    }
    if (!req.body.salonName || typeof req.body.salonName == undefined || req.body.salonName == null) {
        err.push({ text: 'Nome do Salão inválido, corrija.' })
    }
    if (!req.body.specialty || typeof req.body.specialty == undefined || req.body.specialty == null) {
        err.push({ text: 'Especialidade Obrigatória, corrija.' })
    }
    if (req.body.landline.length >= 1 && req.body.landline.length < 14) {
        err.push({ text: 'Telefone inválido, siga o exemplo de 10 números.' })
    }
    if (req.body.landline.length < 1) {
        req.body.landline = "Sem telefone fixo"
    }
    if (!req.body.cnpj || typeof req.body.cnpj == undefined || req.body.cnpj == null) {
        err.push({ text: 'CNPJ inválido, corrija.' })
    }
    if (!req.body.neighborhood || typeof req.body.neighborhood == undefined || req.body.neighborhood == null) {
        err.push({ text: 'Bairro obrigatório, corrija.' })
    }
    if (!req.body.typeAdress || typeof req.body.typeAdress == undefined || req.body.typeAdress == null) {
        err.push({ text: 'Tipo de Logradouro obrigatório, corrija.' })
    }
    if (!req.body.adress || typeof req.body.adress == undefined || req.body.adress == null) {
        err.push({ text: 'Endereço é Obrigatório' })
    }
    if (req.body.adress.length < 5) {
        err.push({ text: 'Logradouro muito curto' })
    }
    if (req.body.adress.length > 70) {
        err.push({ text: 'Logradouro muito extenso' })
    }
    if (!req.body.number || typeof req.body.number == undefined || req.body.number == null) {
        err.push({ text: 'Número de identificação do logradouro é Obrigatório' })
    }
    if (req.body.number.length > 5) {
        err.push({ text: 'Númeragem muito extensa' })
    }
    if (req.body.complement.length < 1) {
        req.body.complement = "Sem Complemento"
    }
    if (!req.body.categorie_1 || typeof req.body.categorie_1 == undefined || req.body.categorie_1 == null ||
        !req.body.categorie_2 || typeof req.body.categorie_2 == undefined || req.body.categorie_2 == null ||
        !req.body.categorie_3 || typeof req.body.categorie_3 == undefined || req.body.categorie_3 == null ||
        !req.body.categorie_4 || typeof req.body.categorie_4 == undefined || req.body.categorie_4 == null) {
        err.push({ text: 'Categorias são Obrigatórias' })
    }
    if (!req.body.scheduling || typeof req.body.scheduling == undefined || req.body.scheduling == null) {
        err.push({ text: 'Trabalha ou não com agendamento é um dado Obrigatório' })
    }
    if (err.length > 0) {
        if (err.length > 0 && err.length <= 5) {
            Categorie.find().then((categories) => {
                Neighborhood.find().then((neighborhoods) => {
                    res.render('hairdresser/register', {
                        categories: categories.map(categories => categories.toJSON()),
                        neighborhoods: neighborhoods.map(neighborhoods => neighborhoods.toJSON()),
                        err: err
                    })
                })
            })
        }
        else if (err.length > 5) {
            muitosErros.push({ text: "Muitos erros aconteceram! Siga os exemplos" })
            Categorie.find().then((categories) => {
                Neighborhood.find().then((neighborhoods) => {
                    res.render('hairdresser/register', {
                        categories: categories.map(categories => categories.toJSON()),
                        neighborhoods: neighborhoods.map(neighborhoods => neighborhoods.toJSON()),
                        muitosErros: muitosErros
                    })
                })
            })
        }
    } else {
        Hairdresser.findOne({ email: req.body.email }).lean().then((email) => {
            Hairdresser.findOne({ cnpj: req.body.cnpj }).lean().then((cnpj) => {
                if (email || cnpj) {
                    if (email) {
                        console.log('Email identico encontrado')
                        req.flash('error_msg', "Já existe uma conta com esse email. É você? Acesse sua Conta!")
                        res.redirect('/hairdresser/register')
                    }
                    else if (cnpj) {
                        console.log('CNPJ identico encontrado')
                        req.flash('error_msg', "Já existe uma conta com esse CNPJ. É você? Acesse sua Conta!")
                        res.redirect('/hairdresser/register')
                    }
                } else {
                    const newHairdresser = new Hairdresser({
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        gender: req.body.gender,
                        cellphone: req.body.cellphone,
                        salonName: req.body.salonName,
                        specialty: req.body.specialty,
                        landline: req.body.landline,
                        cnpj: req.body.cnpj,
                        neighborhood: req.body.neighborhood,
                        district: req.body.district,
                        typeAdress: req.body.typeAdress,
                        adress: req.body.adress,
                        number: req.body.number,
                        complement: req.body.complement,
                        categorie_1: req.body.categorie_1,
                        categorie_2: req.body.categorie_2,
                        categorie_3: req.body.categorie_3,
                        categorie_4: req.body.categorie_4,
                        openTime: req.body.openTime,
                        closeTime: req.body.closeTime,
                        weekOpen: req.body.weekOpen,
                        weekClose: req.body.weekClose,
                        scheduling: req.body.scheduling,
                        img: req.body.img
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newHairdresser.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err)
                                req.flash('error_msg', 'Houver um erro durante a criação da conta, tente novamnete!')
                                res.redirect('/hairdresser/register')
                            }

                            newHairdresser.password = hash

                            newHairdresser.save().then(() => {
                                console.log('Cabelereiro registrado')
                                req.flash('success_msg', 'Sua conta foi criada com sucesso, obrigado!')
                                res.redirect('/hairdresser/admin')
                            }).catch((err) => {
                                console.log(err)
                                req.flash('error_msg', 'Não foi possivel criar sua conta, tente novamente!')
                                res.redirect('/hairdresser/register')
                            })
                        })
                    })
                }
            })
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/hairdresser/register')
        })
    }
})

router.get('/admin', (req, res) => {
        res.render('hairdresser/admin')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/hairdresser/admin',
        failureRedirect: '/hairdresser/register',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogado com Sucesso!")
    res.redirect('/')
})


module.exports = router