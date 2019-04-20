const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String },
  pages: { type: Number },
  category: { type: String },
  price: { type: Number },
  author: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
