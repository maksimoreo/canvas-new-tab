import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const initialState: ThemeContextValue = {
  theme: 'system',
  setTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextValue>(initialState)

export function useTheme() {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error(
      'useThemeContext can only be used inside ThemeProvider component'
    )
  }

  return themeContext
}
