import { useEffect, useState } from 'react'
import useSWR from 'swr'

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

const TestConnect: React.FC = () => {
  const { data, error } = useSWR('http://localhost:3001/', fetcher)
  console.log(data)
  if (data) {
    return <div>Server Response: {data.message}</div>
  }
  return <div>No connection to server yet.</div>
}

export default TestConnect
