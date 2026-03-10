const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/cart',     require('./routes/cartRoutes'))
app.use('/api/orders',   require('./routes/orderRoutes'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running 🚀' })
})

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))