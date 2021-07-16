import axios from 'axios'
import localforage from 'localforage'

const apiclient = axios.create()

apiclient.defaults.baseURL = 'http://localhost:3001/'

apiclient.interceptors.request.use(async (config) => {
  const token = await localforage.getItem('token')
  config.headers.common = { Authorization: `bearer ${token}` }
  return config
})

export default apiclient
