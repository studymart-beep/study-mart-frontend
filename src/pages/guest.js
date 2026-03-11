import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Guest() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  const handleButtonMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleButtonMouseLeave = () => {
    setHoveredButton(null);
    setPressedButton(null);
  };

  const handleButtonMouseDown = (buttonName) => {
    setPressedButton(buttonName);
  };

  const handleButtonMouseUp = () => {
    setPressedButton(null);
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>
      <div style={styles.backgroundGrid}></div>

      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <span style={styles.logoText}>Study Mart</span>
          </div>
          <div style={styles.navButtons}>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to <span style={styles.heroHighlight}>Study Mart</span></h1>
          <p style={styles.heroSubtitle}>Your Ultimate Learning Marketplace</p>
          <p style={styles.heroDescription}>
            Discover thousands of courses, connect with expert instructors, 
            and join a community of passionate learners. Start your journey today!
          </p>
          <div style={styles.heroButtons}>
            <Link 
              to="/register"
              style={{
                ...styles.primaryButton,
                ...(hoveredButton === 'get-started' ? styles.primaryButtonHover : {}),
                ...(pressedButton === 'get-started' ? styles.buttonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('get-started')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('get-started')}
              onMouseUp={handleButtonMouseUp}
            >
              Get Started Free
            </Link>
            <Link 
              to="/login"
              style={{
                ...styles.secondaryButton,
                ...(hoveredButton === 'login' ? styles.secondaryButtonHover : {}),
                ...(pressedButton === 'login' ? styles.buttonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('login')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('login')}
              onMouseUp={handleButtonMouseUp}
            >
              Sign In
            </Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.illustration}>
            <div style={styles.illustrationCircle}></div>
            <div style={styles.illustrationCard1}>📚</div>
            <div style={styles.illustrationCard2}>💻</div>
            <div style={styles.illustrationCard3}>🎓</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose <span style={styles.highlight}>Study Mart</span></h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📚</div>
            <h3 style={styles.featureTitle}>Learn Anything</h3>
            <p style={styles.featureDescription}>Access thousands of courses from expert instructors worldwide</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🚀</div>
            <h3 style={styles.featureTitle}>Learn at Your Pace</h3>
            <p style={styles.featureDescription}>Self-paced learning with lifetime access to all materials</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌍</div>
            <h3 style={styles.featureTitle}>Join Community</h3>
            <p style={styles.featureDescription}>Connect with learners from around the world</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>Earn as You Learn</h3>
            <p style={styles.featureDescription}>Become a seller and earn from your knowledge</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3 style={styles.featureTitle}>Learn Anywhere</h3>
            <p style={styles.featureDescription}>Access courses on desktop, tablet, or mobile</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureDescription}>Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
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

      {/* How It Works Section */}
      <div style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It <span style={styles.highlight}>Works</span></h2>
        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Create Account</h3>
            <p style={styles.stepDescription}>Sign up for free and join our learning community</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Choose Courses</h3>
            <p style={styles.stepDescription}>Browse and enroll in courses that interest you</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Start Learning</h3>
            <p style={styles.stepDescription}>Learn at your own pace with video lessons and materials</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>4</div>
            <h3 style={styles.stepTitle}>Earn & Grow</h3>
            <p style={styles.stepDescription}>Get certificates and even become a seller yourself</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What Our <span style={styles.highlight}>Students Say</span></h2>
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"Study Mart transformed my career. The courses are top-notch and the instructors are incredibly knowledgeable."</p>
            <div style={styles.testimonialAuthor}>
              <span style={styles.testimonialName}>- Sarah Johnson</span>
              <span style={styles.testimonialRole}>Web Developer</span>
            </div>
          </div>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"I started as a student and now I'm a seller. The platform made it easy to share my expertise and earn income."</p>
            <div style={styles.testimonialAuthor}>
              <span style={styles.testimonialName}>- Michael Chen</span>
              <span style={styles.testimonialRole}>Course Creator</span>
            </div>
          </div>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>"The community aspect is what sets Study Mart apart. I've connected with so many like-minded learners."</p>
            <div style={styles.testimonialAuthor}>
              <span style={styles.testimonialName}>- Priya Patel</span>
              <span style={styles.testimonialRole}>Data Scientist</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Learning Journey?</h2>
        <p style={styles.ctaDescription}>Join thousands of students already learning on Study Mart</p>
        <Link 
          to="/register"
          style={{
            ...styles.ctaButton,
            ...(hoveredButton === 'cta' ? styles.ctaButtonHover : {}),
            ...(pressedButton === 'cta' ? styles.buttonPressed : {})
          }}
          onMouseEnter={() => handleButtonMouseEnter('cta')}
          onMouseLeave={handleButtonMouseLeave}
          onMouseDown={() => handleButtonMouseDown('cta')}
          onMouseUp={handleButtonMouseUp}
        >
          Create Free Account
        </Link>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>Study Mart</div>
          <div style={styles.footerLinks}>
            <Link to="/about" style={styles.footerLink}>About</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
            <Link to="/terms" style={styles.footerLink}>Terms</Link>
            <Link to="/privacy" style={styles.footerLink}>Privacy</Link>
            <Link to="/faq" style={styles.footerLink}>FAQ</Link>
          </div>
          <p style={styles.copyright}>© 2024 Study Mart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  
  // Animated Background
  backgroundGlow1: {
    position: 'fixed',
    top: '-10%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(46,204,113,0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 20s ease-in-out infinite',
    zIndex: 0,
  },
  backgroundGlow2: {
    position: 'fixed',
    bottom: '-10%',
    right: '-10%',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(37,99,235,0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 15s ease-in-out infinite reverse',
    zIndex: 0,
  },
  backgroundGrid: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    zIndex: 0,
  },

  // Navbar
  navbar: {
    background: 'linear-gradient(90deg, #6366f1 0%, #2563EB 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
    padding: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  navButtons: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.1)',
    },
  },

  // Hero Section
  heroSection: {
    maxWidth: '1200px',
    margin: '60px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
    },
  },
  heroContent: {
    animation: 'fadeIn 1s ease-out',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: '20px',
    lineHeight: '1.2',
    '@media (max-width: 768px)': {
      fontSize: '36px',
    },
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #FF6B35, #6366f1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#4B5563',
    marginBottom: '20px',
    fontWeight: '500',
  },
  heroDescription: {
    fontSize: '18px',
    color: '#64748B',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
  },
  primaryButton: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  primaryButtonHover: {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 12px 30px rgba(99,102,241,0.4)',
  },
  secondaryButton: {
    padding: '14px 32px',
    background: 'transparent',
    color: '#6366f1',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #6366f1',
    transition: 'all 0.2s ease',
  },
  secondaryButtonHover: {
    background: '#6366f1',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
  },
  buttonPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  heroImage: {
    position: 'relative',
    height: '400px',
    animation: 'fadeIn 1s ease-out 0.2s both',
  },
  illustration: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  illustrationCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, #FF6B35, #6366f1)',
    borderRadius: '50%',
    opacity: 0.1,
    animation: 'pulse 3s ease-in-out infinite',
  },
  illustrationCard1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80px',
    height: '80px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    animation: 'float 3s ease-in-out infinite',
  },
  illustrationCard2: {
    position: 'absolute',
    top: '50%',
    right: '10%',
    width: '80px',
    height: '80px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    animation: 'float 3s ease-in-out infinite 0.5s',
  },
  illustrationCard3: {
    position: 'absolute',
    bottom: '20%',
    left: '30%',
    width: '80px',
    height: '80px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    animation: 'float 3s ease-in-out infinite 1s',
  },

  // Features Section
  featuresSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: '50px',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  highlight: {
    color: '#FF6B35',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(99,102,241,0.1)',
    ':hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 30px rgba(255,107,53,0.1)',
      borderColor: '#FF6B35',
    },
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '15px',
  },
  featureDescription: {
    fontSize: '16px',
    color: '#64748B',
    lineHeight: '1.6',
  },

  // Stats Section
  statsSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    position: 'relative',
    zIndex: 1,
  },
  statCard: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid rgba(46,204,113,0.2)',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#64748B',
    fontWeight: '500',
  },

  // How It Works Section
  howItWorksSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  stepCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    position: 'relative',
    border: '1px solid rgba(99,102,241,0.1)',
  },
  stepNumber: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #FF6B35, #6366f1)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '15px',
    marginTop: '10px',
  },
  stepDescription: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.6',
  },

  // Testimonials Section
  testimonialsSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    padding: '0 20px',
    position: 'relative',
    zIndex: 1,
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  testimonialCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    border: '1px solid rgba(99,102,241,0.1)',
  },
  testimonialText: {
    fontSize: '16px',
    color: '#4B5563',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    display: 'flex',
    flexDirection: 'column',
  },
  testimonialName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
  },
  testimonialRole: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '4px',
  },

  // CTA Section
  ctaSection: {
    background: 'linear-gradient(135deg, #6366f1 0%, #2563EB 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  ctaDescription: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '30px',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '16px 40px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
  ctaButtonHover: {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 12px 30px rgba(46,204,113,0.4)',
  },

  // Footer
  footer: {
    background: '#1E293B',
    padding: '40px 0',
    position: 'relative',
    zIndex: 1,
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center',
  },
  footerLogo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  footerLinks: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#FF6B35',
    },
  },
  copyright: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
};

// Global animations
const globalStyles = `
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}