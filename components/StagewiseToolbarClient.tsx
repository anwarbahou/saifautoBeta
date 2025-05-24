"use client"
import { StagewiseToolbar } from "@stagewise/toolbar-next"

const stagewiseConfig = { plugins: [] }

export const StagewiseToolbarClient = () => (
  <StagewiseToolbar config={stagewiseConfig} />
) 