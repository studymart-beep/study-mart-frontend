import React from 'react';
import { Link } from 'react-router-dom';

export default function Guest() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Study Mart" style={styles.logoImage} />
        </div>
        <h1 style={styles.heroTitle}>Study Mart</h1>
        <p style={styles.heroTagline}>Learn. Buy. Grow.</p>
        <p style={styles.heroSubtitle}>Your Ultimate Learning Marketplace</p>
        <div style={styles.buttonGroup}>
          <Link to="/login">
            <button style={styles.primaryButton}>Get Started</button>
          </Link>
          <Link to="/register">
            <button style={styles.secondaryButton}>Create Account</button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Study Mart</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📚</div>
            <h3 style={styles.featureTitle}>Learn Anything</h3>
            <p style={styles.featureDesc}>Access thousands of courses from expert instructors worldwide</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🚀</div>
            <h3 style={styles.featureTitle}>Learn at Your Pace</h3>
            <p style={styles.featureDesc}>Self-paced learning with lifetime access to all materials</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌍</div>
            <h3 style={styles.featureTitle}>Join Community</h3>
            <p style={styles.featureDesc}>Connect with learners from around the world</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>Earn as You Learn</h3>
            <p style={styles.featureDesc}>Become a seller and earn from your knowledge</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3 style={styles.featureTitle}>Learn Anywhere</h3>
            <p style={styles.featureDesc}>Access courses on desktop, tablet, or mobile</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureDesc}>Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>10K+</h3>
            <p style={styles.statLabel}>Active Students</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>500+</h3>
            <p style={styles.statLabel}>Expert Instructors</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>2K+</h3>
            <p style={styles.statLabel}>Video Courses</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>50K+</h3>
            <p style={styles.statLabel}>Lessons Completed</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Create Account</h3>
            <p style={styles.stepDesc}>Sign up for free and join our learning community</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Choose Courses</h3>
            <p style={styles.stepDesc}>Browse and enroll in courses that interest you</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Start Learning</h3>
            <p style={styles.stepDesc}>Learn at your own pace with video lessons</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>4</div>
            <h3 style={styles.stepTitle}>Earn & Grow</h3>
            <p style={styles.stepDesc}>Get certificates and become a seller</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Learning Journey?</h2>
        <p style={styles.ctaSubtitle}>Join thousands of students already learning on Study Mart</p>
        <Link to="/register">
          <button style={styles.ctaButton}>Create Free Account</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  heroSection: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logoImage: {
    width: '80px',
    height: '80px',
    borderRadius: '15px',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '10px',
  },
  heroTagline: {
    fontSize: '20px',
    opacity: 0.9,
    marginBottom: '10px',
    letterSpacing: '2px',
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: 0.85,
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 30px',
    backgroundColor: '#ffffff',
    color: '#667eea',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  secondaryButton: {
    padding: '12px 30px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  featuresSection: {
    padding: '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    transition: 'transform 0.2s ease',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  statsSection: {
    backgroundColor: '#f1f5f9',
    padding: '60px 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  statCard: {
    padding: '20px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#6366f1',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  howItWorksSection: {
    padding: '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '30px',
  },
  stepCard: {
    textAlign: 'center',
    padding: '20px',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '14px',
    color: '#64748b',
  },
  ctaSection: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '15px',
  },
  ctaSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '30px',
  },
  ctaButton: {
    padding: '14px 35px',
    backgroundColor: '#ffffff',
    color: '#667eea',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};