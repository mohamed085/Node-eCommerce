// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
//
// let _db;
// let url = "mongodb://localhost:27017/shop";
//
// const mongoConnect = callback => {
//     MongoClient.connect(url).then(client => {
//         console.log('Connected!');
//         _db = client.db();
//         callback(client);
//     }).catch(err => {
//         console.log(err);
//     });
// }
//
// const getDb = () =>{
//     if (_db){
//         return _db;
//     }
// }
//
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
