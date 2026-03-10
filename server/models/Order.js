const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name:     { type: String, required: true },
        image:    { type: String },
        price:    { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      zip:     { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod:  { type: String, required: true, enum: ['card', 'paypal', 'cod'], default: 'card' },
    itemsPrice:     { type: Number, required: true, default: 0 },
    shippingPrice:  { type: Number, required: true, default: 0 },
    taxPrice:       { type: Number, required: true, default: 0 },
    totalPrice:     { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid:      { type: Boolean, default: false },
    paidAt:      Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)