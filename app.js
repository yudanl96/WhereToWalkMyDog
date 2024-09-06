const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const placesRoute = require('./routes/places');
const reviewsRoute = require('./routes/reviews');

const ExpressError = require('./utils/ExpressError');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/walkMyDog');
}

main()
.then(()=>console.log('Connected to monogo'))
.catch(err => console.log(err));

app.set('views', path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/places',placesRoute);
app.use('/reviews',reviewsRoute);

app.all('*', (req,res,next)=>{
  next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
  const {statusCode = 500, message = "Woof... uh-oh! Something's wrong... ruff, sorry!"} = err;
  res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    console.log("start listening on port 3000")
})

