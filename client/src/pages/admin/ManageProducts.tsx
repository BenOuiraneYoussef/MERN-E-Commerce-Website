import { useState, useEffect } from 'react'
import { productsAPI } from '../../services/api'
import type { Product } from '../../types'
import api from '../../services/api'

function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    brand: '',
    stock: '',
    discount: '0',
    imageUrl: '',
    isFeatured: false,
  })

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']

  useEffect(() => {
    fetchProducts()
  }, [])

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

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      discount: product.discount.toString(),
      imageUrl: product.images?.[0]?.url || '',
      isFeatured: product.isFeatured,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter((p) => p._id !== id))
    } catch (error) {
      console.error('Failed to delete product', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      discount: Number(form.discount),
      isFeatured: form.isFeatured,
      images: form.imageUrl ? [{ url: form.imageUrl, alt: form.name }] : [],
    }

    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, productData)
      } else {
        await api.post('/products', productData)
      }
      await fetchProducts()
      setShowForm(false)
      setEditProduct(null)
      setForm({
        name: '', description: '', price: '', category: 'Electronics',
        brand: '', stock: '', discount: '0', imageUrl: '', isFeatured: false,
      })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to save product')
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Manage Products</h1>
        <button
          style={styles.addBtn}
          onClick={() => {
            setEditProduct(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Product Name</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Brand</label>
                <input
                  style={styles.input}
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Brand name"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Price ($)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Stock</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Discount (%)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.input}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Image URL</label>
                <input
                  style={styles.input}
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="featured"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: '600' }}>
                Featured Product
              </label>
            </div>

            <button type="submit" style={styles.submitBtn}>
              {editProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Featured</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={styles.tableRow}>
                <td style={styles.td}>
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    style={styles.tableImage}
                  />
                </td>
                <td style={styles.td}>
                  <p style={{ fontWeight: '600', color: '#1a1a2e' }}>{product.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{product.brand}</p>
                </td>
                <td style={styles.td}>
                  <span style={styles.categoryBadge}>{product.category}</span>
                </td>
                <td style={styles.td}>
                  <p style={{ fontWeight: '600', color: '#e94560' }}>${product.price.toFixed(2)}</p>
                  {product.discount > 0 && (
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>-{product.discount}%</p>
                  )}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.stockBadge,
                    backgroundColor: product.stock > 10 ? '#e8f5e9' : '#fce4ec',
                    color: product.stock > 10 ? '#2e7d32' : '#c62828',
                  }}>
                    {product.stock} left
                  </span>
                </td>
                <td style={styles.td}>
                  {product.isFeatured ? '⭐' : '—'}
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  addBtn: {
    padding: '0.7rem 1.5rem',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.8rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#fce4ec',
    color: '#c62828',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    width: '100%',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  submitBtn: {
    padding: '0.85rem',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
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
  tableImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    padding: '0.2rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  stockBadge: {
    padding: '0.2rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#fce4ec',
    color: '#c62828',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
}

export default ManageProducts