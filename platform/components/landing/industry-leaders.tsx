import styles from './landing.module.css'

export function IndustryLeaders() {
  return (
    <section className={styles.clientsSection}>
      <div className={styles.container}>
        <div className={styles.clientsContent}>
          <div className={styles.clientsText}>
            <h2>Ready to join industry leaders?</h2>
            <p className={styles.clientsDescription}>
              Discover how top companies boost their employee, client, and event engagement through PerkUp.
            </p>
            <button className={styles.btnPrimary}>See case studies</button>
          </div>
          <div className={styles.clientsVisual}>
            <div className={styles.clientsGrid}>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoMicrosoft}>
                    <div className={styles.msSquares}>
                      <div className={`${styles.msSquare} ${styles.red}`}></div>
                      <div className={`${styles.msSquare} ${styles.green}`}></div>
                      <div className={`${styles.msSquare} ${styles.blue}`}></div>
                      <div className={`${styles.msSquare} ${styles.yellow}`}></div>
                    </div>
                    <span className={styles.logoText}>Microsoft</span>
                  </div>
                </div>
              </div>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoCornerstone}>
                    <span className={styles.cornerstoneIcon}>⭐</span>
                    <span className={styles.logoText}>cornerstone</span>
                  </div>
                </div>
              </div>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoMapbox}>
                    <div className={styles.mapboxIcon}>📍</div>
                    <span className={styles.logoText}>mapbox</span>
                  </div>
                </div>
              </div>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoChownow}>
                    <div className={styles.chownowIcon}>🍴</div>
                    <span className={styles.logoText}>ChowNow</span>
                  </div>
                </div>
              </div>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoInhabit}>
                    <div className={styles.inhabitIcon}>i</div>
                    <span className={styles.logoText}>inhabit</span>
                  </div>
                </div>
              </div>
              <div className={styles.clientLogoCard}>
                <div className={styles.clientLogo}>
                  <div className={styles.logoLumen}>
                    <span className={styles.logoText}>LUMEN</span>
                    <span className={styles.lumenReg}>®</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
