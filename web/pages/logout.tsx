import localforage from 'localforage'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useUser } from '../hooks/useUser'

const LogoutPage = () => {
  const router = useRouter()
  const { logout } = useUser()
  const alert = useAlert()
  useEffect(() => {
    // TODO: Log the user out
    // then redirect
    ;(async () => {
      await localforage.clear()
      logout()
      setTimeout(() => router.push('/'), 500)
      alert.info('Logged out successfully')
    })()
  }, [])
  return (
    <div className='bg-fuel text-center text-4xl font-medium h-screen flex justify-center items-center'>
      <h1 className='text-white'>Logging out...</h1>
    </div>
  )
}

export default LogoutPage
