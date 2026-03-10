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

function FeaturedCard({ product }: { product: Product }) {
  const salePrice = product.salePrice ?? product.price
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400'

  return (
    <Link
      to={`/products/${product._id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={styles.featuredCard}>
        <div style={styles.featuredImageWrapper}>
          <img src={imageUrl} alt={product.name} style={styles.featuredImage} />
          {product.discount > 0 && (
            <span style={styles.badge}>-{product.discount}%</span>
          )}
        </div>
        <div style={styles.featuredCardBody}>
          <p style={styles.cardCategory}>{product.category}</p>
          <h3 style={styles.cardName}>{product.name}</h3>
          <Stars rating={product.rating} />
          <div style={styles.priceRow}>
            <span style={styles.salePrice}>${salePrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span style={styles.originalPrice}>${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [latest, setLatest] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll()
        const data = res.data as { products: Product[] }
        const all = data.products
        setFeatured(all.filter((p) => p.isFeatured).slice(0, 4))
        setLatest(all.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch products', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Sports',      icon: '🏃' },
    { name: 'Beauty',      icon: '✨' },
    { name: 'Home',        icon: '🏠' },
    { name: 'Clothing',    icon: '👕' },
    { name: 'Books',       icon: '📚' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero} className="hero-section">
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🛒 Welcome to ShopMERN</p>
          <h1 style={styles.heroTitle} className="hero-title">
            Discover Amazing <span style={{ color: '#e94560' }}>Products</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Shop the latest trends across electronics, fashion, beauty and more.
            Free shipping on orders over $100!
          </p>
          <div style={styles.heroBtns} className="hero-btns">
            <Link to="/products" style={styles.heroBtnPrimary}>Shop Now →</Link>
            <Link to="/register" style={styles.heroBtnSecondary}>Join Free</Link>
          </div>

          <div style={styles.heroStats} className="hero-stats">
            <div style={styles.stat}>
              <p style={styles.statNum}>500+</p>
              <p style={styles.statLabel}>Products</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <p style={styles.statNum}>10k+</p>
              <p style={styles.statLabel}>Customers</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <p style={styles.statNum}>4.9★</p>
              <p style={styles.statLabel}>Rating</p>
            </div>
          </div>
        </div>

        <div style={styles.heroImage}>
          <div style={styles.heroImageInner} className="hero-image-inner">
            🛍️
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={styles.section} className="page-section">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <Link to="/products" style={styles.seeAll}>See All →</Link>
        </div>
        <div style={styles.categoriesGrid} className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              style={styles.categoryCard}
            >
              <span style={styles.categoryIcon}>{cat.icon}</span>
              <span style={styles.categoryName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {!loading && featured.length > 0 && (
        <div style={styles.section} className="page-section">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>⭐ Featured Products</h2>
            <Link to="/products" style={styles.seeAll}>See All →</Link>
          </div>
          <div style={styles.productsGrid} className="products-grid">
            {featured.map((product) => (
              <FeaturedCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Latest Products */}
      {!loading && latest.length > 0 && (
        <div style={styles.section} className="page-section">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🆕 Latest Products</h2>
            <Link to="/products" style={styles.seeAll}>See All →</Link>
          </div>
          <div style={styles.productsGrid} className="products-grid">
            {latest.map((product) => (
              <FeaturedCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Banner */}
      <div style={styles.banner} className="banner-section">
        <div style={styles.bannerContent}>
          <h2 style={styles.bannerTitle} className="banner-title">
            🚚 Free Shipping on Orders Over $100
          </h2>
          <p style={styles.bannerSubtitle}>
            Plus easy returns and 24/7 customer support
          </p>
          <Link to="/products" style={styles.bannerBtn}>Shop Now</Link>
        </div>
      </div>

      {/* Features */}
      <div style={styles.section} className="page-section">
        <div style={styles.featuresGrid} className="features-grid">
          {[
            { icon: '🚚', title: 'Free Shipping',   desc: 'On orders over $100' },
            { icon: '🔒', title: 'Secure Payment',  desc: 'Your data is protected' },
            { icon: '↩️', title: 'Easy Returns',    desc: '30 day return policy' },
            { icon: '💬', title: '24/7 Support',    desc: 'Here to help anytime' },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  hero: {
    backgroundColor: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4rem 6rem',
    minHeight: '500px',
  },
  heroContent: {
    maxWidth: '550px',
  },
  heroTag: {
    color: '#e94560',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    letterSpacing: '0.05em',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: '1.2',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    color: '#aaa',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '2rem',
  },
  heroBtns: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  heroBtnPrimary: {
    padding: '0.85rem 2rem',
    backgroundColor: '#e94560',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  heroBtnSecondary: {
    padding: '0.85rem 2rem',
    backgroundColor: 'transparent',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: '1px solid #fff',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  stat: {
    textAlign: 'center',
  },
  statNum: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#aaa',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#444',
  },
  heroImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageInner: {
    fontSize: '10rem',
    filter: 'drop-shadow(0 0 40px rgba(233,69,96,0.3))',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  seeAll: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '1rem',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 1rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  categoryIcon: {
    fontSize: '2rem',
  },
  categoryName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  featuredImageWrapper: {
    position: 'relative',
  },
  featuredImage: {
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
  featuredCardBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  cardCategory: {
    fontSize: '0.75rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardName: {
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
  banner: {
    backgroundColor: '#e94560',
    padding: '3rem',
    textAlign: 'center',
  },
  bannerContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  bannerTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '1.5rem',
  },
  bannerBtn: {
    display: 'inline-block',
    padding: '0.85rem 2.5rem',
    backgroundColor: '#fff',
    color: '#e94560',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  featureIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.8rem',
  },
  featureTitle: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.3rem',
  },
  featureDesc: {
    color: '#888',
    fontSize: '0.85rem',
  },
}

export default Home