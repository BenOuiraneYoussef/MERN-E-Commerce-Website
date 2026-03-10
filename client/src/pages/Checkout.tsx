import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ShippingAddress } from '../types'
import { ordersAPI } from '../services/api'
import { useCart } from '../context/useCart'

type PaymentMethod = 'card' | 'paypal' | 'cod'
type Step = 'shipping' | 'payment' | 'confirm'

function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState<Step>('shipping')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shipping, setShipping] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError('')
    try {
      await ordersAPI.placeOrder({
        shippingAddress: shipping,
        paymentMethod,
      })
      await clearCart()
      navigate('/orders')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = itemsPrice >= 100 ? 0 : 9.99
  const taxPrice = itemsPrice * 0.1
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Checkout</h1>

      {/* Steps Indicator */}
      <div style={styles.steps}>
        {(['shipping', 'payment', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} style={styles.stepWrapper}>
            <div style={{
              ...styles.stepCircle,
              backgroundColor: step === s ? '#e94560' : '#1a1a2e',
              color: '#fff',
            }}>
              {i + 1}
            </div>
            <span style={{
              ...styles.stepLabel,
              fontWeight: step === s ? 'bold' : 'normal',
              color: step === s ? '#e94560' : '#888',
            }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div style={styles.layout}>
        <div style={styles.formSection}>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {/* Step 1 — Shipping */}
          {step === 'shipping' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📦 Shipping Address</h2>
              <form onSubmit={handleShippingSubmit} style={styles.form}>
                <div style={styles.field}>
                  <label style={styles.label}>Street Address</label>
                  <input
                    style={styles.input}
                    placeholder="123 Main St"
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>City</label>
                    <input
                      style={styles.input}
                      placeholder="New York"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      required
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>State</label>
                    <input
                      style={styles.input}
                      placeholder="NY"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>ZIP Code</label>
                    <input
                      style={styles.input}
                      placeholder="10001"
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                      required
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Country</label>
                    <input
                      style={styles.input}
                      placeholder="United States"
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" style={styles.nextBtn}>
                  Continue to Payment →
                </button>
              </form>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 'payment' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💳 Payment Method</h2>

              <div style={styles.paymentOptions}>
                {([
                  { value: 'card', label: '💳 Credit / Debit Card' },
                  { value: 'paypal', label: '🅿️ PayPal' },
                  { value: 'cod', label: '💵 Cash on Delivery' },
                ] as { value: PaymentMethod; label: string }[]).map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value)}
                    style={{
                      ...styles.paymentOption,
                      borderColor: paymentMethod === option.value ? '#e94560' : '#ddd',
                      backgroundColor: paymentMethod === option.value ? '#fff5f7' : '#fff',
                    }}
                  >
                    <div style={{
                      ...styles.radio,
                      borderColor: paymentMethod === option.value ? '#e94560' : '#ddd',
                      backgroundColor: paymentMethod === option.value ? '#e94560' : '#fff',
                    }} />
                    <span style={{ fontWeight: '600' }}>{option.label}</span>
                  </div>
                ))}
              </div>

              <div style={styles.btnRow}>
                <button onClick={() => setStep('shipping')} style={styles.backBtn}>
                  ← Back
                </button>
                <button onClick={() => setStep('confirm')} style={styles.nextBtn}>
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 'confirm' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>✅ Review Your Order</h2>

              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>Shipping To</h3>
                <p style={styles.reviewText}>
                  {shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
                </p>
              </div>

              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>Payment Method</h3>
                <p style={styles.reviewText}>
                  {paymentMethod === 'card' && '💳 Credit / Debit Card'}
                  {paymentMethod === 'paypal' && '🅿️ PayPal'}
                  {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                </p>
              </div>

              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>Items</h3>
                {cart.items.map((item) => (
                  <p key={item.product._id} style={styles.reviewText}>
                    {item.product.name} x{item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>

              <div style={styles.btnRow}>
                <button onClick={() => setStep('payment')} style={styles.backBtn}>
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  style={styles.placeOrderBtn}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : '🛒 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          {cart.items.map((item) => (
            <div key={item.product._id} style={styles.summaryItem}>
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.summaryItem}>
            <span>Subtotal</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span>Shipping</span>
            <span style={{ color: shippingPrice === 0 ? 'green' : '#333' }}>
              {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span>Tax (10%)</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>

          <div style={styles.divider} />

          <div style={{ ...styles.summaryItem, fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a2e' }}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '2rem',
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: '0.9rem',
  },
  stepLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#ddd',
    margin: '0 0.5rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '2rem',
    alignItems: 'start',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  error: {
    backgroundColor: '#fce4ec',
    color: '#c62828',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.8rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '10px',
    border: '2px solid #ddd',
    cursor: 'pointer',
  },
  radio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #ddd',
    flexShrink: 0,
  },
  btnRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  nextBtn: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  backBtn: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  placeOrderBtn: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  reviewSection: {
    marginBottom: '1.2rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  reviewLabel: {
    fontSize: '0.85rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.4rem',
  },
  reviewText: {
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '0.3rem',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    position: 'sticky',
    top: '80px',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#555',
  },
  divider: {
    borderTop: '1px solid #eee',
  },
}

export default Checkout