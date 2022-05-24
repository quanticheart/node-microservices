require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const users = require("./model/users")
const create_token = require("./utils/token")
const managerUsers = require("./model/managerUser")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
    res.send({output: req.headers})
});

app.post("/api/user/add", (req, res) => {
    const data = new users(req.body);
    data.save().then((result) => {
        res.status(201).send({output: "New User Add", payload: result})
    }).catch((error) => {
        res.status(204).send({output: "Error to add", payload: error})
    })
});

app.post("/api/user/login", (req, res) => {
    const us = req.body.username
    const ps = req.body.password

    users.findOne({username: us}, (error, result) => {
        if (error) return res.status(500).send({output: "Error, user no find"})
        if (!result) return res.status(404).send({output: "Error, user not found"})

        bcrypt.compare(ps, result.password, (error, data) => {
            if (!data) return res.status(400).send({output: "Password fail"})

            const token = create_token(result._id, result.username)
            const info = new managerUsers({userid: result._id, username: result.username, information: req.headers});

            info.save();

            res.status(200).send({output: "OK", payload: result, token, url: "http://"})
        })
    })
});

app.listen(4000, () => {
    console.log("OK 4000")
})