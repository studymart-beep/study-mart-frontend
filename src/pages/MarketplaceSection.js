import React from 'react';

export default function MarketplaceSection() {
  const products = [
    { id: 1, title: 'JavaScript Textbook', price: 29.99, seller: 'BookStore', condition: 'New' },
    { id: 2, title: 'React Course Bundle', price: 49.99, seller: 'EduSeller', condition: 'Digital' },
    { id: 3, title: 'Laptop for Coding', price: 899.99, seller: 'TechShop', condition: 'Like New' },
    { id: 4, title: 'Programming Stickers', price: 9.99, seller: 'StickerStore', condition: 'New' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Marketplace</h1>
      <p style={styles.subtitle}>Buy and sell educational resources</p>
      
      <div style={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productIcon}>📦</div>
            <h3 style={styles.productTitle}>{product.title}</h3>
            <p style={styles.productSeller}>by {product.seller}</p>
            <p style={styles.productCondition}>{product.condition}</p>
            <div style={styles.productFooter}>
              <span style={styles.productPrice}>${product.price}</span>
              <button style={styles.buyButton}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '30px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    },
  },
  productIcon: {
    fontSize: '48px',
    marginBottom: '15px',
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
    marginBottom: '5px',
  },
  productCondition: {
    fontSize: '13px',
    color: '#10b981',
    fontWeight: '600',
    marginBottom: '15px',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#667eea',
  },
  buyButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
};