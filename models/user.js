const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocMon = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    savedPlaces:
    [
        {
            type:Schema.Types.ObjectId,
            ref:'Place'
        }
    ],
    places:[
        {
            type:Schema.Types.ObjectId,
            ref:'Place'
        }
    ],
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

UserSchema.plugin(passportLocMon); 

module.exports = mongoose.model('User', UserSchema);
