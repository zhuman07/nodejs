let express = require("express");
let bodyParser = require("body-parser");
let objectId = require("mongodb").ObjectID;
let mongoClient = require("mongodb").MongoClient;
let mongoose = require("mongoose");

let app = express();
let jsonParser = bodyParser.json();
let url = "mongodb://localhost:27017/usersdb";


app.use(express.static(__dirname + "/public"));

// подключение
mongoose.connect(url);

let Schema = mongoose.Schema;
// для работы с promise
mongoose.Promise = global.Promise;

// установка схемы
let userScheme = new Schema({
    name: {
        type: String,
        default: "NoName",
         required: true,
         minlength:3,
         maxlength:20
    },
    age: {
        type: Number,
        default: 18,
         required: true,
         min: 1,
         max:100
    },
    company: {
         name: {
         type: String,
         default: "NoCompany"
         },
         employee: {
         type: [String],
         default: ["Test", "test", "again test"]
         }, // тип - массив строк
         date: {
         type: Date,
         default: 10-03-2017
         }
    }
}, {versionKey: false, collection: 'users'});

let User = mongoose.model("User", userScheme);

app.get("/api/users", function(req, res){
    User.find({}, function (err, users) {
        if(err) console.log(err);
        res.send(users);
        console.log(users);
    });
    /*mongoClient.connect(url, function(err, db){
        let collection = db.collection("users");
        collection.find({}).toArray(function(err, users){
            res.send(users)
            db.close();
        });
    });*/
});

app.get("/api/users/:id", function(req, res){
    let id = new objectId(req.params.id);
    User.findById(id, function(err, user){
        if(err) return res.status(400).send();
        res.send(user);
    });
    /*mongoClient.connect(url, function(err, db){
        let collection = db.collection("users");
        collection.findOne({_id: id}, function(err, user){
            if(err) return res.status(400).send();
            res.send(user);
            db.close();
        });
    });*/
});

app.post("/api/users", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    let userName = req.body.name;
    let userAge = req.body.age;
    let user = {name: userName, age: userAge};
    User.create(user, function(err, result){
        if(err) return res.status(400).send();
        res.send(result);
    });
    /*mongoClient.connect(url, function(err, db){
        let collection = db.collection("users");
        collection.insertOne(user, function(err, result){
            if(err) return res.status(400).send();
            res.send(user);
            db.close();
        });
    });*/
});

app.delete("/api/users/:id", function(req, res){
    let id = new objectId(req.params.id);
    User.findByIdAndRemove(id, function(err, result){
        if(err) return res.status(400).send();
        let user = result.value;
        res.send(result);
    });
    /*mongoClient.connect(url, function(err, db){
        let collection = db.collection("users");
        collection.findOneAndDelete({_id: id}, function(err, result){
            if(err) return res.status(400).send();
            let user = result.value;
            res.send(user);
            db.close();
        });
    });*/
});

app.put("/api/users", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    let id = new objectId(req.body.id);
    let userName = req.body.name;
    let userAge = req.body.age;
    let userData = {name: userName, age: userAge};
    User.findByIdAndUpdate(id, userData, {new: true}, function(err, result){
        if(err) return res.status(400).send();
        res.send(result);
    });
    /*mongoClient.connect(url, function(err, db){
        let collection = db.collection("users");
        collection.findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
            {returnOriginal: false },function(err, result){
                if(err) return res.status(400).send();
                let user = result.value;
                res.send(user);
                db.close();
            });
    });*/
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

/*
let users = [
    {name: "Bob", age: 34},
    {name: "Alice", age: 21},
    {name: "Tom", age: 45}
];
mongoClient.connect(url, function(err, db){
    if(err){
        console.log(err);
    }

    collection.findOneAndUpdate(
        {name: "Bob"},
        {$set: {name: "Alex"}},
        {returnOriginal: false},
        function(err, results){
            if(err){
                console.log(err);
            }
            console.log(results);
            db.close();
    });
});*/
