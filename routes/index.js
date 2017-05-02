const auth = require('../controllers/auth');
const Router = require('express').Router();
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false})

Router.get('/', requireAuth, (req, res) => {
  res.json({'/': 'lol'})
})

Router.post('/signup', auth.signup)
Router.post('/login', requireLogin, auth.login)

module.exports = Router;
