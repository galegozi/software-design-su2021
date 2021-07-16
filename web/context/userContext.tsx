import React from 'react'

const userContext = React.createContext<{
  user: { username: string; id: number | null; loading: boolean }
  logout?: () => void
  login?: (username: string, id: number) => void
}>({ user: { username: '', id: null, loading: true } })

export { userContext }
