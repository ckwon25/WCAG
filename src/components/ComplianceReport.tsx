interface ReportData {
  violations: {
    type: string
    count: number
    issues: string[]
  }[]
}

interface ComplianceReportProps {
  report: ReportData
}

export default function ComplianceReport({ report }: ComplianceReportProps) {
  const totalViolations = report.violations.reduce((sum, v) => sum + v.count, 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance Report</h2>

      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-semibold">✓ All violations have been fixed!</p>
        <p className="text-green-700 text-sm mt-1">Found and corrected {totalViolations} issue{totalViolations !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {report.violations.map((violation, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{violation.type}</h3>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                {violation.count} issue{violation.count !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {violation.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
