var frisby = require('frisby');
var assert = require('assert');

frisby.create('api/create should create a new dropzone and return a valid dropzone id. ' +
    'The key should be set as cookie and returned within a json object')
  .get('http://localhost:3000/api/dropzone/create')
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

frisby.create('api/dropzone/listFiles for a newly created dropzone should be valid and return an empty array')
  .get('http://localhost:3000/api/dropzone/create')
  .after(function (error, response, body) {
    var key = JSON.parse(body).key;
    frisby.create('api/dropzone/listFiles for a newly created dropzone should be valid and return an empty array')
      .get('http://localhost:3000/api/dropzone/' + key + '/listFiles')
      .expectStatus(200)
      .toss();
  })
  .toss();

frisby.create('A dropzone list with a invalid key parameter should fail')
  .get('http://localhost:3000/api/dropzone/some-invalid-id/listFiles')
  .expectStatus(401)
  .toss();
