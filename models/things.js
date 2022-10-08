const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ThingsSchema = new Schema({
    item1: String,
    item2: String,
    item3: String
  });

  module.exports = mongoose.model('Thing', ThingsSchema); 