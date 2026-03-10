import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/useCart'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛒 ShopMERN</Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>

        <Link to="/cart" style={styles.link}>
          Cart
          {totalItems > 0 && (
            <span style={styles.badge}>{totalItems}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/orders" style={styles.link}>Orders</Link>
            {user?.role === 'admin' && (
      <Link to="/admin" style={styles.link}>Admin</Link>
    )}
            <span style={styles.userName}>👋 {user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '64px',
    backgroundColor: '#1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#e94560',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-12px',
    backgroundColor: '#e94560',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  userName: {
    color: '#f4a533',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  registerBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
}

export default Navbar