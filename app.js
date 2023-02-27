var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config();
var BookDataLayer = require('./DAL/BookDAL');
const BookSchema = require('./Book.model');
const Book = new BookDataLayer("books")

run().catch(err => console.log(err));

async function run() {
    Book.connect();
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res)
{
    res.send('Hello there');
});

app.get('/books', async function(req, res)
{
    console.log('Getting all books');
    var books = await Book.find({})
    .then(function(books, err){
        if(err)
        {
            res.send('error has occurred');
        }
        else
        {
            res.json(books);
            console.log(books);
        }
    });
});

app.get('/books/:id', function(req, res)
{
    console.log('getting one book');
    Book.findOne({
        _id: new ObjectId(req.params.id)
    })
    .then(function(book, err){
        if(err)
        {
            res.send('Error Occurred');
        }
        else
        {
            console.log(book);
            res.json(book);
        }
    });
});

app.post('/book', function(req, res){
    console.log('Creating a book');

    var newBook = BookSchema;
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    newBook.name = req.body.name;

    Book.insertOne(newBook).then(function(book, err){
        if(err)
        {
            res.send('error saving a book');
        }
        else
        {
            console.log(book);
            res.send(book);
        }
    });
});
app.post('/bookWhole', function(req, res){
    Book.insertOne(req.body).then((book, err) => {
        if(err)
        {
            res.send('error saving a book');
        }
        else
        {
            console.log(book);
            res.send(book);
        }
    });
});

app.put('/book/:id', function(req, res){
    Book.findOneAndUpdate(
        {
            _id: new ObjectId(req.params.id)
        }, 
        {$set: 
            {title: req.body.title,
            name: req.body.name}
        }, 
        {upsert: true}).then(
        function(newBook, err){
            if(err){
                console.log('Error Occurred');
            }
            else
            {
                console.log(newBook);
                res.send(newBook);
            }
        });
});

app.delete('/book/:id', function(req, res){
    Book.findOneAndDelete({
        _id: new ObjectId(req.params.id)
    }).then(function(book, err){
        if(err)
        {
            res.send('error deleting');
        }
        else
        {
            console.log(book);
            if(!book)
            {
                console.log('book not found with id');
                res.send('book not found with id');
            }
            else
            {
                res.send(book);
            }
        }
    })
})
var port = 8080;
app.listen(port, function()
{
    console.log('app listening on port '+ port);
});   