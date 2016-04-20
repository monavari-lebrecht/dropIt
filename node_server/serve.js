var express      = require("express");
var cookieParser = require('cookie-parser');
var multer       = require('multer');
var app          = express();

var userInfo;

/**
 * checks whether the key is valid vor authentication
 *
 * @param {string} key The key, that has to be present in valid_keys.json file
 * @returns {boolean} true, if the key is valid... false, if not
 */
function isAuthenticated(key) {
  var fs  = require('fs');
  var obj = JSON.parse(fs.readFileSync('./node_server/valid_keys.json', 'utf8'));
  var _   = require('lodash');

  userInfo = _.find(obj, ['key', key]);

  return userInfo ? true : false;
}

app.use(express.static('app'));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,cache-control');

  if (!isAuthenticated(req.cookies.key) && !isAuthenticated(req.query.key)) {
    res.status(401);
    res.cookie('key', '');
    return res.end("Invalid key.");
  }

  next();
});

/**
 * returns upload folder for current user
 * @returns {string}
 */
function getUploadFolder() {
  return './uploads/' + userInfo['uploadFolder'] + '/';
}

app.post('/api/upload', function (req, res) {
  var upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        var mkdirp  = require('mkdirp');
        var dirpath = getUploadFolder();
        mkdirp(dirpath, function () {
          callback(null, dirpath);
        });
      },
      filename   : function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
      }
    })
  }).single('file');

  upload(req, res, function (err) {
    if (err) {
      res.status(500);
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.get('/api/list', function (req, res) {
  var fs        = require('fs');
  var fileInfos = [];

  var uploadFolder = getUploadFolder();
  fs.readdir(uploadFolder, function (err, files) {
    files.forEach(function (file) {
      var path     = uploadFolder + file;
      var fileInfo = fs.statSync(path);
      fileInfos.push({
        filename: file,
        created : fileInfo['ctime'],
        size    : fileInfo['size'],
        path    : path
      });
    });
    res.end(JSON.stringify(fileInfos));
  });
});

app.get('/api/login', function (req, res) {
  res.cookie('key', req.query.key);
  return res.end("Logged in");
});

app.listen(3000, function () {
  console.log("Working on port 3000");
});
