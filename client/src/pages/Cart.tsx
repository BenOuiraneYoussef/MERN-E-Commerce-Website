import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

const TAX_RATE = 0.1
const FREE_SHIP_THRESHOLD = 100
const SHIPPING_PRICE = 9.99

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()

  if (cart.items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Your cart is empty 🛒</p>
        <Link to="/products" style={styles.shopBtn}>Browse Products</Link>
      </div>
    )
  }

  const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = itemsPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_PRICE
  const taxPrice = itemsPrice * TAX_RATE
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Your Cart</h1>

      <div style={styles.layout}>
        <div style={styles.itemsSection}>
          {cart.items.map((item) => (
            <div key={item.product._id} style={styles.card}>
              <img
                src={item.product.images[0]?.url}
                alt={item.product.images[0]?.alt}
                style={styles.image}
              />

              <div style={styles.info}>
                <Link to={`/products/${item.product._id}`} style={styles.productName}>
                  {item.product.name}
                </Link>
                <p style={styles.brand}>{item.product.brand}</p>
                <p style={styles.unitPrice}>${item.price.toFixed(2)} each</p>
              </div>

              <div style={styles.right}>
                <div style={styles.qtyRow}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  >−</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >+</button>
                </div>

                <p style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromCart(item.product._id)}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ color: shippingPrice === 0 ? 'green' : '#333' }}>
              {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span>Tax (10%)</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>

          <div style={styles.divider} />

          <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {shippingPrice > 0 && (
            <p style={styles.freeShipNote}>
              Add ${(FREE_SHIP_THRESHOLD - itemsPrice).toFixed(2)} more for free shipping!
            </p>
          )}

          <Link to="/checkout" style={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>

          <Link to="/products" style={styles.continueBtn}>
            ← Continue Shopping
          </Link>
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
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '2rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '2rem',
    alignItems: 'start',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.2rem',
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  image: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  productName: {
    fontWeight: '700',
    color: '#1a1a2e',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  brand: {
    color: '#888',
    fontSize: '0.85rem',
  },
  unitPrice: {
    color: '#555',
    fontSize: '0.9rem',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    flexShrink: 0,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  qty: {
    fontWeight: 'bold',
    fontSize: '1rem',
    minWidth: '1.5rem',
    textAlign: 'center',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#e94560',
    fontSize: '1rem',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textDecoration: 'underline',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'sticky',
    top: '80px',
  },
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: '#555',
  },
  divider: {
    borderTop: '1px solid #eee',
    margin: '0.3rem 0',
  },
  totalRow: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#1a1a2e',
  },
  freeShipNote: {
    backgroundColor: '#fff8e1',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    color: '#b7880a',
    textAlign: 'center',
  },
  checkoutBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '0.9rem',
    backgroundColor: '#e94560',
    color: '#fff',
    borderRadius: '10px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  continueBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '0.7rem',
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderRadius: '10px',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  emptyText: {
    fontSize: '1.5rem',
    color: '#888',
  },
  shopBtn: {
    padding: '0.8rem 2rem',
    backgroundColor: '#e94560',
    color: '#fff',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}

export default CartPage