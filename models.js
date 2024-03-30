const mongoose = require("mongoose")

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
}));

const Exercises = mongoose.model('Exercises', new mongoose.Schema({
    username: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, required: true },
}));


const Log = mongoose.model('Log', new mongoose.Schema({
    username: { type: String, required: true },
    count: { type: Number, required: true },
    log: [
        {
            description: { type: String, required: true },
            duration: { type: Number, required: true },
            date: { type: String, required: true },
        }
    ],
}));


module.exports = { User, Exercises, Log };


