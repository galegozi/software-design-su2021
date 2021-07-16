import React from 'react'

const userContext = React.createContext<{
  username: string
  id: number | null
  loading: boolean
}>({ username: '', id: null, loading: true })

export { userContext }
