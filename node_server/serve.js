var express            = require("express");
var cookieParser       = require('cookie-parser');
var multer             = require('multer');
var app                = express();
var fs                 = require('fs');
var _                  = require('lodash');
var uuid               = require('node-uuid');
var database           = new (require('tingodb')()).Db('node_server/database', {});
var dropZoneCollection = database.collection("dropZones");
var mkdirp             = require('mkdirp');

app.use(express.static('app'));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

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
  const dirPath = './uploads/' + req.dropZone.key + '/';
  var upload = multer({
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

app.listen(3000, function () {
  console.log("Working on port 3000");
});
