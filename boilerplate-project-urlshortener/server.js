require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const URL = require("url").URL;

const stringIsAValidUrl = (s, protocols) => {
  try {
    url = new URL(s);
    return protocols
      ? url.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = mongoose.Schema({
  url: { type: String, required: true },
  short: { type: Number, required: true },
});

const URLs = mongoose.model("URLs", urlSchema);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  console.log(req.body.url);
  if (req.body.url && stringIsAValidUrl(req.body.url, ["http", "https"])) {
    const url = { url: req.body.url };

    URLs.findOne(url)
      .then((data) => {
        if (data) {
          res.json({ original_url: data.url, short_url: data.short });
        } else {
          URLs.estimatedDocumentCount(function (err, count) {
            if (err) {
              throw err;
            }
            const newUrl = new URLs({ ...url, short: count + 1 });
            newUrl
              .save()
              .then((data) => {
                res.json({ original_url: data.url, short_url: data.short });
              })
              .catch((err) => {
                throw err;
              });
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.json({ error: "Something went wrong" });
      });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short", (req, res) => {
  URLs.findOne({ short: req.params.short })
    .then((data) => {
      if (data) {
        res.redirect(data.url);
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({ error: "Something went wrong" });
    });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
