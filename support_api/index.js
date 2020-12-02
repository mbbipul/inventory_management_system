const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();

const port = 80;

const Schema = mongoose.Schema;

let salesMemoHistory = new Schema(
  {
    memoIssueDate: {
      type: String
    },
    issuedBy: {
      type: String
    },
    customerName: {
      type: String
    },
    salesIds: {
        type: String
    },
    memoDigitalPrint : {
        type: String
    }
  },
  { collection: "SalesMemoHistory" }
);

const SalesMemoHistoryS1 = mongoose.model("salesMemoHistorys1", salesMemoHistory);
const SalesMemoHistoryS2 = mongoose.model("salesMemoHistorys2", salesMemoHistory);
const SalesMemoHistoryS3 = mongoose.model("salesMemoHistorys3", salesMemoHistory);

var uri = "mongodb://mongo-serv:27017/salesmemohistory";

var whitelist = ['http://40.119.2.157', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});


app.get("/store1/memos",function(req, res) {
   SalesMemoHistoryS1.find({}, (err, memos) => {
        if (err) res.send("something wrong");
        res.send(memos);
    });
    
});
app.get("/store2/memos",function(req, res) {
    SalesMemoHistoryS2.find({}, (err, memos) => {
         if (err) res.send("something wrong");
         res.send(memos);
     });    
});
app.get("/store3/memos",function(req, res) {
    SalesMemoHistoryS3.find({}, (err, memos) => {
         if (err) res.send("something wrong");
         res.send(memos);
     });
});

app.post("/store2/memos/create",function(req, res) {
    let memo = req.body;
    SalesMemoHistoryS2.create(memo, function (err, small) {
        if (err) return res.send('something wrong');
        res.status(201).send(memo);
        // saved!
    });
});
app.post("/store3/memos/create",function(req, res) {
    let memo = req.body;
    SalesMemoHistoryS3.create(memo, function (err, small) {
        if (err) return res.send('something wrong');
        res.status(201).send(memo);
        // saved!
    });
});
app.post("/store1/memos/create",function(req, res) {
    let memo = req.body;
    SalesMemoHistoryS1.create(memo, function (err, small) {
        if (err) return res.send('something wrong');
        res.status(201).send(memo);
        // saved!
    });
});

app.get('/',function(req,res) {
  console.log(req.path);
  res.send('looks good');
});

app.use(cors());
app.use(bodyParser.json());
app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});