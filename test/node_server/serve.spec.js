var frisby   = require('frisby');
var FormData = require('form-data');
var fs       = require('fs');
var path     = require('path');
var jasmine  = require('jasmine-core');


////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////
/**
 * uploads a file to given drop zone and executes after callback
 * @param key
 * @param after
 */
function uploadFileToDropZone(key, after) {
  var contentPath = path.resolve(__dirname, '../resources/500.png');

  var form = new FormData();
  form.append('file', fs.createReadStream(contentPath), {
    knownLength: fs.statSync(contentPath).size
  });

  frisby.create('api/dropZone/id/upload should upload a file')
    .post('http://localhost:3000/api/dropZone/' + key + '/upload', form, {
      'headers': {
        'content-type'  : 'multipart/form-data; boundary=' + form.getBoundary(),
        'content-length': form.getLengthSync()
      }
    })
    .expectStatus(201)
    .after(function () {
      after.apply(this, arguments);
    })
    .toss();
}

/////////////////////////////////////////////
// TESTS
/////////////////////////////////////////////

frisby.create('api/create should create a new dropZone and return a valid dropZone id. ' +
    'The key should be set as cookie and returned within a json object')
  .get('http://localhost:3000/api/dropZone/create')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    key: String
  })
  .after(function (error, response, body) {
    var json = JSON.parse(body);
    expect(json.key).not.toBeUndefined();
  })
  .toss();

frisby.create('api/dropZone/id/listFiles for a newly created dropZone should be valid and return an empty array')
  .get('http://localhost:3000/api/dropZone/create')
  .after(function (error, response, body) {
    var key = JSON.parse(body).key;
    frisby.create('api/dropZone/id/listFiles for a newly created dropZone should be valid and return an empty array')
      .get('http://localhost:3000/api/dropZone/' + key + '/listFiles')
      .expectStatus(200)
      .toss();
  })
  .toss();

frisby.create('A dropZone listing with an invalid key parameter should fail')
  .get('http://localhost:3000/api/dropZone/some-invalid-id/listFiles')
  .expectStatus(404)
  .toss();

frisby.create('/api/dropZone/some-valid-id should return some infos about the dropZone')
  .get('http://localhost:3000/api/dropZone/create')
  .after(function (error, response, body) {
    var key = JSON.parse(body).key;
    uploadFileToDropZone(key, function () {
      frisby.create('/api/dropZone/some-valid-id should return some infos about the dropZone')
        .get('http://localhost:3000/api/dropZone/' + key)
        .expectStatus(200)
        .expectJSONTypes({
          'fileCount': Number,
          'files'    : Array
        })
        .expectJSONTypes('files.0', {
          'name'     : String,
          'path'     : String,
          'thumbnail': String
        })
        .expectJSON({
          'fileCount': 1
        })
        .toss();
    });
  })
  .toss();

frisby.create('api/dropZone/id/upload should upload a file')
  .get('http://localhost:3000/api/dropZone/create')
  .after(function (error, response, body) {
    var key = JSON.parse(body).key;

    uploadFileToDropZone(key, function (error, response, body) {
      var exists = fs.existsSync('./uploads/' + key + '/' + JSON.parse(body).filename);
      expect(exists).toBeTruthy();
    });
  })
  .toss();
