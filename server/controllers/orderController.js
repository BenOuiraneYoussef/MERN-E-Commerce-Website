const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

const TAX_RATE = 0.1
const FREE_SHIP_THRESHOLD = 100
const SHIPPING_PRICE = 9.99

// @route   POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' })
    }

    const orderItems = []
    for (const item of cart.items) {
      const product = item.product
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` })
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
      })
    }

    const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingPrice = itemsPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_PRICE
    const taxPrice = itemsPrice * TAX_RATE
    const totalPrice = itemsPrice + shippingPrice + taxPrice

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
    }

    await Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0 })

    res.status(201).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt')
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt')
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'delivered' ? { isDelivered: true, deliveredAt: Date.now() } : {}),
      },
      { new: true }
    )
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus }