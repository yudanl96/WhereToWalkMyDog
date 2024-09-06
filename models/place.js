const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');
const { forEach } = require('../seeds/cities');

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
    ],
    userId:{
        type: mongoose.ObjectId,
        required:true,
        ref: 'User'
    },
})

PlaceSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await User.findByIdAndUpdate( doc.userId, {$pull: {places: doc._id}})
        await User.updateMany({savedPlaces: {$elemMatch: {$eq: doc._id}}}, {$pull: {savedPlaces: doc._id}})
        for (const review of doc.reviews) {
            const {userId} = await Review.findById(review);
            await User.findByIdAndUpdate(userId, {$pull: {reviews: review}})
        }
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Place", PlaceSchema)
