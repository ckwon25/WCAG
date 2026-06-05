interface ResultsProps {
  fileName: string
  versions: {
    name: string
    path: string
  }[]
}

export default function Results({ fileName, versions }: ResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Download Compliant Versions</h2>
      <p className="text-gray-600 mb-6">Your document "<strong>{fileName}</strong>" has been processed and is ready to download.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {versions.map((version) => (
          <a
            key={version.path}
            href={`/.netlify/functions/download?path=${encodeURIComponent(version.path)}`}
            className="block p-6 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:shadow-lg transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">{version.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {version.name === 'High Contrast' && 'Dark mode with WCAG AA colors'}
                  {version.name === 'Standard' && 'Original styling with fixes applied'}
                  {version.name === 'Large Text' && 'Enlarged text (18pt+) for low vision'}
                  {version.name === 'Screen Reader Optimized' && 'Semantic structure for accessibility'}
                </p>
              </div>
              <span className="text-2xl">📥</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
