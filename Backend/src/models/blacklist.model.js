const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token is required']
  }
});

const TokenBlacklistModel = mongoose.model('tokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklistModel;