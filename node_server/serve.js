var express = require("express");
var multer  = require('multer');
var app     = express();
var upload  = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      var dirpath = './uploads';
      var fs = require('fs');
      fs.mkdir(dirpath, function () {
        callback(null, dirpath);
      });
    },
    filename   : function (req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname);
    }
  })
}).single('file');

app.use(express.static('app'));

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,cache-control');
  next();
});

app.post('/api/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.status(500);
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.get('/api/login', function (req, res) {
  if (!req.query.key) {
    res.status(400);
    return res.end("Missing key parameter");
  }

  var fs  = require('fs');
  var obj = JSON.parse(fs.readFileSync('./node_server/valid_keys.json', 'utf8'));
  var _   = require('lodash');

  var isContained = _.some(obj, ['key', req.query.key]);

  if(!isContained) {
    res.status(401);
    return res.end("Invalid key.");
  }

  return res.end("Logged in");
});

app.listen(3000, function () {
  console.log("Working on port 3000");
});
