export function ClientLogos() {
  const logos = ['Greenhouse', 'Spotify Health', 'WISE', 'Pipedrive', 'Udemy']

  return (
    <section className="py-10 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex flex-wrap items-center justify-around gap-10">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="text-gray-500 text-base font-semibold opacity-70 hover:opacity-100 hover:text-gray-900 transition-all cursor-default"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
