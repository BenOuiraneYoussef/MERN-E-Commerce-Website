const Product = require('../models/Product')

// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query

    const query = {}

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ]
    }

    if (category)  query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    let sortObj = { createdAt: -1 }
    if (sort === 'price_asc')  sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }
    if (sort === 'rating')     sortObj = { rating: -1 }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit))

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct }