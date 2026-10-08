'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { InitialSiteLoading } from './initial-site-loading'
import { useInitialLoading } from './use-initial-loading'

const PageReadyContext = createContext(true)

export function InitialLoadingProvider({ children }: { children: ReactNode }) {
  const loading = useInitialLoading()
  const [ready, setReady] = useState(() => !loading)
  const finish = useCallback(() => setReady(true), [])

  return (
    <PageReadyContext.Provider value={ready}>
      <InitialSiteLoading loading={loading && !ready} onExitComplete={finish} />
      {children}
    </PageReadyContext.Provider>
  )
}

export function usePageReady() {
  return useContext(PageReadyContext)
}
