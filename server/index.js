const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const port = process.env.SERVER_PORT || 4000;
const ctrl = require('./controller')
const users = require('./users')

const app = express();
// middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'asdfASDFasdfASDF',
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// auth0 strategy
const strategy = new Auth0Strategy({
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/login',
    scope: 'openid email profile'
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        console.log('profile', profile)
        // get name and other relevant data
        const user = {
            auth_id: profile.id, //id from google
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            img_url: profile.picture
        }
        return done(null, user)
    }
)
passport.use(strategy)
passport.serializeUser(function (user, done) {
    console.log('serializing user to session: user: ', user)
    //req.session.passport.user
    done(null, user)
})
passport.deserializeUser(function (user, done) {
//from database this would be app.db.get_all_users or whatever it would be.
    console.log('deserializing user: ', user)
    // find user by id
    const match = users.find((e) => e.auth_id === user.auth_id)
    if (match){
        console.log('found matching user');
        return done(null, match)
    }else{
        //db.addUser([match])
        users.push(user)
        console.log('users db: ', users)
        done(null, user)
    }
    // no user found; create user
})
// ENDPOINTS
// auth endpoint
app.get('/login', passport.authenticate('auth0', {
    successRedirect: "http://localhost:3000/#/dashboard",
    failureRedirect: "/"
}))
// check for logged in user
app.get('/check', ctrl.checkLoggedIn)
//logout
app.get('/logout', function (req, res) {
    //req.logout()
    console.log('loggin out')
    req.session.destroy(function () { res.send(200) })
})

app.listen(port, _ => console.log(`0,0 listening on port ${port}`))
