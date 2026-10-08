(() => {
  let theme = 'system'
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') theme = stored
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }
  document.documentElement.dataset.theme = theme === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
})()
