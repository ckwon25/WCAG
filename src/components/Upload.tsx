import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadProps {
  onUpload: (file: File) => void
}

export default function Upload({ onUpload }: UploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
        isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-indigo-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-5xl">📄</div>
        <h2 className="text-2xl font-semibold text-gray-900">Upload Your Presentation</h2>
        <p className="text-gray-600">Drag and drop your file here, or click to select</p>
        <p className="text-sm text-gray-500">Supported: PowerPoint (.pptx), Word (.docx)</p>
        <p className="text-xs text-gray-400 mt-4">Google Slides: Download as PPTX first, then upload</p>
      </div>
    </div>
  )
}
