const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { MongoClientEncryption } = require('mongodb-client-encryption');
const BookModel = require('./Book.model');
require('dotenv').config();
const connection = require('./conn');
const conn = require('./conn');
var dbContext = null;
// const arr = [];
//     for (let i = 0; i < 96; ++i) {
//       arr.push(i);
//     }
//     const key = Buffer.from(arr);
//     const keyVaultNamespace = 'client.encryption';
//     const kmsProviders = { local: { key } };
//     const uri = process.env.MONGODB_URI;
//     const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // Configure auto encryption
//     autoEncryption: {
//         keyVaultNamespace, 
//         kmsProviders
//     }
//     });

async function run() {
  try {
    await connection.connectToServer();
    dbContext = connection.getDb();

  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

run().catch(console.error).then((resp) =>
console.log(resp)
);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function(req, res)
{
    res.send('Hello there');
});

app.get('/books', async function (req, res) {
  console.log('Getting all books');
  const books = await dbContext.collection('books').find().toArray();
  res.json(books);
  console.log(books);
});
app.get('/books/:id', async function(req, res)
{
    console.log('getting one book');
    var rr = await dbContext.collection('books').findOne({
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

    var newBook = BookModel.createBook({
        title : req.body.title,
        author : req.body.author,
        category : req.body.category,
        name : req.body.name,
    });
    
    dbContext.collection('books').insertOne(newBook, (err, result) => {
        if (err) {
          console.error('Failed to insert book:', err);
          return;
        }
        console.log('Book inserted');
        res.send(newBook);
      });});
// app.post('/bookWhole', function(req, res){
//     Book.create(req.body, function(err, book){
//         if(err)
//         {
//             res.send('error saving a book');
//         }
//         else
//         {
//             console.log(book);
//             res.send(book);
//         }
//     });
// });

// app.put('/book/:id', function(req, res){
//     Book.findOneAndUpdate(
//         {
//             _id: req.params.id
//         }, 
//         {$set: 
//             {title: req.body.title,
//             name: req.body.name}
//         }, 
//         {upsert: true}, 
//         function(err, newBook){
//             if(err){
//                 console.log('Error Occurred');
//             }
//             else
//             {
//                 console.log(newBook);
//                 res.send(newBook);
//             }
//         });
// });

// app.delete('/book/:id', function(req, res){
//     Book.findOneAndRemove({
//         _id: req.params.id
//     }, function(err, book){
//         if(err)
//         {
//             res.send('error deleting');
//         }
//         else
//         {
//             console.log(book);
//             if(!book)
//             {
//                 console.log('book not found with id');
//                 res.send('book not found with id');
//             }
//             else
//             {
//                 res.sendStatus(204);
//             }
            
//         }
//     })
// })
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