var express = require("express");
const bodyParser = require("body-parser");
var uniqid = require('uniqid');
var app = express();

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

Object.prototype.isEmpty = function() {
  for(var key in this) {
    if(this.hasOwnProperty(key))
      return false;
  }
  return true;
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/todolist", (req, res, next) => {

  var fs = require('fs');

  fs.readFile('db.json', urlencodedParser, function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
      obj = JSON.parse(data);
      res.json(obj['todos']);
    }});

});

app.post("/todolist", urlencodedParser, (req, res, next) => {
  if(req.body.isEmpty) return res.sendStatus(400);

  var fs = require('fs');

  fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
      obj = JSON.parse(data);

      // add id to the object
      req.body['id'] = uniqid();

      obj.todos.push(req.body);

      json = JSON.stringify(obj);
      fs.writeFile('db.json', json, 'utf8', function writeFileCallback(err, data){

      });
    }});

  res.json({'success': 'ok'});
});

app.delete("/todolist/:id", urlencodedParser, (req, res, next) => {
  const todoId = req.params.id;
  var result = false;

  var fs = require('fs');

  fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
      obj = JSON.parse(data);

      for( var i = 0; i < obj['todos'].length; i++){
        var todo = obj['todos'][i];
        if ( todo['id'] === todoId) {
          obj['todos'].splice(i, 1);
          result = true;
        }
      }

      json = JSON.stringify(obj);
      fs.writeFile('db.json', json, 'utf8', function writeFileCallback(err, data){
        res.json({'success': result});
      });
    }
  });

});

app.put("/todolist/:id", urlencodedParser, (req, res, next) => {
  const todoId = req.params.id;
  var fs = require('fs');
  fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
      obj = JSON.parse(data);

      for( var i = 0; i < obj['todos'].length; i++){
        var todo = obj['todos'][i];
        if ( todo['id'] === todoId) {

          const keys = Object.keys(req.body);

          keys.forEach(key =>{
            obj['todos'][i][key] = req.body[key];
          });

        }
      }
      json = JSON.stringify(obj);
      fs.writeFile('db.json', json, 'utf8', function writeFileCallback(err, data){
        res.json({'update_succesfull': true});
      });
    }
  });

});

