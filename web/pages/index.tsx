import localforage from 'localforage'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import { useUser } from '../hooks/useUser'

const IndexPage = () => {
  const user = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user.loading && !user.username) {
      router.push('/login')
      return
    }
    if (!user.loading && user.username) {
      router.push('/quote')
      return
    }
  }, [user])

  return (
    <div className='bg-fuel text-center text-4xl font-medium h-screen flex justify-center items-center'>
      <h1 className='text-white'>Loading...</h1>
    </div>
  )
}

export default IndexPage
