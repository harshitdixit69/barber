const passport = require('passport')
const googlestrategy = require('passport-google-oauth2').Strategy


passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new googlestrategy({
    clientID: '612992063767-19ni9cdbneloqfdn29u8ra4f8addpdcm.apps.googleusercontent.com',
    clientSecret: 'rO_ifx7B6x7x_xmN3lchqEDp',
    callbackURL: 'http://localhost:3001/google/callback',
    passReqToCallback: true
}, function (require, accessToken, refreshToken, profile, done) {
    // console.log(null, profile)
    return done(null, profile)
}))
