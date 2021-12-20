const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager-app';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log("Unable to connect to databse");
    }

    const db = client.db(databaseName);
    db.collection('users').insertOne({
        name: 'Rupali',
        age: 17
    })
})