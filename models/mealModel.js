const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A meal must have a name'],
      trim: true,
      unique: true,
    },
    slug: String,
    price: { type: Number, required: [true, 'A meal must have a price'] },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    category: {
      type: String,
      required: [true, 'A meal must have a named category'],
      maxlength: [20, 'category name must be shorther than 20 characters'],
      trim: true,
    },
    ingredients: [String],
    description: {
      type: String,
      trim: true,
      required: [true, 'A meal must have a description'],
      maxlength: [150, 'Description must be shorter than 150 characters'],
      minlength: [20, 'Description must be longer than 20 characters'],
    },
    image: {
      type: String,
      required: [true, 'Meal must have a image '],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretMeal: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

mealSchema.virtual('priceGrosze').get(function () {
  return `${this.price * 100}gr`;
});

//DOCUMENT MIDDLEWARE
mealSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//QUERY MIDDLEWARE
mealSchema.pre(/^find/, function (next) {
  this.find({ secretMeal: { $ne: true } });
  this.start = Date.now();
  next();
});

mealSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}ms!`);
  next();
});

//AGGREGATION MIDDLEWARE
mealSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretMeal: { $ne: true } } });
  next();
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
