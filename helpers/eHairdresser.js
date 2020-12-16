module.exports = {
    eHairdresser: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Você precisa logar para ter acesso :)')
        res.redirect('/')
    }
}