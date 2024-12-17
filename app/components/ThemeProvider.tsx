'use client'

import React, { useState, useEffect, ReactNode } from 'react'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('appTheme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove both classes first
    root.classList.remove('light', 'dark')
    // Add the current theme
    root.classList.add(theme)

    localStorage.setItem('appTheme', theme)
  }, [theme])

  // Add a function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`${theme} min-h-screen`}>
      {children}
      {/* Optional: Add a theme toggle button */}
      <button 
        onClick={toggleTheme} 
        className="fixed bottom-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded"
      >
        Toggle Theme
      </button>
    </div>
  )
}