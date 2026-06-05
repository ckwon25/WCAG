export default function ProcessingStatus() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Your Document</h2>
        <p className="text-gray-600">Analyzing WCAG compliance and generating accessible versions...</p>
        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-indigo-600 mr-2">✓</span> Parsing document structure
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-indigo-600 mr-2">→</span> Detecting WCAG violations
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-gray-400 mr-2">◯</span> Generating alt text
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-gray-400 mr-2">◯</span> Creating 4 compliant versions
          </div>
        </div>
      </div>
    </div>
  )
}
