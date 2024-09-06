const express = require('express')
const router = express.Router();
const Place = require('../models/place');

const tryCatchAsync = require('../utils/AsyncError');
const ExpressError = require('../utils/ExpressError');

const {placeSchema, validateInput} = require('../schemas');
const {isValidObjectId } = require('mongoose');

const checkID = (id) =>{
  if(!isValidObjectId(id)) throw new ExpressError("Invalid ID", 400);
}

router.get('/',tryCatchAsync(async (req,res)=>{
  const places = await Place.find();
  res.render('places/index.ejs', {places});
}))

router.get('/new',(req,res)=>{
  res.render('places/new.ejs');
})

router.post('/',validateInput(placeSchema),tryCatchAsync(async (req,res)=>{
  const place = new Place(req.body)
  await place.save()
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
  res.redirect(`/places/${id}`);
}))

router.get('/:id',tryCatchAsync(async (req,res)=>{
  const {id} = req.params;
  checkID(id);
  const place = await Place.findById(id).populate('reviews');
  res.render('places/show.ejs', {place});
}))


router.delete('/:id',tryCatchAsync(async (req,res)=>{
  const {id} = req.params;
  checkID(id);
  const place = await Place.findByIdAndDelete(id);
  res.redirect('/places');
}))

module.exports = router
