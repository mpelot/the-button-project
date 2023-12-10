const express = require("express");
const app = express();

app.use('/favicon.ico', express.static('favicon.ico'));

var port = 3000;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://mpelot:iEinSMycbWyWtb100@cluster0.mq4ptzi.mongodb.net/?retryWrites=true&w=majority";

var mongoose = require("mongoose");
mongoose.connect(url);

var buttonSchema = new mongoose.Schema({
    name: String,
});

var Button = mongoose.model("Button", buttonSchema);

app.get("", (req, res) => {
    res.sendFile(__dirname + "/button.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.post("/addButton", (req, res) => {
    var myData = new Button(req.body);
    myData
        .save()
        .then((item) => {
            res.send(item);
        })
        .catch((err) => {
            res.status(400).send("Unable to save to database");
        });
});

app.get("/buttonInfo", async (req, res) => {
    try {
      const button = await Button.find();
      res.json(button);
    } catch (err) {
      res.status(100).json({
        message: err.message,
      });
    }
  });

  app.get("/update/:id", getButton, async (req, res) => {
    if (req.query.count != null) {
      res.button.count = req.query.count;
    } else {
      console.log("don't work");
    }
    try {
      const updatedButton = await res.button.save();
      res.json(updatedButton);
    } catch (err) {
      res.status(400).json({
        message: "not getting data",
      });
    }
    message: "Successfully Updated button";
  });
  
async function getButton(req, res, next) {
    console.log(req.body);
    let button;
    try {
        button = await Button.findById(req.params.id);
        console.log(button);
        if (button == null) {
            return res.status(404).json({
                message: "Cannot find button",
            });
        } else {
            message: "found button";
            console.log("success");
        }
    } catch (err) {
        return res.status(500).json({
            message: "Oh No! What happened?",
        });
    }
    res.button = button;
    next();
}

app.get("/delete/:id", getButton, async (req, res) => {
  console.log(req.body);
  try {
      await res.button.remove();
      res.json({
          message: "deleted button",
      });
  } catch (err) {
      res.status(500)({
          message: err.message,
      });
  }
});