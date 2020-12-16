const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Hairdresser')
const Hairdresser = mongoose.model('hairdressers')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        Hairdresser.findOne({email: email}).then((hairdresser) => {
            if(!hairdresser){
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(password, hairdresser.password, (error, batem) => {
                if(batem){
                    return done(null, hairdresser)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((hairdresser, done) => {
        done(null, hairdresser.id)
    })

    passport.deserializeUser((id, done) => {
        Hairdresser.findById(id, (err, hairdresser) => {
            done(err, hairdresser)
        })
    })
}