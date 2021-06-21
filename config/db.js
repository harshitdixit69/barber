const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv').config()

const mongoDB = 'mongodb://localhost:27017/BarberShop';
const publicDir = require('path').join(__dirname, '/public');

app.use(express.static(publicDir));
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
    .connect(process.env.MONGO_PROD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://harshit65:<password>@cluster0.vggap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });