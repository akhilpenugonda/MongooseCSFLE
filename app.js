var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config();
//var BookDataLayer = require('./DAL/BookDAL');
var ALPDatabaseDAL = require('./DAL/ALPDatabaseDAL');
var ALPMeetingDatabaseDAL = require('./DAL/ALPMeetingDatabaseDAL');
var ALPMeetingsDAL = require('./DAL/ALPMeetingsDAL');
var ALPSupervisionClientDAL = require('./DAL/ALPSupervisionClientDAL');

const BookSchema = require('./Book.model');
const logics = require('./logics');
//const Book = new BookDataLayer("books");
const alpDatabase = new ALPDatabaseDAL();
const scheduledMeetings = new ALPMeetingDatabaseDAL();
const masterMeeting = new ALPMeetingsDAL();
const supervision = new ALPSupervisionClientDAL();

const cors = require('cors');

run().catch(err => console.log(err));

async function run() {
    alpDatabase.connect();
}
// const corsOptions = {
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200
//   }
  const corsOptions = {
    origin: 'http://alp-scheduler-ui.s3-website.us-east-2.amazonaws.com/',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res)
{
    res.send('Hello there');
});

app.get('/getall', async function(req, res)
{
    console.log('Getting all data');
    var books = await alpDatabase.find({})
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
app.get('/getallmeets', async function(req, res)
{
    console.log('Getting all meetings data');
    var books = await scheduledMeetings.find({})
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

app.post('/scheduleMeeting', function(req, res){
    scheduledMeetings.create(req.body).then((meet, err) => {
        if(err)
        {
            res.send('error saving the item');
        }
        else
        {
            console.log(meet);
            res.send(meet);
        }
    });
});

app.put('/updateMeeting/:id', function(req, res){
    scheduledMeetings.findOneAndUpdate(
        {
            _id: new ObjectId(req.params.id)
        }, 
        {$set: 
            req.body
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
app.post('/scheduleMeetingOld', function(req, res){
    scheduledMeetings.insertMany(req.body).then((meet, err) => {
        if(err)
        {
            res.send('error saving the item');
        }
        else
        {
            console.log(meet);
            res.send(meet);
        }
    });
});
app.get('/masterMeetings', async function(req, res)
{
    console.log('Getting all meetings data');
    var books = await masterMeeting.find({})
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
app.get('/supervisionClients', async function(req, res)
{
    console.log('Getting all supervision data');
    var books = await supervision.find({})
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
app.get('/getSupervisorBTs/:supEmail', async function(req, res)
{
    console.log('Getting all data');
    var books = await alpDatabase.find({"supervisorEmailAddress": req.params.supEmail})
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

app.get('/getToAlertSupervisors', async function(req, res)
{
    console.log('Getting data');
    var books = await logics.ToAlertSuperVisors()
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

app.get('/item/:id', function(req, res)
{
    console.log('getting one item');
    alpDatabase.findOne({
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

app.post('/post', function(req, res){
    console.log('Creating an item');

    var newBook = BookSchema;
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    newBook.name = req.body.name;

    alpDatabase.insertOne(newBook).then(function(book, err){
        if(err)
        {
            res.send('error saving the item');
        }
        else
        {
            console.log(book);
            res.send(book);
        }
    });
});
app.post('/itemWhole', function(req, res){
    alpDatabase.insertOne(req.body).then((book, err) => {
        if(err)
        {
            res.send('error saving the item');
        }
        else
        {
            console.log(book);
            res.send(book);
        }
    });
});

app.put('/updateItem/:id', function(req, res){
    alpDatabase.findOneAndUpdate(
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

app.delete('/deleteItem/:id', function(req, res){
    alpDatabase.findOneAndDelete({
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