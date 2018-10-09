'use strict';
const util = require('util');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const db = mongojs('mycustomers',['students']);
const controller = require('./testDemo.controller');
const errors = require('restify-errors');
var ObjectID = require('mongodb').ObjectID;

function routes(app, rootUrl) {
  // add our version number
  let fullRootUrl = rootUrl + '/v1';
app.get(fullRootUrl + '/testDemo',
  controller.index);  

app.get(fullRootUrl + '/readstudent/:id',(req, res, next) => {
  util.log('reading data for %s',req.params.id);  
  db.students.find({ "_id": ObjectID(req.params.id) },function(err,docs){
    console.log(docs);
    res.json(docs);
  })  
  next();
});  

app.post(fullRootUrl + '/createstudent',(req, res, next) => {
    util.log('request createstudent submited');    
    var student = {
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      email: req.body.email,
      address : {
        street : "1 mains st",
        city : "Chicago",
        state : "IL"
      }
    }
    db.students.insert(student, function(err,result){
      if(err){
        console.log(err);
      }
    })    
    res.json([student]);
    next();
  });

app.post(fullRootUrl + '/addstudent',(req, res, next) => {
    util.log('request addstudent submited');  
    util.log(JSON.stringify(req.body));
    db.students.insert(req.body, function(err,result){
      if(err){
        console.log(err);
      }
    })    
    res.json([req.body]);
    next();
  });

app.put(fullRootUrl + '/update/:id', (req, res, next) => {  
  /* if (!req.is('application/json')) {
    return next(
      new errors.InvalidContentError("Expects 'application/json'"),
    );
  } */
  let data = req.body || {};

  if (!data._id) {
    data = Object.assign({}, data, { _id: req.params.id });
  }    
  db.students.findOne({ first_name: req.params.first_name}, function(err, result) {
    if (err) {
      console.error(err);
      return next(
        new errors.InvalidContentError(err.errors.name.message),
      );
    }   
    console.log(result);
    db.students.update({ "_id": ObjectID(req.params.id) }, { $set: {first_name: "Mickey", last_name: "Canyon" } },{w:1}, function(err,result) {
      if (err) {
        console.error(err);
        return next(
          new errors.InvalidContentError(err.errors.name.message),
        );
      }else{
        console.log('1 document updated');
      }
      next();
    });
  });
  res.send(200, data);
});


app.del(fullRootUrl + '/deletestudent/:id',(req, res, next) => {  
  util.log('request delete submited');
  db.students.remove({ "_id": ObjectID(req.params.id) }, function(err,result){
    if(err){
      console.log(err);
    }else{
      cosole.log('Record has been deleted');
    }
  })    
  res.json([req.body]);
  next();
});


}

module.exports = {
  routes: routes
};
const logGreeting  = require('./testDemo.controller').greet;
function greet(fn){
  console.log('from index.js');
  fn();
}
greet(logGreeting);

const john  = require('./testDemo.controller').john;
john.greet();
const jane  = require('./testDemo.controller').jane;
jane.greet();