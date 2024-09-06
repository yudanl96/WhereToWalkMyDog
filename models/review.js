const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    score: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5]
    },
    comment: {
        type:String,
        required:true
    },
    placeId:{
        type: mongoose.ObjectId,
        required:true,
        ref: 'Place'
    },
    username:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.ObjectId,
        required:true,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", ReviewSchema)
