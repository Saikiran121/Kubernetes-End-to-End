// test-replica.js
const { MongoClient } = require('mongodb');

// Use your namespace and service name
const uri = 'mongodb://'
  + 'mongo-0.mongo-svc.data-app.svc.cluster.local:27017,'
  + 'mongo-1.mongo-svc.data-app.svc.cluster.local:27017,'
  + 'mongo-2.mongo-svc.data-app.svc.cluster.local:27017'
  + '/?replicaSet=rs0';

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('✅ Connected to MongoDB replica set');
  const db = client.db('testdb');
  const col = db.collection('testcol');
  const result = await col.insertOne({ msg: 'Hello StatefulSet', time: new Date() });
  console.log('Insert result:', result.insertedId);
  const docs = await col.find().toArray();
  console.log('Current documents:', docs);
  await client.close();
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

