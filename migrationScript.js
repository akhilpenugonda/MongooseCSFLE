const Encrypt = require('mongodb-client-encryption');
const MongoClient = require('mongodb').MongoClient;
// import { MongoClient } from "mongodb";
const databaseConnection = 'mongodb+srv://admin:admin@cluster0.8dymixf.mongodb.net/?retryWrites=true&w=majority';
//'mongodb://localhost:27017';
//'mongodb+srv://admin:admin@cluster0.8dymixf.mongodb.net/?retryWrites=true&w=majority';
run().catch(err => console.log(err));

async function run()
{
    const database = 'test';
    const arr = [];
    for (let i = 0; i < 96; ++i) {
        arr.push(i);
    }
    const key = Buffer.from(arr);
    const keyVaultNamespace = 'client.encryption';
    const kmsProviders = { local: { key } };
    const client = await new MongoClient(
        databaseConnection,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace, 
            kmsProviders
        },
        }
    ).connect();
   
    const db = client.db(database); // Database name -- test
    
    const { ClientEncryption } = Encrypt;
    const encryption = new ClientEncryption(client, {
        keyVaultNamespace,
        kmsProviders,
    });
    const _key = await encryption.createDataKey('local');
    
    db.command({collMod: "books", validator: {
        $jsonSchema: {
            bsonType: 'object',
            properties: {
                title:{
                    bsonType: 'string'
                },
                author: {
                    bsonType: 'string'
                },
                category: {
                    bsonType: 'string'
                },
                // Automatically encrypt the 'name' property
                name: {
                    // bsonType: 'string'
                encrypt: {
                    bsonType: 'string',
                    keyId: [_key],
                    algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic' 
                }
                }
            }
            }
    }
    });
    //updateData(db);
  
}
async function updateData(db)
{
    var resp2 = await db.collection("books").find().forEach(
        async function (elem) {
            await db.collection("books").updateOne(
                {
                    _id: elem._id
                },
                {
                    $set: {
                        name: elem.name
                    }
                }
            );
        }
    );
}
//No need as of now
function customEncryption(databaseConnection, keyVaultNamespace, kmsProviders, _key, name)
{
    var ClientSideFieldLevelEncryptionOptions = {
        keyVaultNamespace,
        kmsProviders,
      }
    encryptedClient = Mongo(
        databaseConnection,
        ClientSideFieldLevelEncryptionOptions
      )
    clientEncryption = encryptedClient.getClientEncryption();
    
    let resp = clientEncryption.encrypt(
    _key,
    name,
    "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    )
}


  
    
    /*
    Did not work
    // var resp = await db.collection("books").updateMany({}, 
    //     {"$set": {"name": { "$concat": ["$category", " "]}}}
    // )
    //var resp = await db.collection("books").find({$where : () => (this.name != "123" && IsTheFieldEncrypted(this.name))}).toArray();
    */
    //No need of drop and create just validator update is fine
    // db.dropCollection('books');
    // db.createCollection('books', {
    //     validator: {
    //         $jsonSchema: {
    //         bsonType: 'object',
    //         properties: {
    //             title:{
    //                 bsonType: 'string'
    //             },
    //             author: {
    //                 bsonType: 'string'
    //             },
    //             category: {
    //                 bsonType: 'string'
    //             },
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
//   const client = await new MongoClient(
//     applicationConfig.database.host,
//     {
//       monitorCommands: true,
//       autoEncryption: {
//         keyVaultNamespace: "encryption.__keyVault",
//         kmsProviders: {
//           azure: {
//             tenantId: applicationConfig.azure.activeDirectory.tenantID,
//             clientId:
//               applicationConfig.azure.activeDirectory
//                 .encryptionClientId,
//             clientSecret:
//               applicationConfig.azure.activeDirectory
//                 .encryptionClientSecret,
//           },
//         },
//         schemaMap,
//         extraOptions: {
//           mongocryptdBypassSpawn: true,
//         },
//       },
//     }
//   ).connect();
