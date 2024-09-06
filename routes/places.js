const express = require('express')
const router = express.Router();
const Place = require('../models/place');

const tryCatchAsync = require('../utils/AsyncError');
const ExpressError = require('../utils/ExpressError');

const {placeSchema, validateInput} = require('../schemas');
const {isValidObjectId } = require('mongoose');

const {loggedInRedir} = require('../utils/loginMiddleware')

const checkID = (id) =>{
  if(!isValidObjectId(id)) throw new ExpressError("Invalid ID", 400);
}

router.get('/',tryCatchAsync(async (req,res)=>{
  const places = await Place.find();
  res.render('places/index.ejs', {places});
}))

router.get('/new',loggedInRedir,(req,res)=>{
  res.render('places/new.ejs');
})

router.post('/',validateInput(placeSchema),loggedInRedir,tryCatchAsync(async (req,res)=>{
  const place = new Place({...req.body, userId:req.user._id});
  await place.save();
  req.flash('success', 'Thanks for sharing a new place!');
  res.redirect(`/places/${place._id}`);
}))

router.get('/:id/edit',tryCatchAsync(async (req,res)=>{
  const {id} = req.params;
  checkID(id);
  const place = await Place.findById(id);
  res.render('places/edit.ejs',{place});
}))

router.patch('/:id',validateInput(placeSchema),tryCatchAsync(async (req,res)=>{
  const place = req.body;
  const {id} = req.params;
  checkID(id);
  const placeId = await Place.findByIdAndUpdate(id, place, {runValidators:true, new: true});
  req.flash('success', 'This place has been updated!');
  res.redirect(`/places/${id}`);
}))

router.get('/:id',tryCatchAsync(async (req,res)=>{
  const {id} = req.params;
  checkID(id)
  const place = await Place.findById(id).populate('reviews').populate('userId','username');
  if (!place) {
    req.flash('error', 'Oops! Looks like this page ran off for a walk. 🐾');
    res.redirect('/places')
  }
  res.render('places/show.ejs', {place});
}))


router.delete('/:id',tryCatchAsync(async (req,res)=>{
  const {id} = req.params;
  checkID(id);
  const place = await Place.findByIdAndDelete(id);
  req.flash('success', 'Place deleted!');
  res.redirect('/places');
}))

module.exports = router
