import React from 'react';
import SellerApplicationModal from '../components/SellerApplicationModal';
import SellerDashboard from '../components/SellerDashboard';

export default function MarketplaceSection({ 
  sellerApplicationStatus,
  isSeller,
  products,
  loadingProducts,
  showSellerApplication,
  setShowSellerApplication,
  handleBuyProduct,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  return (
    <div style={styles.fadeIn}>
      <div style={styles.marketplaceHeader}>
        <h2 style={styles.sectionTitle}>🛒 Marketplace</h2>
        {!sellerApplicationStatus && !isSeller && (
          <button 
            style={{
              ...styles.becomeSellerButton,
              ...(hoveredButton === 'become-seller' ? styles.becomeSellerButtonHover : {}),
              ...(pressedButton === 'become-seller' ? styles.becomeSellerButtonPressed : {})
            }}
            onClick={() => setShowSellerApplication(true)}
            onMouseEnter={() => handleButtonMouseEnter('become-seller')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('become-seller')}
            onMouseUp={handleButtonMouseUp}
          >
            Become a Seller
          </button>
        )}
      </div>

      {/* Seller Application Status */}
      {sellerApplicationStatus && sellerApplicationStatus.status === 'pending' && (
        <div style={styles.applicationStatus}>
          <p>Your seller application is under review.</p>
          <p>Status: <strong>Pending</strong></p>
        </div>
      )}

      {sellerApplicationStatus && sellerApplicationStatus.status === 'rejected' && (
        <div style={styles.applicationStatusRejected}>
          <p>Your seller application was rejected.</p>
          <p>Status: <strong>Rejected</strong></p>
        </div>
      )}

      {/* Seller Dashboard for approved sellers */}
      {isSeller && (
        <div style={styles.sellerDashboardContainer}>
          <SellerDashboard />
        </div>
      )}

      {/* Product Grid */}
      <h3 style={styles.subTitle}>Available Products</h3>
      {loadingProducts ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No products available yet.</p>
          {!isSeller && !sellerApplicationStatus && (
            <button 
              style={{
                ...styles.browseButton,
                ...(hoveredButton === 'become-seller-empty' ? styles.browseButtonHover : {}),
                ...(pressedButton === 'become-seller-empty' ? styles.browseButtonPressed : {})
              }}
              onClick={() => setShowSellerApplication(true)}
              onMouseEnter={() => handleButtonMouseEnter('become-seller-empty')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('become-seller-empty')}
              onMouseUp={handleButtonMouseUp}
            >
              Become a Seller
            </button>
          )}
        </div>
      ) : (
        <div style={styles.productGrid}>
          {products.map(product => (
            <div 
              key={product.id} 
              style={styles.productCard}
              onMouseEnter={() => handleButtonMouseEnter(`product-${product.id}`)}
              onMouseLeave={handleButtonMouseLeave}
            >
              {product.images && product.images.length > 0 ? (
                <img 
                  src={`https://study-mart-backend.onrender.com${product.images.find(img => img.is_primary)?.image_url || product.images[0].image_url}`}
                  alt={product.name}
                  style={styles.productImage}
                />
              ) : (
                <div style={styles.productImagePlaceholder}>📦</div>
              )}
              <div style={styles.productContent}>
                <h4 style={styles.productName}>{product.name}</h4>
                <p style={styles.productSeller}>{product.seller?.business_name}</p>
                <p style={styles.productPrice}>₦{product.price}</p>
                <p style={styles.productDescription}>
                  {product.description?.substring(0, 60)}...
                </p>
                <button 
                  style={{
                    ...styles.buyButton,
                    ...(hoveredButton === `buy-${product.id}` ? styles.buyButtonHover : {}),
                    ...(pressedButton === `buy-${product.id}` ? styles.buyButtonPressed : {})
                  }}
                  onClick={() => handleBuyProduct(product)}
                  onMouseEnter={() => handleButtonMouseEnter(`buy-${product.id}`)}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={() => handleButtonMouseDown(`buy-${product.id}`)}
                  onMouseUp={handleButtonMouseUp}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSellerApplication && (
        <SellerApplicationModal 
          onClose={() => setShowSellerApplication(false)} 
        />
      )}
    </div>
  );
}

const styles = {
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #FF6B35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    '@media (max-width: 768px)': {
      fontSize: '24px',
    },
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '30px 0 20px',
    position: 'relative',
    paddingLeft: '15px',
    borderLeft: '4px solid #FF6B35',
    '@media (max-width: 768px)': {
      fontSize: '20px',
    },
  },
  marketplaceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  becomeSellerButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  becomeSellerButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  becomeSellerButtonPressed: {
    transform: 'scale(0.98)',
  },
  applicationStatus: {
    backgroundColor: '#fef3c7',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fcd34d',
  },
  applicationStatusRejected: {
    backgroundColor: '#fee2e2',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f87171',
  },
  sellerDashboardContainer: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '180px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#999',
  },
  productContent: {
    padding: '15px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#333',
  },
  productSeller: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: '8px',
  },
  productDescription: {
    fontSize: '13px',
    color: '#777',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  buyButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buyButtonHover: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    transform: 'scale(1.02)',
  },
  buyButtonPressed: {
    transform: 'scale(0.98)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
  },
  loader: {
    border: '4px solid rgba(37, 99, 235, 0.2)',
    borderTop: '4px solid #FF6B35',
    borderRight: '4px solid #2ECC71',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#1E293B',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  browseButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  browseButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 30px rgba(46,204,113,0.4)',
  },
  browseButtonPressed: {
    transform: 'scale(0.98)',
  },
};