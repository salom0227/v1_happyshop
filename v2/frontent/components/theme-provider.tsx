'use client'

import * as React from 'react'
import { AppThemeProvider } from '@/contexts/ThemeContext'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>
}
