'use client'

import { useEffect } from 'react'

export function CSSVariablesCheck() {
  useEffect(() => {
    // #region agent log
    const rootStyles = getComputedStyle(document.documentElement)
    const cssVars = {
      primary: rootStyles.getPropertyValue('--primary'),
      primaryForeground: rootStyles.getPropertyValue('--primary-foreground'),
      background: rootStyles.getPropertyValue('--background'),
      foreground: rootStyles.getPropertyValue('--foreground'),
      card: rootStyles.getPropertyValue('--card'),
      border: rootStyles.getPropertyValue('--border'),
    }
    
    // Check computed styles on a button element
    const testButton = document.createElement('button')
    testButton.className = 'bg-primary text-primary-foreground'
    document.body.appendChild(testButton)
    const buttonStyles = getComputedStyle(testButton)
    const computedBg = buttonStyles.backgroundColor
    const computedColor = buttonStyles.color
    document.body.removeChild(testButton)
    
    fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/css-variables-check.tsx:25',message:'CSS variables and computed styles check',data:{cssVars,computedBg,computedColor,buttonBgClass:'bg-primary',buttonTextClass:'text-primary-foreground'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }, [])
  
  return null
}
