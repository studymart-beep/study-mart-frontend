import React from 'react';

export default function MarketplaceSection({
  products = [],
  categories = [],
  sellers = [],
  loading = false,
  error = null,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {

  const safeProducts = products || [];
  const safeCategories = categories || [];
  const safeSellers = sellers || [];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Marketplace</h1>
        <p style={styles.subtitle}>Buy and sell educational resources</p>
      </div>

      {/* Categories */}
      <div style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categoriesGrid}>
          {safeCategories.length > 0 ? (
            safeCategories.map(cat => (
              <div key={cat.id} style={styles.categoryCard}>
                <span style={styles.categoryIcon}>{cat.icon || '📦'}</span>
                <h3 style={styles.categoryName}>{cat.name}</h3>
                <p style={styles.categoryCount}>{cat.count || 0} items</p>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No categories available</div>
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>
          {safeProducts.length > 0 ? (
            safeProducts.map(product => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImage}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} style={styles.productImg} />
                  ) : (
                    <span style={styles.productImagePlaceholder}>📚</span>
                  )}
                </div>
                <div style={styles.productContent}>
                  <h3 style={styles.productTitle}>{product.title}</h3>
                  <p style={styles.productSeller}>by {product.seller || 'Unknown Seller'}</p>
                  <p style={styles.productDescription}>{product.description || 'No description available'}</p>
                  <div style={styles.productFooter}>
                    <span style={styles.productPrice}>${product.price || '0.00'}</span>
                    <button style={styles.buyButton}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No products available</div>
          )}
        </div>
      </div>

      {/* Top Sellers */}
      <div style={styles.sellersSection}>
        <h2 style={styles.sectionTitle}>Top Sellers</h2>
        <div style={styles.sellersGrid}>
          {safeSellers.length > 0 ? (
            safeSellers.map(seller => (
              <div key={seller.id} style={styles.sellerCard}>
                <div style={styles.sellerAvatar}>
                  {seller.avatar_url ? (
                    <img src={seller.avatar_url} alt={seller.name} style={styles.sellerImage} />
                  ) : (
                    <span style={styles.sellerAvatarPlaceholder}>👤</span>
                  )}
                </div>
                <h3 style={styles.sellerName}>{seller.name}</h3>
                <p style={styles.sellerProducts}>{seller.products || 0} products</p>
                <p style={styles.sellerRating}>⭐ {seller.rating || '4.5'}</p>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No sellers available</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  categoriesSection: {
    marginBottom: '40px',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
  },
  categoryIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  categoryCount: {
    fontSize: '14px',
    color: '#64748b',
  },
  productsSection: {
    marginBottom: '40px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
  },
  productImage: {
    height: '180px',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productImagePlaceholder: {
    fontSize: '48px',
  },
  productContent: {
    padding: '20px',
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  productSeller: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '10px',
  },
  productDescription: {
    fontSize: '14px',
    color: '#334155',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#10b981',
  },
  buyButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
  sellersSection: {
    marginBottom: '40px',
  },
  sellersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  sellerCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
  },
  sellerAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    backgroundColor: '#e2e8f0',
    margin: '0 auto 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sellerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  sellerAvatarPlaceholder: {
    fontSize: '40px',
  },
  sellerName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  sellerProducts: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '5px',
  },
  sellerRating: {
    fontSize: '14px',
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontSize: '16px',
  },
};