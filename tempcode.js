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
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Configure auto encryption
    autoEncryption: {
      keyVaultNamespace, 
      kmsProviders
    }
  });
}

  /* Step 2: create a key and configure encryption using JSONschema */

  // Currently, mongodb-client-encryption exports a constructor
  // that takes an instance of the mongodb module as a parameter
const { ClientEncryption } = Encrypt;
const encryption = new ClientEncryption(mongoose.connection.client, {
    keyVaultNamespace,
    kmsProviders,
});

const _key = await encryption.createDataKey('local');

// CSFLE is defined through JSON schema. Easiest way to set
// a JSON schema on your collection is via `createCollection()`
await mongoose.connection.dropCollection('tests').catch(() => {});
await mongoose.connection.createCollection('tests', {
validator: {
    $jsonSchema: {
    bsonType: 'object',
    properties: {
        // Automatically encrypt the 'name' property
        name: {
        encrypt: {
            bsonType: 'string',
            keyId: [_key],
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic' }
        }
    }
    }
}
});