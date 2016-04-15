var express = require("express");
var multer  = require('multer');
var app     = express();
var upload  = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename   : function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  })
}).single('file');

app.use(express.static('dist'));

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

app.listen(3000, function () {
  console.log("Working on port 3000");
});
