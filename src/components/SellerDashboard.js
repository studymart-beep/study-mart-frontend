import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/seller/my-products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    images.forEach(img => data.append('images', img));

    try {
      const response = await api.post('/seller/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Product added!');
        setShowAddForm(false);
        setFormData({ name: '', description: '', price: '', category: '', stock: '' });
        setImages([]);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await api.delete(`/seller/products/${productId}`);
      if (response.data.success) {
        alert('Product deleted');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Delete failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Your Products</h3>
        <button onClick={() => setShowAddForm(true)} style={styles.addButton}>
          + Add New Product
        </button>
      </div>

      {showAddForm && (
        <div style={styles.formContainer}>
          <h4>Add Product</h4>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={styles.textarea}
                rows="3"
              />
            </div>
            <div style={styles.formGroup}>
              <label>Price (₦)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Stock Quantity</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Product Images (up to 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="button" onClick={() => setShowAddForm(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={styles.submitButton}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.productList}>
        {products.length === 0 ? (
          <p style={styles.emptyMessage}>You haven't added any products yet.</p>
        ) : (
          products.map(product => (
            <div key={product.id} style={styles.productCard}>
              {product.images && product.images.length > 0 && (
                <img
                  src={`https://study-mart-backend.onrender.com${product.images[0].image_url}`}
                  alt={product.name}
                  style={styles.productImage}
                />
              )}
              <div style={styles.productInfo}>
                <h4>{product.name}</h4>
                <p style={styles.productPrice}>₦{product.price}</p>
                <p style={styles.productStock}>Stock: {product.stock_quantity || 0}</p>
                <p style={styles.productStatus}>Status: {product.status}</p>
                <div style={styles.productActions}>
                  <button style={styles.deleteButton} onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  formContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
    resize: 'vertical',
  },
  fileInput: {
    marginTop: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  productInfo: {
    padding: '15px',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#6366f1',
    margin: '10px 0',
  },
  productStock: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  productStatus: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  productActions: {
    display: 'flex',
    gap: '10px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
};