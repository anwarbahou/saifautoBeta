"use client"

import { StagewiseToolbar } from '@stagewise/toolbar-next'

const stagewiseConfig = { plugins: [] }

const StagewiseToolbarClient = () => {
  return <StagewiseToolbar config={stagewiseConfig} />
}

export default StagewiseToolbarClient 