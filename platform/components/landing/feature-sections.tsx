
export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="feature-section">
        <div className="container">
          <div className="feature-content">
            <div className="feature-image">
              <div className="swag-showcase">
                <div className="swag-item">🎒</div>
                <div className="swag-item">☕</div>
                <div className="swag-item">🧢</div>
                <div className="swag-item">👕</div>
                <div className="swag-item">🧥</div>
                <div className="swag-item">📓</div>
              </div>
            </div>
            <div className="feature-text">
              <div className="section-tag tag-blue">THINK GLOBAL, ACT LOCAL</div>
              <h2>Order premium swag for your global team and events in any volume</h2>
              <p>Access hassle-free global swag with no shipping or customs fees. Premium swag in any volume, on-demand or in bulk, warehoused and delivered to over 80 countries.</p>
              <button className="btn-outline btn-blue">Learn more &gt;</button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="feature-section alt">
        <div className="container">
          <div className="feature-content reverse">
            <div className="feature-text">
              <div className="section-tag tag-pink">GIVE THE GIFT OF CHOICE</div>
              <h2>Explore 60,000+ gifts and gift cards globally</h2>
              <p>Boost employee retention and client appreciation with thoughtful, personalized gifts for every occasion, allowing each person to choose something they truly love, and making every gift feel special and memorable.</p>
              <button className="btn-outline btn-pink">Learn More &gt;</button>
            </div>
            <div className="feature-image">
              <div className="gifts-showcase">
                <div className="gift-item">📷</div>
                <div className="gift-item">☕</div>
                <div className="gift-item">💳</div>
                <div className="gift-item">🎁</div>
                <div className="gift-item">🍫</div>
                <div className="gift-item">📦</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="feature-section">
        <div className="container">
          <div className="feature-content">
            <div className="feature-image">
              <div className="automation-showcase">
                <div className="celebration-card">
                  <div className="card-title">WORK ANNIVERSARY!</div>
                  <div className="card-stars">⭐⭐⭐</div>
                </div>
                <div className="celebration-card">
                  <div className="card-photo">👤</div>
                  <div className="card-title">Welcome to the team!</div>
                </div>
                <div className="celebration-card">
                  <div className="card-photo">👤</div>
                  <div className="card-title">Happy Birthday!</div>
                </div>
              </div>
            </div>
            <div className="feature-text">
              <div className="section-tag tag-purple">MAKE EVERY OCCASION MEANINGFUL</div>
              <h2>Automate gifts for new hires, birthdays, and anniversaries</h2>
              <p>Celebrate your employees' milestones effortlessly. Automate rewards for anniversaries, birthdays, and new hires to ensure every moment is recognized and appreciated.</p>
              <button className="btn-outline btn-purple">Learn More &gt;</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
