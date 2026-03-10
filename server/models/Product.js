const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'],
    },
    brand:      { type: String, default: '' },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
      },
    ],
    stock:      { type: Number, required: true, default: 0 },
    reviews:    [reviewSchema],
    rating:     { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    discount:   { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
)

productSchema.virtual('salePrice').get(function () {
  return this.price * (1 - this.discount / 100)
})

productSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Product', productSchema)