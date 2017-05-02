const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
//JWT strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//local strategy
const LocalStrategy = require('passport-local');

const localOptions = {usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify email and password
  // Call done if a match
  // Call done false if it fails
  User.findOne({email: email}, (err, user) => {
    if(err) {return done(err);}
    if(!user) {return done(null, false);}
    //compare passwords
    user.comparePassword(password, (err, isMatch) => {
      if(err) {return done(err);}
      if (!isMatch) {return done(null, false);}
      return done(null, user);
    })
  })
})

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //Check for user id
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false) }
    //if it exists, call done with user
    //else call done without it
    if (user) {
      return done(null, user)
    }
    else {
      return done(null, false)
    }
  });
});

//tell passport to use strategies
passport.use(localLogin)
passport.use(jwtLogin);
