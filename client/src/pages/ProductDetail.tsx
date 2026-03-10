import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import { productsAPI } from '../services/api'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/AuthContext'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getOne(id!)
        const data = res.data as { product: Product }
        setProduct(data.product)
      } catch (error) {
        console.error('Failed to fetch product', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
        Loading product...
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
        <h2>Product not found 😕</h2>
      </div>
    )
  }

  const salePrice = product.salePrice ?? product.price
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600'
  const imageAlt = product.images?.[0]?.alt || product.name

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.imageSection}>
          <img
            src={imageUrl}
            alt={imageAlt}
            style={styles.image}
          />
          {product.discount > 0 && (
            <span style={styles.badge}>-{product.discount}% OFF</span>
          )}
        </div>

        <div style={styles.infoSection}>
          <p style={styles.category}>{product.category} · {product.brand}</p>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={{ color: '#f4a533', fontSize: '1.2rem' }}>
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span style={{ color: '#888', marginLeft: '0.4rem', fontSize: '1rem' }}>
              {product.rating}
            </span>
          </div>

          <p style={{ color: '#888', fontSize: '0.9rem' }}>{product.numReviews} reviews</p>
          <p style={{ color: '#555', lineHeight: '1.7' }}>{product.description}</p>

          <div style={styles.priceRow}>
            <span style={styles.salePrice}>${salePrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span style={styles.originalPrice}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <p style={{ color: product.stock > 0 ? 'green' : 'red', fontWeight: '600' }}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
          </p>

          <div style={styles.quantityRow}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.qtyBtn}
            >−</button>
            <span style={styles.qtyNum}>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              style={styles.qtyBtn}
            >+</button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              ...styles.cartBtn,
              backgroundColor: added ? '#2e7d32' : '#e94560',
              opacity: product.stock === 0 ? 0.5 : 1,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
          </button>

          {!isAuthenticated && (
            <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
              You need to{' '}
              <a href="/login" style={{ color: '#e94560' }}>login</a>
              {' '}to add items to cart
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  imageSection: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
    maxHeight: '420px',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  category: {
    color: '#888',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  salePrice: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#e94560',
  },
  originalPrice: {
    fontSize: '1.2rem',
    color: '#aaa',
    textDecoration: 'line-through',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  qtyNum: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    minWidth: '2rem',
    textAlign: 'center',
  },
  cartBtn: {
    padding: '1rem',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
  },
}

export default ProductDetail