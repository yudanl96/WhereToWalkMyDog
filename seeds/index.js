const mongoose = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user');
const cities = require('./cities');
const {adj, placeType} = require('./titles');
const usersSeed = require('./users');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/walkMyDog');
  }
  
main()
.then(()=>console.log('Connected to monogo'))
.catch(err => console.log(err));

const sample = (inputs) => inputs[Math.floor(Math.random() * inputs.length)];

const userIds=[]
const seedDB = async()=>{
    await Place.deleteMany();
    await User.deleteMany();
    for (let index = 0; index < usersSeed.length; index++) {
        const userInfo = new User({
            email: usersSeed[index].email,
            username: usersSeed[index].username
        });
        const user = await User.register(userInfo, usersSeed[index].password);
        userIds.push(user._id);
    }
    for (let index = 0; index < 50; index++) {
        const rand = Math.floor(Math.random()*1000)
        const place = new Place({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            name: `${sample(adj)} ${sample(placeType)}`,
            leash: sample([true, false]),
            img: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam cupiditate voluptatem itaque qui eaque sed error, commodi eveniet? Aperiam natus nam impedit, ducimus eveniet consectetur sequi doloribus officiis sapiente amet?",
            userId: sample(userIds)
        });
        const placeSaved = await place.save();
        const userUpdated = await User.findByIdAndUpdate(placeSaved.userId,{$push: {places:placeSaved._id}});
    }
}

seedDB();
