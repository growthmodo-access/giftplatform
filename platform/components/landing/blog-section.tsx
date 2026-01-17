import styles from './landing.module.css'

export function BlogSection() {
  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        <h2>Explore expert tips to boost engagement.</h2>
        <p className={styles.sectionSubtitle}>
          Dive into our resources designed to empower your team, delight clients, and make events unforgettable.
        </p>
        <div className={styles.blogSearch}>
          <input type="text" placeholder="Search articles..." className={styles.searchInput} />
          <button className={styles.btnOutline}>View all articles</button>
        </div>
        <div className={styles.blogGrid}>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>📦</div>
            <h3>Top 5 Swag Platforms Best CRM Global Swagging in 2024</h3>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🎉</div>
            <h3>Employee Appreciation Day 2024 Swag Ideas</h3>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>👕</div>
            <h3>Your Complete T-Shirts and Swag Guide for Employee Appreciation Day 2024</h3>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🔗</div>
            <h3>Loop & Tie 2024 Review: Products, Use Cases, and More</h3>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🎁</div>
            <h3>Corporate Gifting Best Practices for 2024</h3>
          </div>
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🌍</div>
            <h3>Global Shipping Made Simple: A Complete Guide</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
