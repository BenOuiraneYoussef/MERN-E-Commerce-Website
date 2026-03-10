import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { productsAPI } from '../services/api'

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ color: '#f4a533', fontSize: '0.9rem' }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span style={{ color: '#888', marginLeft: '0.3rem' }}>{rating}</span>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const salePrice = product.salePrice ?? product.price
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400'
  const imageAlt = product.images?.[0]?.alt || product.name

  return (
    <div style={styles.card}>
      <Link
        to={`/products/${product._id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div style={styles.imageWrapper}>
          <img
            src={imageUrl}
            alt={imageAlt}
            style={styles.image}
          />
          {product.discount > 0 && (
            <span style={styles.badge}>-{product.discount}%</span>
          )}
        </div>

        <div style={styles.cardBody}>
          <p style={styles.category}>{product.category}</p>
          <h3 style={styles.name}>{product.name}</h3>
          <Stars rating={product.rating} />
          <div style={styles.priceRow}>
            {product.discount > 0 ? (
              <>
                <span style={styles.salePrice}>${salePrice.toFixed(2)}</span>
                <span style={styles.originalPrice}>${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span style={styles.salePrice}>${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 1rem 1rem' }}>
        <button style={styles.button}>Add to Cart</button>
      </div>
    </div>
  )
}

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Electronics', 'Sports', 'Beauty', 'Home', 'Clothing', 'Books']

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll()
        const data = res.data as { products: Product[] }
        setProducts(data.products)
      } catch (error) {
        console.error('Failed to fetch products', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    return matchSearch && matchCategory
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
        Loading products...
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.catButton,
                backgroundColor: category === cat ? '#e94560' : '#fff',
                color: category === cat ? '#fff' : '#333',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.count}>{filtered.length} products found</p>

      <div style={styles.grid}>
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>No products found 😕</div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  searchInput: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  catButton: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  count: {
    color: '#888',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  cardBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  category: {
    fontSize: '0.75rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  salePrice: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#e94560',
  },
  originalPrice: {
    fontSize: '0.9rem',
    color: '#aaa',
    textDecoration: 'line-through',
  },
  button: {
    width: '100%',
    padding: '0.65rem',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    color: '#888',
    fontSize: '1.1rem',
  },
}

export default Products