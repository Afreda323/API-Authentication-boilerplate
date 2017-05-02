const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config.js');

function createToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
  //check for email and pass
  if (req.body.email && req.body.password) {
    //check if user with email exists
    User.findOne({email: req.body.email}, (err, existing) => {
      //handle error
      if (err) {
        return next(err)
      }
      //if user does exist, return error
      if (existing) {
        return res.status(422).json({error: 'Email is in use'})
      }
      //else create a new user
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });
      newUser.save((err) => {
        if (err) {
          return next(err)
        }
        //respond to req
        return res.json({token: createToken(newUser)})
      });
    })

  }else {
    return res.status(422).json({error: 'All fields not provided'})
  }
}

exports.login = function (req, res, next) {
  //Give user a token after successful login
  res.json({token: createToken(req.user)})
}
