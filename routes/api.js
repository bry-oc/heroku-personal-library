/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const multer = require('multer');

module.exports = function (app) {
  const upload = multer();

  const bookSchema = new mongoose.Schema({
    title: String,
    comments: [String],
    commentcount: {type: Number, default: 0}
  });

  const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(upload.none(), function (req, res){
      let title = req.body.title;
      if(!title){
        return res.json('missing required field title');
      } else {
        const newBook = new Book({title: title});
        newBook.save(function (err, book) {
          if(err){
            return console.error(err);
          } else {
            return res.json({_id: book._id, title: book.title});
          }
        })
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
