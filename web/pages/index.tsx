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

  return <Layout>Loading...</Layout>
}

export default IndexPage
