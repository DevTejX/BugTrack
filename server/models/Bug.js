const mongoose = require("mongoose")

const bugSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    severity: {
        type: String,
        default: "Medium"
    },
    status:{
        type: String,
        default: "Open"
    }
});

module.exports = mongoose.model("Bug", bugSchema);