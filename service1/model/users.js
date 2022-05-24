const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const table = new mongoose.Schema({
    username: {type: String, unique: true, require: true},
    password: {type: String},
    createAt: {type: Date, default: Date.now}
})

table.pre("save", function (next) {
    let user = this
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (error, hashPass) => {
        if (error) return "Error create user"
        user.password = hashPass
        return next();
    })
})

module.exports = mongoose.model("user", table)
