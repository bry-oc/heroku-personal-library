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
      Book.find({}, function(err, book){
        if(err){
          return console.error(err);
        } else {
          return res.json(book);
        }
      })
    })
    
    .post(upload.none(), function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if(!title){
        //res.status(400);
        return res.json('missing required field title');
      } else {
        const newBook = new Book({title: title});
        newBook.save(function (err, book) {
          if(err){
            return console.error(err);
          } else {
            return res.json({_id: book._id, title: book.title});
          }
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err, deleted){
        if(err){
          return console.error(err);
        } else {
          return res.json('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({_id: bookid}, function(err, book){
        if(err){
          return console.error(err);
        } else if (book) {
          return res.json(book);
        } else {
          //res.status(404);
          return res.json('no book exists');
        }
      })
    })
    
    .post(upload.none(), function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        //res.status(400);
        return res.json('missing required field comment');
      }
      Book.findOneAndUpdate({_id: bookid}, {$inc: {commentcount: 1 }, $push: {comments: comment}}, {new: true} ,function(err, book){
        if(err){
          return console.error(err);
        } else if(book) {
          return res.json(book);
        } else {
          //res.status(404);
          return res.json('no book exists');
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete({_id: bookid}, function(err, deleted){
        if(err){
          return console.error(err);
        } else if(deleted){
          return res.json('delete successful');
        } else {
          //res.status(404);
          return res.json('no book exists');
        }
      })
    });
  
};
