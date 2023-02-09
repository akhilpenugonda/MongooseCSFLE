var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Encrypt = require('mongodb-client-encryption');
// const base64 = require('uuid-base64');
var Book = require('./Book.model');
const { createCollection } = require('./Book.model');

// var db = 'mongodb+srv://admin:admin@cluster0.8dymixf.mongodb.net/?retryWrites=true&w=majority'; //mongosh "mongodb+srv://cluster0.8dymixf.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin
// mongoose.connect(db);
run().catch(err => console.log(err));

async function run() {
    /* Step 1: Connect to MongoDB using autoEncryption */
  
    // Create a very basic key. You're responsible for making
    // your key secure, don't use this in prod :)
    const arr = [];
    for (let i = 0; i < 96; ++i) {
      arr.push(i);
    }
    const key = Buffer.from(arr);
    const keyVaultNamespace = 'client.encryption';
    const kmsProviders = { local: { key } };
    var connection = await mongoose.connect('mongodb+srv://admin:admin@cluster0.8dymixf.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Configure auto encryption
      autoEncryption: {
        keyVaultNamespace, 
        kmsProviders
      }
    });
    
    /* Step 2: create a key and configure encryption using JSONschema */
  
    // Currently, mongodb-client-encryption exports a constructor
    // that takes an instance of the mongodb module as a parameter
  const { ClientEncryption } = Encrypt;
  const encryption = new ClientEncryption(mongoose.connection.client, {
      keyVaultNamespace,
      kmsProviders,
  });

  //This need to go into the shell or some initial script
//  const _key = await encryption.createDataKey('local');
//   await mongoose.connection.dropCollection('books');
//   await mongoose.connection.createCollection('books', {
//     validator: {
//         $jsonSchema: {
//         bsonType: 'object',
//         properties: {
//             // Automatically encrypt the 'name' property
//             name: {
//             encrypt: {
//                 bsonType: 'string',
//                 keyId: [_key],
//                 algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic' }
//             }
//         }
//         }
//     }
//   });
}
  

  
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res)
{
    res.send('Hello there');
});

app.get('/books', function(req, res)
{
    console.log('Getting all books');
    Book.find({})
    .exec(function(err, books){
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
        _id: req.params.id
    })
    .exec(function(err, book){
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

    var newBook = new Book();
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    newBook.name = req.body.name;

    newBook.save(function(err, book){
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
    Book.create(req.body, function(err, book){
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
            _id: req.params.id
        }, 
        {$set: 
            {title: req.body.title}
        }, 
        {upsert: true}, 
        function(err, newBook){
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
    Book.findOneAndRemove({
        _id: req.params.id
    }, function(err, book){
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
                res.sendStatus(204);
            }
            
        }
    })
})
var port = 8080;
app.listen(port, function()
{
    console.log('app listening on port '+ port);
});   


//   // CSFLE is defined through JSON schema. Easiest way to set
//   // a JSON schema on your collection is via `createCollection()`
//   await mongoose.connection.dropCollection('tests').catch(() => {});
//   await mongoose.connection.createCollection('tests', {
//   validator: {
//       $jsonSchema: {
//       bsonType: 'object',
//       properties: {
//           // Automatically encrypt the 'name' property
//           name: {
//           encrypt: {
//               bsonType: 'string',
//               keyId: [_key],
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic' }
//           }
//       }
//       }
//   }
//   });
//   const Model = mongoose.model('Test', mongoose.Schema({ name: String }));
//   await Model.create({ name: 'super secret' });