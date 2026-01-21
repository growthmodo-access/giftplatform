'use client'

import { useEffect } from 'react'

export function CSSVariablesCheck() {
  useEffect(() => {
    // #region agent log
    setTimeout(() => {
      const rootStyles = getComputedStyle(document.documentElement)
      const cssVars = {
        primary: rootStyles.getPropertyValue('--primary'),
        primaryForeground: rootStyles.getPropertyValue('--primary-foreground'),
        background: rootStyles.getPropertyValue('--background'),
        foreground: rootStyles.getPropertyValue('--foreground'),
        card: rootStyles.getPropertyValue('--card'),
        border: rootStyles.getPropertyValue('--border'),
      }
      
      // Check actual button elements on the page
      const buttons = document.querySelectorAll('button')
      const buttonStyles: any[] = []
      buttons.forEach((btn, idx) => {
        if (idx < 5) { // Check first 5 buttons
          const styles = getComputedStyle(btn)
          buttonStyles.push({
            index: idx,
            classes: btn.className,
            bgColor: styles.backgroundColor,
            color: styles.color,
            borderColor: styles.borderColor,
          })
        }
      })
      
      // Check cards
      const cards = document.querySelectorAll('[class*="Card"]')
      const cardStyles: any[] = []
      cards.forEach((card, idx) => {
        if (idx < 3) {
          const styles = getComputedStyle(card)
          cardStyles.push({
            index: idx,
            classes: card.className,
            bgColor: styles.backgroundColor,
            borderColor: styles.borderColor,
          })
        }
      })
      
      // Check if Tailwind classes are being applied
      const testEl = document.createElement('div')
      testEl.className = 'bg-primary text-primary-foreground'
      document.body.appendChild(testEl)
      const testStyles = getComputedStyle(testEl)
      const testBg = testStyles.backgroundColor
      const testColor = testStyles.color
      document.body.removeChild(testEl)
      
      fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/css-variables-check.tsx:50',message:'Comprehensive style check',data:{cssVars,buttonStyles,cardStyles,testBg,testColor,testClasses:'bg-primary text-primary-foreground',buttonCount:buttons.length,cardCount:cards.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    }, 1000)
    // #endregion
  }, [])
  
  return null
}
