import { useState, useEffect } from 'react'
import api from '../../services/api'
import type { Order } from '../../types'

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fff8e1', color: '#b7880a' },
  processing: { bg: '#e3f2fd', color: '#1565c0' },
  shipped:    { bg: '#e8f5e9', color: '#2e7d32' },
  delivered:  { bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled:  { bg: '#fce4ec', color: '#c62828' },
}

function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      const data = res.data as { orders: Order[] }
      setOrders(data.orders)
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      setOrders(orders.map((o) =>
        o._id === orderId ? { ...o, status: status as Order['status'] } : o
      ))
    } catch (error) {
      console.error('Failed to update order status', error)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Manage Orders</h1>
      <p style={styles.subtitle}>{orders.length} total orders</p>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = statusColors[order.status]
              const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })

              return (
                <tr key={order._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <p style={{ fontWeight: '600', fontSize: '0.8rem', color: '#1a1a2e' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </td>
                  <td style={styles.td}>
                    <p style={{ fontWeight: '600' }}>
                      {typeof order.user === 'object' && 'name' in order.user
                        ? (order.user as { name: string }).name
                        : 'Customer'}
                    </p>
                  </td>
                  <td style={styles.td}>
                    <p>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                      {order.items.map((i) => i.name).join(', ').slice(0, 30)}...
                    </p>
                  </td>
                  <td style={styles.td}>
                    <p style={{ fontWeight: 'bold', color: '#e94560' }}>
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <p style={{
                      fontSize: '0.8rem',
                      color: order.isPaid ? '#2e7d32' : '#c62828',
                    }}>
                      {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                    </p>
                  </td>
                  <td style={styles.td}>
                    <p style={{ fontSize: '0.85rem' }}>
                      {order.paymentMethod === 'card' && '💳 Card'}
                      {order.paymentMethod === 'paypal' && '🅿️ PayPal'}
                      {order.paymentMethod === 'cod' && '💵 COD'}
                    </p>
                  </td>
                  <td style={styles.td}>
                    <p style={{ fontSize: '0.85rem', color: '#888' }}>{date}</p>
                  </td>
                  <td style={styles.td}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        ...styles.statusSelect,
                        backgroundColor: status.bg,
                        color: status.color,
                      }}
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            No orders yet 📦
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1200px',
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
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#fafafa',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#888',
    borderBottom: '1px solid #f0f0f0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #f9f9f9',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#333',
  },
  statusSelect: {
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none',
  },
}

export default ManageOrders