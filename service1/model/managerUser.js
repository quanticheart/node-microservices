const mongoose = require("mongoose")
const table_manager = new mongoose.Schema({
    user_id: {type: String},
    user_name: {type: String},
    information: [{}],
    date_login: {type: Date, default: Date.now}
})

module.exports = mongoose.model("manager_user", table_manager)