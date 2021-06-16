/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: 'book title'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Post should return the title of the book if provided');
            assert.property(res.body, '_id', 'The id assigned to the book should be returned')
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            //assert.equal(res.status, 400);
            assert.equal(res.body, 'missing required field title', 'A string should be returned if no title is given');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'An array of books should be returned');
            assert.property(res.body[0], '_id', 'A book should have an id');
            assert.property(res.body[0], 'title', 'A book should have a title');
            assert.property(res.body[0], 'commentcount', 'A book should have a comment count');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/60c9176fa994166548b9b159')
          .end(function (err, res) {
            assert.equal(res.status, 404);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: 'fetch book title'
          })
          .end(function (err, res) {
            const bookid = res.body._id;
            chai.request(server)
              .get('/api/books/' + bookid)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body._id, bookid);
                assert.property(res.body, 'title');
                assert.property(res.body, 'commentcount');
              });
            done();
          });

      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: 'update comment book title'
          })
          .end(function (err, res) {
            const bookid = res.body._id;
            chai.request(server)
              .post('/api/books/' + bookid)
              .type('form')
              .send({
                comment: 'test comment'
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body._id, bookid);
                assert.property(res.body, 'title');
                assert.property(res.body, 'commentcount');
                assert.isArray(res.body.comments);
              });
            done()
          });

      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: 'no comment update book title'
          })
          .end(function (err, res) {
            const bookid = res.body._id;
            chai.request(server)
              .post('/api/books/' + bookid)
              .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.equal(res.body, 'missing required field comment');
              });
            done();
          });

      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/60c9176fa994166548b9b159')
          .type('form')
          .send({
            comment: 'test comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 404);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: 'delete book title'
          })
          .end(function (err, res) {
            const bookid = res.body._id;
            chai.request(server)
              .delete('/api/books' + bookid)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'delete successful');
              });
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/60c9176fa994166548b9b159')
          .end(function (err, res) {
            assert.equal(res.status, 404);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

  });

});
