const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    category:{ //dog park, human park, open road, busy road
        type: String,
        required: true,
        enum:["dog park", "regular park", "trail", "road"],
    },
    location:{
        type: String
    }
})

module.exports = mongoose.model("Place", PlaceSchema)
