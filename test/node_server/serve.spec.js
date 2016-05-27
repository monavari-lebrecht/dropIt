var config   = require('config');
var frisby   = require('frisby');
var FormData = require('form-data');
var fs       = require('fs');
var path     = require('path');
var jasmine  = require('jasmine-core');
var jwt      = require('jsonwebtoken');

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
// PREPARE TESTING
/////////////////////////////////////////////

// prepare database
var database       = new (require('tingodb')()).Db(config.get('database.path'), {});
var userCollection = database.collection("users");

// create user and a valid token for authentication
const user = {username: 'username', password: 'mypassword'};
userCollection.insert(user);
var token = jwt.sign(user, config.get('auth.secret'), {
  expiresIn: config.get('auth.tokenExpiresIn')
});

/////////////////////////////////////////////
// TESTS
/////////////////////////////////////////////

frisby.create('api/user/login with valid data should return a valid token')
  .post(
    'http://localhost:3000/api/user/login',
    {'username': user.username, 'password': user.password}
  )
  .expectStatus(200)
  .expectJSON({
    success: true
  })
  .expectJSONTypes({
    token: String
  }).afterJSON(function (response) {
    // store token for later use
    token = response.token;
  })
  .toss();

frisby.create('api/user/login with invalid data fail')
  .post(
    'http://localhost:3000/api/user/login',
    {'username': 'username', 'password': 'wrong-password'}
  )
  .expectStatus(401)
  .expectJSON({
    success: false
  })
  .toss();

frisby.create('api/dropZone/create without a valid token should fail')
  .get('http://localhost:3000/api/dropZone/create')
  .addHeader('x-access-token', 'invalid-token')
  .expectStatus(401)
  .toss();

frisby.create('api/dropZone/create should create a new dropZone and return a valid dropZone id. ' +
    'The key should be set as cookie and returned within a json object')
  .get('http://localhost:3000/api/dropZone/create')
  .expectStatus(200)
  .addHeader('x-access-token', token)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    key: String
  })
  .afterJSON(function (response) {
    expect(response.key).not.toBeUndefined();
  })
  .toss();

frisby.create('api/dropZone/id/listFiles for a newly created dropZone should be valid and return an empty array')
  .get('http://localhost:3000/api/dropZone/create')
  .addHeader('x-access-token', token)
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
  .addHeader('x-access-token', token)
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
  .addHeader('x-access-token', token)
  .after(function (error, response, body) {
    var key = JSON.parse(body).key;

    uploadFileToDropZone(key, function (error, response, body) {
      var exists = fs.existsSync(config.get('uploads.path') + key + '/' + JSON.parse(body).filename);
      expect(exists).toBeTruthy();
    });
  })
  .toss();

frisby.create('api/dropZone/id/exists should return if the key is valid')
  .get('http://localhost:3000/api/dropZone/create')
  .addHeader('x-access-token', token)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    key: String
  })
  .after(function (error, response, body) {
    var jsonResponse = JSON.parse(body);
    frisby.create('api/dropZone/id/exists should succeed if the key is valid')
      .get('http://localhost:3000/api/dropZone/' + jsonResponse.key + '/exists')
      .expectStatus(200)
      .toss();
  })
  .toss();

frisby.create('api/dropZone/id/exists should fail the key is invalid')
  .get('http://localhost:3000/api/dropZone/some-invalid-id/exists')
  .expectStatus(404)
  .toss();
