'use client'

import { useRouter } from 'next/navigation'

export function LandingHero() {
  const router = useRouter()

  const handleRequestDemo = () => {
    // You can add a modal or redirect to a demo form
    console.log('Request demo clicked')
  }

  const handleExploreCountries = () => {
    // Scroll to countries section or show modal
    console.log('Explore countries clicked')
  }

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-trust-badge">
            <span className="trust-badge-text">Your trusted partner for global gifting.</span>
          </div>
          <h1 className="hero-title">Boost engagement globally, send premium swag and gifts</h1>
          <p className="hero-subtitle">
            Improve your culture and increase sales, all in one global gifting platform.
          </p>
          <div className="hero-actions">
            <button
              onClick={handleRequestDemo}
              className="btn-primary btn-large"
              aria-label="Request a demo for PerkUp"
            >
              Request a demo
            </button>
            <button
              onClick={handleExploreCountries}
              className="btn-outline btn-large"
              aria-label="Explore countries where PerkUp operates"
            >
              Explore countries
            </button>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <span className="globe-icon">🌍</span>
              <span className="trust-text">Trusted by 50,000+ users globally</span>
            </div>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">4.5 / 5 on G2</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="map-container">
            <div className="world-map"></div>
            {/* Product Showcases */}
            <div className="product-showcase showcase-1">
              <div className="product-bubble">
                <div className="product-item">👕</div>
                <div className="product-item">☕</div>
              </div>
              <div className="connection-line line-1"></div>
              <div className="house-icon house-1">
                <div className="flag flag-ca">🇨🇦</div>
                <div className="house">🏠</div>
              </div>
            </div>
            <div className="product-showcase showcase-2">
              <div className="product-bubble">
                <div className="product-item">🧥</div>
                <div className="product-item">💼</div>
              </div>
              <div className="connection-line line-2"></div>
              <div className="house-icon house-2">
                <div className="flag flag-fr">🇫🇷</div>
                <div className="house">🏠</div>
              </div>
              <div className="connection-line line-3"></div>
              <div className="house-icon house-3">
                <div className="flag flag-de">🇩🇪</div>
                <div className="house">🏠</div>
              </div>
            </div>
            <div className="product-showcase showcase-3">
              <div className="product-bubble">
                <div className="product-item">💻</div>
                <div className="product-item">🎧</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
