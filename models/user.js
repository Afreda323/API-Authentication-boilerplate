const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: String
});

userSchema.pre('save', function(next){
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash;
    next()
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err){return callback(err)}
    callback(null, isMatch);
  })
}
const User = mongoose.model('user', userSchema);

module.exports = User;
