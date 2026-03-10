require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life and Hi-Res audio support.',
    price: 299.99,
    category: 'Electronics',
    brand: 'SoundPro',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'Headphones' }],
    stock: 45,
    rating: 4.7,
    numReviews: 128,
    isFeatured: true,
    discount: 10,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with Cherry MX switches and aluminum frame.',
    price: 149.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', alt: 'Keyboard' }],
    stock: 60,
    rating: 4.6,
    numReviews: 177,
    isFeatured: true,
    discount: 0,
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick with alignment lines and carry strap.',
    price: 79.99,
    category: 'Sports',
    brand: 'FlexFit',
    images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', alt: 'Yoga Mat' }],
    stock: 120,
    rating: 4.5,
    numReviews: 203,
    isFeatured: false,
    discount: 0,
  },
  {
    name: 'Vitamin C Serum',
    description: 'Brightening face serum with 20% Vitamin C and hyaluronic acid.',
    price: 44.99,
    category: 'Beauty',
    brand: 'GlowLab',
    images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', alt: 'Serum' }],
    stock: 90,
    rating: 4.9,
    numReviews: 445,
    isFeatured: true,
    discount: 0,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight responsive running shoes with Air cushioning and breathable mesh upper.',
    price: 119.99,
    category: 'Sports',
    brand: 'SpeedStep',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', alt: 'Shoes' }],
    stock: 75,
    rating: 4.4,
    numReviews: 261,
    isFeatured: false,
    discount: 20,
  },
  {
    name: 'Smart Standing Desk',
    description: 'Electric height-adjustable standing desk with memory presets and oak wood finish.',
    price: 649.99,
    category: 'Home',
    brand: 'ErgoSpace',
    images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', alt: 'Desk' }],
    stock: 15,
    rating: 4.6,
    numReviews: 54,
    isFeatured: true,
    discount: 15,
  },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    await Product.deleteMany({})
    await User.deleteMany({})
    console.log('🗑️  Cleared existing data')

    await Product.insertMany(products)

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    })

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    })

    console.log('✅ Data seeded!')
    console.log('👤 Admin: admin@example.com / admin123')
    console.log('👤 User:  john@example.com / password123')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

seedDB()