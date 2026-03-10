const Cart = require('../models/Cart')
const Product = require('../models/Product')

// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock')
    res.json({ success: true, cart: cart || { items: [], totalPrice: 0 } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock' })

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) cart = new Cart({ user: req.user._id, items: [] })

    const existingItem = cart.items.find((item) => item.product.toString() === productId)

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)
    } else {
      cart.items.push({ product: productId, quantity, price: product.price })
    }

    await cart.save()
    await cart.populate('items.product', 'name images price stock')
    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })

    const item = cart.items.find((i) => i.product.toString() === req.params.productId)
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' })

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId)
    } else {
      item.quantity = quantity
    }

    await cart.save()
    await cart.populate('items.product', 'name images price stock')
    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId)
    await cart.save()
    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 })
    res.json({ success: true, message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }