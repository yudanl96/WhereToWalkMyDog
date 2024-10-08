const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

const placesRoute = require('./routes/places');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/walkMyDog');
}

main()
.then(()=>console.log('Connected to monogo'))
.catch(err => console.log(err));

app.set('views', path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(flash());

const sessionConfig={
  secret: "testingsecret",
  resave: false,
  saveUninitialized:true,
  cookie:{
    httpOnly: true,
    expires:Date.now()+1000*60*60*24,
    maxAge:1000*60*60*24
  }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.curUser = req.user;
  res.locals.success = req.flash('success'); //local: no need to pass it 
  res.locals.error = req.flash('error'); //local: no need to pass it 
  next()
})


app.use('/places',placesRoute);
app.use('/reviews',reviewsRoute);
app.use('/users',usersRoute);

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

