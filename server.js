const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 8050;

app.use(express.static(__dirname + '/public'));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
        callbackURL: 'https://gentle-ocean-27020.herokuapp.com/auth/google/callback',
        scope: ['email'],
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log('Our user authenticated with Google, and Google sent us back this profile info identifying the authenticated user:', profile);
        return cb(null, profile);
    },
));

// app.get('/test', (req, res) => {
//     res.send('your api is working!');
// });

// app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    (req, res) => {
        console.log('woooo we authenticated, here is our user object:', req.user);
        res.json(req.user);
    }
);

const server = app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
