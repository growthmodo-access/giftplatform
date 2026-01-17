const integrations = [
  'Salesforce',
  'HubSpot',
  'Slack',
  'Zapier',
  'Google Workspace',
  'Microsoft Teams',
  'Zoom',
  'Asana',
  'Trello',
  'Monday.com',
  'Notion',
  'Jira',
]

export function IntegrationsSection() {
  return (
    <section className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Integrated to your workspace.
          </h2>
          <p className="text-lg text-gray-600">
            Automate your workflow with 100+ webhook triggers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all text-center"
            >
              <div className="text-gray-700 font-semibold">{integration}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
