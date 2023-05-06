const passport = require('passport');
const User = require("../user/user.model")
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
        callbackURL: 'https://gentle-ocean-27020.herokuapp.com/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('user profile is:', profile);
    }
));