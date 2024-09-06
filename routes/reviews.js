const express = require('express')
const router = express.Router();
const Review = require('../models/review');
const Place = require('../models/place');
const User = require('../models/user');

const tryCatchAsync = require('../utils/AsyncError');
const ExpressError = require('../utils/ExpressError');

const {loggedInRedir} = require('../utils/loginMiddleware')

const {reviewSchema, validateInput} = require("../schemas");

const {isValidObjectId } = require('mongoose');
const checkID = (id) =>{
    if(!isValidObjectId(id)) throw new ExpressError("Invalid ID", 400);
  }

router.post('/',loggedInRedir,validateInput(reviewSchema),tryCatchAsync(async (req,res)=>{
    const review = new Review({...req.body, userId: req.user._id, username: req.user.username});
    await review.save()
    const place = await Place.findByIdAndUpdate(req.body.placeId,{$push: {reviews:review._id}});
    const user = await User.findByIdAndUpdate(req.user._id,{$push: {reviews:review._id}});
    req.flash('success', 'Thanks for adding your experience!');
    res.redirect(`/places/${req.body.placeId}`);
}))

router.delete('/:id',tryCatchAsync(async (req,res)=>{
    const {id} = req.params;
    checkID(id);
    const review = await Review.findByIdAndDelete(id);
    const place = await Place.findByIdAndUpdate(review.placeId,{$pull: {reviews:review._id}});
    const user = await User.findByIdAndUpdate(req.user._id,{$pull: {reviews:review._id}});
    req.flash('success', 'Review deleted!');
    res.redirect(`/places/${review.placeId}`);
  }))

module.exports = router
