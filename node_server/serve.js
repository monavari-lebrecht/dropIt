var config             = require('config');
var express            = require("express");
var cookieParser       = require('cookie-parser');
var bodyParser         = require('body-parser');
var multer             = require('multer');
var app                = express();
var fs                 = require('fs');
var _                  = require('lodash');
var uuid               = require('node-uuid');
var database           = new (require('tingodb')()).Db(config.get('database.path'), {});
var dropZoneCollection = database.collection("dropZones");
var userCollection     = database.collection("users");
var mkdirp             = require('mkdirp');
var jwt                = require('jsonwebtoken');

app.use(express.static('app'));
app.use(config.get('uploads.path'), express.static('uploads'));

// enable cookies
app.use(cookieParser());

// handle post data parsing
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// middleware for authentication
app.use(function (req, res, next) {

  // only proceed with authentication check, if a new drop zone shall be created
  if (req.url !== '/api/dropZone/create') {
    next();
  } else {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, config.get('auth.secret'), function (err, decoded) {
        if (err) {
          res.status(401);
          return res.json({success: false, message: 'Failed to authenticate token.'});
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  }
});

app.get('/api/dropZone/create', function (req, res) {
  res.contentType('application/json');
  const key = uuid.v1();

  dropZoneCollection.insert({
    key      : key,
    fileCount: 0,
    files    : []
  });
  // send it also in json response
  res.send(JSON.stringify({
    key: key
  }));
});

app.get('/api/dropZone/:dropZoneId/listFiles', function (req, res) {
  if (!!!req.dropZone) {
    res.status(404);
    res.end();
  } else {
    res.status(200);
    res.end('[]');
  }
});

/**
 * saves drop zone in request
 * @param dropZone
 */
function saveDropZone(dropZone) {
  dropZoneCollection.update({key: dropZone.key},
    {
      $set: dropZone
    });
}

app.post('/api/dropZone/:dropZoneId/upload', function (req, res, next) {
  var filename;
  var fileOriginalName;
  const dirPath = config.get('uploads.path') + req.dropZone.key + '/';
  var upload    = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        mkdirp(dirPath, function () {
          callback(null, dirPath);
        });
      },
      filename   : function (req, file, callback) {
        fileOriginalName = file.originalname;
        const fileName   = Date.now() + '-' + fileOriginalName;
        filename         = fileName;
        callback(null, filename);
      }
    })
  }).single('file');

  // store file from request
  upload(req, res, function (err) {
    if (err) {
      res.status(500);
      return res.end("Error uploading file.");
    }

    // generate thumbnail
    var easyimg   = require('easyimage');
    var thumbnail = dirPath + 'thumbnail-' + filename;
    easyimg.thumbnail({
      src  : dirPath + filename,
      dst  : thumbnail,
      width: 250
    });

    easyimg.info(dirPath + filename).then(function (info) {
      // fetch some more information about the file and save then to database
      _.merge(info, {
        thumbnail: thumbnail
      });
      req.dropZone.fileCount++;
      req.dropZone.files.push(info);
      saveDropZone(req.dropZone);

      // send correct status and json response
      res.status(201);
      res.end(JSON.stringify({
        'status'  : 'OK',
        'filename': filename
      }));
    });
  });
});

app.get('/api/dropZone/:dropZoneId', function (req, res, next) {
  if (!!!req.dropZone) {
    res.status(404);
    res.end();
  } else {
    res.status(200);
    res.end(JSON.stringify(req.dropZone));
  }
});

app.get('/api/dropZone/:dropZoneId/exists', function (req, res, next) {
  if(req.dropZone)
    res.status(200);
  else
    res.status(404);
  res.end();
});

app.param('dropZoneId', function (req, res, next, id) {
  dropZoneCollection.findOne({key: id}, function (error, dropZone) {
    req.dropZone = dropZone;
    next();
  });
});

app.post('/api/user/login', function (req, res, next) {
  // try to authenticate the user by searching in database for the user
  userCollection.findOne({
    username: req.body.username
  }, function (error, user) {
    if (user && !error && user.password === req.body.password) {
      res.status(200);
      var token = jwt.sign(user, config.get('auth.secret'), {
        expiresIn: '1d'
      });
      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Successful login',
        token  : token
      });
      res.end();
    } else {
      res.status(401);
      res.json({
        success: false
      });
      res.end();
    }
  });
});

app.listen(3000, function () {
  console.log("Working on port 3000");
});
