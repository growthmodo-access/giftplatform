'use client'

import { useRouter } from 'next/navigation'
import styles from './landing.module.css'

export function CTASection() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2>Elevate your swag game worldwide.</h2>
        <p className={styles.sectionSubtitle}>
          Deliver every swag, matter, and gift with easy inventory, event management, and team accountability.
        </p>
        <button onClick={handleRequestDemo} className={`${styles.btnPrimary} ${styles.btnLarge}`}>
          Request a demo
        </button>
        <div className={styles.ctaItems}>
          <div className={styles.ctaItem}>👜</div>
          <div className={styles.ctaItem}>📓</div>
          <div className={styles.ctaItem}>💧</div>
          <div className={styles.ctaItem}>🔊</div>
          <div className={styles.ctaItem}>🧥</div>
          <div className={styles.ctaItem}>☕</div>
        </div>
      </div>
    </section>
  )
}
