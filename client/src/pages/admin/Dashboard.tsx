import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI, ordersAPI } from '../../services/api'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getMyOrders(),
        ])

        const productsData = productsRes.data as { total: number }
        const ordersData = ordersRes.data as { orders: { totalPrice: number; status: string }[] }

        const orders = ordersData.orders
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
        const pending = orders.filter((o) => o.status === 'pending').length

        setStats({
          totalProducts: productsData.total,
          totalOrders: orders.length,
          totalRevenue: revenue,
          pendingOrders: pending,
        })
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
        Loading dashboard...
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👑 Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome back, Admin!</p>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#3b82f6' },
          { label: 'Total Orders',   value: stats.totalOrders,   icon: '🛒', color: '#10b981' },
          { label: 'Total Revenue',  value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: '#f59e0b' },
          { label: 'Pending Orders', value: stats.pendingOrders, icon: '🕐', color: '#e94560' },
        ].map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20' }}>
              <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
            </div>
            <div>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.linksGrid}>
          <Link to="/admin/products" style={styles.linkCard}>
            <span style={styles.linkIcon}>📦</span>
            <h3 style={styles.linkTitle}>Manage Products</h3>
            <p style={styles.linkDesc}>Add, edit or delete products</p>
          </Link>
          <Link to="/admin/orders" style={styles.linkCard}>
            <span style={styles.linkIcon}>🛒</span>
            <h3 style={styles.linkTitle}>Manage Orders</h3>
            <p style={styles.linkDesc}>View and update order status</p>
          </Link>
          <Link to="/products" style={styles.linkCard}>
            <span style={styles.linkIcon}>🏪</span>
            <h3 style={styles.linkTitle}>View Store</h3>
            <p style={styles.linkDesc}>See the store as a customer</p>
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
    marginBottom: '0.3rem',
  },
  subtitle: {
    color: '#888',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '0.2rem',
  },
  quickLinks: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '1.2rem',
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  linkCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    border: '2px solid transparent',
  },
  linkIcon: {
    fontSize: '2rem',
  },
  linkTitle: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    fontSize: '1rem',
  },
  linkDesc: {
    color: '#888',
    fontSize: '0.85rem',
  },
}

export default Dashboard