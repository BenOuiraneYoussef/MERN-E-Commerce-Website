import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../types'
import { ordersAPI } from '../services/api'

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fff8e1', color: '#b7880a' },
  processing: { bg: '#e3f2fd', color: '#1565c0' },
  shipped:    { bg: '#e8f5e9', color: '#2e7d32' },
  delivered:  { bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled:  { bg: '#fce4ec', color: '#c62828' },
}

const statusIcons: Record<string, string> = {
  pending:    '🕐',
  processing: '⚙️',
  shipped:    '🚚',
  delivered:  '✅',
  cancelled:  '❌',
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getMyOrders()
        const data = res.data as { orders: Order[] }
        setOrders(data.orders)
      } catch (error) {
        console.error('Failed to fetch orders', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
        Loading orders...
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No orders yet 📦</p>
        <Link to="/products" style={styles.shopBtn}>Start Shopping</Link>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Orders</h1>
      <p style={styles.subtitle}>{orders.length} orders found</p>

      <div style={styles.list}>
        {orders.map((order) => {
          const status = statusColors[order.status]
          const icon = statusIcons[order.status]
          const date = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })

          return (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>Order #{order._id}</p>
                  <p style={styles.date}>Placed on {date}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: status.bg,
                  color: status.color,
                }}>
                  {icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div style={styles.items}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                    <div style={styles.itemInfo}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemMeta}>
                        Qty: {item.quantity} · ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <p style={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.footerInfo}>
                  <span style={styles.paymentMethod}>
                    {order.paymentMethod === 'card' && '💳 Card'}
                    {order.paymentMethod === 'paypal' && '🅿️ PayPal'}
                    {order.paymentMethod === 'cod' && '💵 Cash on Delivery'}
                  </span>
                  <span style={{
                    ...styles.paidBadge,
                    backgroundColor: order.isPaid ? '#e8f5e9' : '#fce4ec',
                    color: order.isPaid ? '#2e7d32' : '#c62828',
                  }}>
                    {order.isPaid ? '✓ Paid' : '✗ Not Paid'}
                  </span>
                </div>
                <p style={styles.total}>
                  Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.3rem',
  },
  subtitle: {
    color: '#888',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  orderId: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    fontSize: '1rem',
  },
  date: {
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '0.2rem',
  },
  statusBadge: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  items: {
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    color: '#1a1a2e',
    fontSize: '0.95rem',
  },
  itemMeta: {
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '0.2rem',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#e94560',
    flexShrink: 0,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  footerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  paymentMethod: {
    fontSize: '0.85rem',
    color: '#555',
  },
  paidBadge: {
    padding: '0.2rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  total: {
    fontSize: '1rem',
    color: '#1a1a2e',
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

export default Orders