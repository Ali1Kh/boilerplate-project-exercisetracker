const express = require('express')
const app = express()
const cors = require('cors')
const connectMongo = require("./connection.js");
const mongoose = require("mongoose")
const models = require("./models.js")

const bodyParser = require("body-parser")
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", async (req, res) => {
  try {
    let user = await models.User.create({ username: req.body.username })
    return res.json(user)
  } catch (error) {
    console.log(error);
  }
})
app.get("/api/users", async (req, res) => {
  try {
    let users = await models.User.find()
    return res.json(users)
  } catch (error) {
    console.log(error);
  }
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    let { description,
      duration,
      date, } = req.body;

    if (!date) {
      date = new Date();
    }
    let user = await models.User.findById(req.params._id)
    let exercises = await models.Exercises.create({
      userId: user._id,
      username: user.username,
      description,
      duration,
      date,
    })
    exercises.date = new Date(exercises.date).toDateString()
    return res.json({
      "_id": user._id,
      "username": user.username,
      "date": exercises.date,
      "duration": exercises.duration,
      "description": exercises.description
    })
  } catch (error) {
    console.log(error);
  }
})

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    let { from, to, limit } = req.query;
    let filter = {};
    if (from) {
      filter.date = { $gte: new Date(from) }
    }
    if (to) {
      filter.date = { $lte: new Date(to) }
    }
    let isUser = await models.User.findById(req.params._id);
    if (!isUser) {
      return res.json({ error: "User not found" })
    }
    let exercises = await models.Exercises.find({
      userId: isUser._id,
      ...filter
    }).limit(limit)
    exercises.map((exercise) => exercise.date = new Date(exercise.date).toDateString())
    return res.json({
      "_id": isUser._id,
      "username": isUser.username,
      "count": exercises.length,
      "log": exercises
    })
  } catch (error) {
    console.log(error);
  }
})


async function connect() {
  await connectMongo();
  app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

connect();