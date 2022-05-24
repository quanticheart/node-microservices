const jwt = require("jsonwebtoken")
const config = require("../config/config")

const auth = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).send({output: 'Access denied'})
    }

    jwt.verify(token, config.jwt_key, (error, result) => {
        if (error) return res.status(401).send({output: 'token error'});

        req.content = {
            id: result.id,
            user: result.user
        }
        next()
    })
}

module.exports = auth