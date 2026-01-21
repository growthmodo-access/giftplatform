export default function TestThemePage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Primary Color Test</h2>
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            This should be indigo (#4F46E5) if theme is working
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Background Test</h2>
          <div className="bg-background border border-border p-4 rounded-lg">
            Background should be light gray (#F8FAFC)
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Button Test</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            Primary Button
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Card Test</h2>
          <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
            Card with theme colors
          </div>
        </div>
      </div>
    </div>
  )
}
