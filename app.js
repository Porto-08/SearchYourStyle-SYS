const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Express
const app = express()
// Models
//

// Helpers
//

// Config
// Require Routes
// Admin    
const hairdresser = require('./routes/hairdresser')
const user = require('./routes/user')
const main = require('./routes/main')
// Sessao
app.use(session({
    secret: 'samuel',
    resave: true,
    saveUninitialized: true
}))
// Passport
require('./config/authHairdresser')(passport)
app.use(passport.initialize())
app.use(passport.session())
// Flash
app.use((flash()))
//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
});
// Template Engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// // Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bd_sys', {
    useNewUrlParser: true
}).then(() => {
    console.log('Conectado com ao mongo, Banco "bd_sys"')
}).catch((erro) => {
    console.log(`Houve um erro inesperado: ${erro}`)
})
// Public
app.use(express.static(path.join(__dirname, 'public')))

// Rotas Index
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/index', (req, res) => {
    res.render('index')
})

// Exports Routes
app.use('/user', user)
app.use('/hairdresser', hairdresser)
app.use('/main', main)

// Server
app.listen(1910, () => {
    console.log('Servidor Subiu!')
})