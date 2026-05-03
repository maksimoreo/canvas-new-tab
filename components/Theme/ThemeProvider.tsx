import { useState, type PropsWithChildren } from 'react'
import { ThemeContext, type Theme } from './context'
import { useStorageMutation, useStorageQuery } from '@/hooks/useStorage'
import { themeInStorage } from '@/lib/storage'

function updateRootTheme(theme: Theme) {
  const root = window.document.documentElement

  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'

    root.classList.add(systemTheme)

    return
  }

  root.classList.add(theme)
}

export function ThemeProvider({
  children,
  defaultTheme,
}: PropsWithChildren<{ defaultTheme?: Theme }>) {
  const [theme, setTheme] = useState<Theme>(defaultTheme ?? 'system')

  useStorageQuery(themeInStorage, {
    onCompleted: (theme) => {
      setTheme(theme)
      updateRootTheme(theme)
    },
  })

  const { store } = useStorageMutation(themeInStorage)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: Theme) => {
          store(theme)
          setTheme(theme)
          updateRootTheme(theme)
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
