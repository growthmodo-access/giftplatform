import styles from './landing.module.css'

export function Testimonials() {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.testimonialsHeader}>
          <div className={`${styles.sectionTag} ${styles.tagPurple}`}>PROOF IN ACTION</div>
          <h2>Our clients say it best</h2>
          <p className={styles.testimonialsSubtitle}>
            See what our customers around the world are saying about Goodies.so.
          </p>
        </div>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "Goodies.so does everything for me, so it's very easy for our employees to also manage the platform. It's fairly simple to get in and pick what you want."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <strong className={styles.authorName}>Cici R.</strong>
                  <span className={styles.authorRole}>People Operations Generalist at Chernowe</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.testimonialCard} ${styles.featured}`}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "Easy handling, superb customer support, high quality products."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorRole}>Mental Health Care Professional</span>
                </div>
              </div>
              <div className={styles.companyLogoBadge}>
                <div className={styles.logoSpring}>Spring Health</div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "The platform is really easy to use. We just decide where to spend money, and it works. Its adaptability lets us use it in different ways, and the reporting is great for taxable items. I can run one report at the end of the year, grass it up, and I know what to do."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <strong className={styles.authorName}>Shane C.</strong>
                  <span className={styles.authorRole}>VP of Human Resources, at Inhabit</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "I am very grateful that I had an opportunity to use the Goodies.so card. I love that I can use it as a regular debit card and pay on things that I wanted/needed. I also like where they would create suggestions on what we can use based on health and wellness. It introduced me to brands I had never thought of looking into. I'm also glad that this perk replenishes every year. Can't wait to use it again. Thank you so much for this benefit! It has helped me greatly!"
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <strong className={styles.authorName}>Aliyah J.</strong>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "Its ability to scale while being easy to use for both the end user and the administrator is the really great thing about Goodies.so. Plus, it keeps it fun and fresh, which allows us to think about the employee experience differently every time."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <strong className={styles.authorName}>Holly N.</strong>
                  <span className={styles.authorRole}>Global Head of Marketing and Communications</span>
                </div>
              </div>
              <div className={styles.companyLogoBadge}>
                <div className={styles.logoMapbox}>mapbox</div>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <div className={styles.quote}>
                "The program is so easy for you and beneficial to what is being provided by our company as what we can and can not have. From choosing which site you want to use to transfer your balance is not limited."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👤</div>
                <div className={styles.authorDetails}>
                  <strong className={styles.authorName}>Holly N.</strong>
                  <span className={styles.authorRole}>IT Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
