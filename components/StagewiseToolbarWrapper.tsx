"use client"

import dynamic from 'next/dynamic'
import React from 'react'

const StagewiseToolbarClient = dynamic(() => import('./StagewiseToolbarClient'), { ssr: false })

const StagewiseToolbarWrapper: React.FC = () => {
  return <StagewiseToolbarClient />
}

export default StagewiseToolbarWrapper 