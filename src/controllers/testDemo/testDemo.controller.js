'use strict';
const util = require('util');
const mongojs = require('mongojs');
var db = mongojs('mycustomers',['students'])
//const mongoose = require('mongoose');
//var Student = require('../models/students.model');


/**
  * @api {get} /testDemo/
  * @apiGroup testDemo
  * @apiName GettestDemo
  * @apiDescription some api description
  *
  * @apiVersion 1.0.0
  */
exports.index = (req, res, next) => {
  console.log('Hello  test Demo');
  req.log.info('some info from testDemo');
  //res.json([{ hello: 'testDemo' }]);
  db.students.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  })
  //res.json([john,jane]);
  next();
};
module.exports.greet = function (){
  console.log('from Controller');
  console.log('Hello Bharath!');

}
//logGreeting();
// Demonstrating function constructors
function Person(firstname,lastname){
  this.firstname = firstname;
  this.lastname = lastname;
}
Person.prototype.greet = function(){
  util.log('Hello %s,%s', this.firstname,this.lastname)

}
var john = new Person('John','Doe');
var jane = new Person('Jane','Doe');

exports.john = john ;
exports.jane = jane;

//localhost - mongodbd
//var dev_db_url = 'mongodb://bkvittal:kaplan123@localhost:27017/mycustomers';
//qa - mongodbd
/*
var dev_db_url = 'mongodb+srv://svc_apollo_app:X3gYwMvkSh@apollo-qa-saf2u.mongodb.net/ApolloAdmin?readPreference=primary&ssl=true&authSource=admin';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/