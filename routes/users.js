const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const tryCatchAsync = require('../utils/AsyncError');

const {userSchema, validateInput} = require("../schemas")

const {loggedInRedir} = require('../utils/loginMiddleware')

router.get('/signup',(req,res)=>{
    res.render('user/signup.ejs');
})

router.post('/signup',validateInput(userSchema),tryCatchAsync(async (req,res)=>{
    const userInfo = new User({email:req.body.email, username:req.body.username});
    const user = await User.register(userInfo, req.body.password);
    req.login(user, (err)=>{
        if (err) return next(err);
        req.flash('success', 'Let’s get those tails wagging! 🐕🌳!');
        res.redirect(`/places`);
    });
    
}))

router.get('/login',(req,res)=>{
    res.render('user/login.ejs');
})

router.post('/login',passport.authenticate('local', {failureFlash:true, failureRedirect:'/users/login'}),tryCatchAsync(async (req,res)=>{
    req.flash('success', 'Welcome back! HOORAY!');
    res.redirect(`/places`);
}))

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err) return next(err);
    });
    res.redirect('/places')
})

router.post('/save/:id',loggedInRedir,tryCatchAsync(async (req,res)=>{
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(req.user._id,{$push: {savedPlaces: id}});
    req.flash('success', 'Place saved! Glad you like it!');
    res.redirect(`/places/${id}`);
}))

router.get('/me',loggedInRedir,tryCatchAsync(async (req,res)=>{
    const user = await User.findById(req.user._id)
                    .populate('savedPlaces')
                    .populate('places')
                    //.populate('reviews');
    res.render('user/account.ejs',{user});
}))

module.exports = router
