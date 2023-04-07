const { Schema, model, Types } = require('mongoose');

const User = new Schema({
  firstName: { type: String, default: 'UserName' },
  secondName: { type: String, default: '' },
  email: { type: String, required: true, uique: true },
  password: { type: String, required: true },
  diskSpace: { type: Number, default: 1024 ** 3 * 10 },
  usedSpace: { type: Number, default: 0 },
  avatar: { type: String },
  files: { type: Types.ObjectId, ref: 'File' },
});

module.exports = model('User', User);
