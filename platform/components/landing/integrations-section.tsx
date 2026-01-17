import styles from './landing.module.css'

export function IntegrationsSection() {
  return (
    <section className={styles.integrationsSection}>
      <div className={styles.container}>
        <h2>Integrated to your workspace.</h2>
        <p className={styles.sectionSubtitle}>Automate your workflow with 100+ webhook triggers.</p>
        <div className={styles.integrationsGrid}>
          <div className={styles.integrationLogo}>Salesforce</div>
          <div className={styles.integrationLogo}>HubSpot</div>
          <div className={styles.integrationLogo}>Slack</div>
          <div className={styles.integrationLogo}>Zapier</div>
          <div className={styles.integrationLogo}>Google Workspace</div>
          <div className={styles.integrationLogo}>Microsoft Teams</div>
          <div className={styles.integrationLogo}>Zoom</div>
          <div className={styles.integrationLogo}>Asana</div>
          <div className={styles.integrationLogo}>Trello</div>
          <div className={styles.integrationLogo}>Monday.com</div>
          <div className={styles.integrationLogo}>Notion</div>
          <div className={styles.integrationLogo}>Jira</div>
        </div>
      </div>
    </section>
  )
}
