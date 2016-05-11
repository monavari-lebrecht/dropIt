var express            = require("express");
var cookieParser       = require('cookie-parser');
var multer             = require('multer');
var app                = express();
var fs                 = require('fs');
var _                  = require('lodash');
var uuid               = require('node-uuid');
var database           = new (require('tingodb')()).Db('node_server/database', {});
var dropZoneCollection = database.collection("dropZones");

var userInfo;

app.use(express.static('app'));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

app.get('/api/dropZone/create', function (req, res) {
  res.contentType('application/json');
  const key = uuid.v1();

  dropZoneCollection.insert({
    key: key
  });
  // send it also in json response
  res.send(JSON.stringify({
    key: key
  }));
});

app.get('/api/dropZone/:dropZoneId/listFiles', function (req, res) {
  if (!!!req.dropZone) {
    res.status(401);
    res.end();
  } else {
    res.status(200);
    res.end('[]');
  }
});

app.param('dropZoneId', function (req, res, next, id) {
  dropZoneCollection.findOne({key: id}, function (error, dropZone) {
    req.dropZone = dropZone;
    next();
  });
});

app.listen(3000, function () {
  console.log("Working on port 3000");
});
