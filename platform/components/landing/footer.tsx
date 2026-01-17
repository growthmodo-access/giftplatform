import Link from 'next/link'
import styles from './landing.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <div className={styles.footerLogo}>
              <span className={styles.logoIcon}>P</span>
              <span className={styles.logoText}>Goodies.so</span>
            </div>
            <p className={styles.copyright}>© 2024 Goodies.so. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Partners</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Solutions</h4>
              <a href="#">Employee Engagement</a>
              <a href="#">Client Gifting</a>
              <a href="#">Events</a>
              <a href="#">Recognition</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Products</h4>
              <a href="#">Swag</a>
              <a href="#">Gifts</a>
              <a href="#">Gift Cards</a>
              <a href="#">Automation</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Case Studies</a>
              <a href="#">Guides</a>
              <a href="#">API Docs</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
              <a href="#">Compliance</a>
            </div>
          </div>
          <div className={styles.footerBadges}>
            <div className={styles.badge}>
              <span className={styles.badgeLabel}>ACTA</span>
              <span>500</span>
            </div>
            <div className={`${styles.badge} ${styles.eco}`}>🌱 Eco-Friendly</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
