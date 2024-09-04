const mongoose = require('mongoose');
const Place = require('../models/place');
const cities = require('./cities');
const {adj, placeType} = require('./titles');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/walkMyDog');
  }
  
main()
.then(()=>console.log('Connected to monogo'))
.catch(err => console.log(err));

const sample = (inputs) => inputs[Math.floor(Math.random() * inputs.length)];

const seedDB = async()=>{
    await Place.deleteMany();
    for (let index = 0; index < 50; index++) {
        const rand = Math.floor(Math.random()*1000)
        const place = new Place({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            name: `${sample(adj)} ${sample(placeType)}`,
            leash: sample([true, false])
        });
        await place.save()
    }
}

seedDB();
