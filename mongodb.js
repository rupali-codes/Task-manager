const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'mongodb-basic-ops';

// const id = new ObjectID();
// console.log(id, id.getTimestamp());

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log("Unable to connect to databse");
    }

    const db = client.db(databaseName);

    //working with promises

    /*
    //deleting one document
   db.collection('users').deleteMany({
        depart: 'share market'
    }).then(res => console.log(res))
      .catch(err => console.loga(err))

   db.collection('tasks').deleteOne({
      task: "movie"
   }).then(res => console.log(res))
     .catch(err => console.log(err))
    */
    /*    
    //updating one document
    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("61c2f5d0ee7bd4d097514904")
    }, {
        $set: {
            name: 'anu'
        },
        $inc: {
            age: 3
        }
    })

    updatePromise.then((res) => {
        console.log(res);
    }).catch (err => console.log(err))
    */


    //updating multiple document
    /*
    const updatePromises = db.collection('tasks').updateMany({
       task: 'movie'
    }, {
        $set: {
            desc: false
        }
    }, {
       task: 'programming'
    }, {
        $set: {
            desc: false
        }
    })

    updatePromises.then(res => {
        console.log(res);
    }).catch(err => console.log(err))

    */  

    //fetching data | tradional method
    /*
    db.collection('users').findOne({name: 'Rupali'}, (err, user) => {
        if(err){
            return console.log("Unable to fetch");
        }
        console.log(user);
    })
    */

    //for fetching multiple objects
     /*
     db.collection('users').find({name:'satvik', depart:'cs'}).toArray((err, user) => {
        if(err){
            return console.log("Unable to fetch");
        }
        console.log(user);
    })
    */

    
    //insert one is used to insert only one object
    db.collection('users').insertOne({
        name: 'Rups',
        age: 17
    }, (error, result) => {
        if(error){
            return console.log("Unable to insert data");
        }
        console.log(result.ops);
    })
    
    /*
    //insert many is used to insert multiplr objects at the same time
    const userArr = [
    {
        name: 'eugene',
        age: 21,
        depart: 'coding'
    },{
        name: 'satvik',
        age: 22,
        depart: 'cs'
    }
    ]

    db.collection('users').insertMany(userArr, (error, result) => {
        if(error){
            return console.log("Unable to insert data");
        }
        console.log(result);
    })
    */

    
    //challenge__1
    /*
    db.collection('tasks').insertMany([{
        task: 'programming',
        desc: true
    },{
        task: 'SE prepration',
        desc: false  
    },{
        task: 'movie',
        desc: false
    },{
        task: 'programming',
        desc: false
    }
    ], (err, result) => {
        if(err){
            return console.log("Unable to insert data");
        }
        console.log('inserted succesfully checkout your database');
    })
    */

    //challenge__2
    /*
    db.collection('tasks').find({task: 'programming', desc: false}).toArray((err, result) => {
        if(err){
            return console.log("something went wrong");
        }

        console.log(result);
    })
    */
    
})