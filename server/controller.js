module.exports = {
    checkLoggedIn: function (req, res) {
        console.log('checking for logged in user')
        //check if user has logged in 
        if (req.session.passport) {
            res.status(200).send(req.session.passport.user)
        } else res.status(401).send('unauthorized')
    }
}