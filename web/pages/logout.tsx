import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import Layout from '../components/Layout'

const LogoutPage = () => {
  const router = useRouter()
  useEffect(() => {
    // TODO: Log the user out
    // then redirect
    setTimeout(() => router.push('/'), 500)
  }, [])
  return (
    <Layout>
      <div className='bg-fuel text-center text-4xl font-medium h-screen flex justify-center items-center'>
        <h1 className='text-white'>Logging out...</h1>
      </div>
    </Layout>
  )
}

export default LogoutPage
