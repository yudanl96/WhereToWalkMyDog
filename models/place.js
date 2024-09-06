const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');

const PlaceSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    leash:{ //dog park, human park, open road, busy road
        type: Boolean,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    img:{
        type:String
    },
    description:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

PlaceSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Place", PlaceSchema)
