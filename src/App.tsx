import { useState } from 'react'
import Upload from './components/Upload'
import ProcessingStatus from './components/ProcessingStatus'
import Results from './components/Results'
import ComplianceReport from './components/ComplianceReport'

type AppState = 'upload' | 'processing' | 'results' | 'error'

interface ProcessingResult {
  fileId: string
  fileName: string
  report: {
    violations: {
      type: string
      count: number
      issues: string[]
    }[]
  }
  versions: {
    name: string
    path: string
  }[]
}

export default function App() {
  const [state, setState] = useState<AppState>('upload')
  const [result, setResult] = useState<ProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setState('processing')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploadData = await uploadRes.json()

      const processRes = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: uploadData.fileId, fileName: file.name })
      })

      if (!processRes.ok) throw new Error('Processing failed')
      const processData = await processRes.json()

      setResult(processData)
      setState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WCAG Compliance Tool</h1>
          <p className="text-lg text-gray-600">Automate WCAG 2.1 Level AA compliance for your presentations</p>
        </header>

        {state === 'upload' && <Upload onUpload={handleUpload} />}
        {state === 'processing' && <ProcessingStatus />}
        {state === 'results' && result && (
          <div className="space-y-6">
            <ComplianceReport report={result.report} />
            <Results fileName={result.fileName} versions={result.versions} />
          </div>
        )}
        {state === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => { setState('upload'); setError(null) }}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
