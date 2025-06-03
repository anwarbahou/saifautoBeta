"use client"

import { useState } from 'react'
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// Import worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

interface PDFViewerProps {
  url: string
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Worker workerUrl={pdfjsWorker}>
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          renderError={(renderError) => {
            setError('Failed to load PDF. Please try again.')
            return (
              <div className="flex items-center justify-center h-full text-red-500">
                Failed to load PDF. Please try again.
              </div>
            )
          }}
        />
      </Worker>
    </div>
  )
} 