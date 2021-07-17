var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));

// Root level logger function
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Route to root, respond with index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Route to /json, respond with json
app.get("/json", (req, res) => {
  console.log(process.env.MESSAGE_STYLE);
  if (process.env.MESSAGE_STYLE === "uppercase") {
    return res.json({ message: "HELLO JSON" });
  }
  res.json({ message: "Hello json" });
});

// Mount the middelware to add date time
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

// Echo word with route parameter
app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

// Respond with first and last name
app
  .route("/name")
  .get((req, res) => {
    res.json({ name: `${req.query.first} ${req.query.last}` });
  })
  .post((req, res) => {
    res.json({ name: `${req.body.first} ${req.body.last}` });
  });

module.exports = app;
