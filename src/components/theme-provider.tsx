"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

interface ThemeProviderProps extends Omit<React.ComponentProps<typeof NextThemesProvider>, "children"> {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}