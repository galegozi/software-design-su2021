// import TestConnect from '../components/TestConnect'
import Layout from '../components/Layout'
import { DateTime } from 'luxon'
import { useEffect } from 'react'
import { SetStateAction, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'
import apiclient from '../utils/apiclient'
import { useAlert } from 'react-alert'
import useSwr from 'swr'
import { useCallback } from 'react'

interface ITableProps {
  headers: string[]
  rows: string[][]
}

const Table: React.FC<ITableProps> = ({ headers, rows }) => {
  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  {headers.map(header => (
                    <th
                      scope='col'
                      key={`th-${header}`}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows?.map((row, index) => (
                  <tr
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    key={`row-${index}`}
                  >
                    <Td>{row.id}</Td>
                    <Td>{new Date(row.quote_date).toDateString()}</Td>
                    <Td>{row.gallons}</Td>
                    <Td>{new Date(row.delivery_date).toDateString()}</Td>
                    <Td>${row.price_per_gallon / 100}</Td>
                    <Td>${row.total_price / 100}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const Td = ({ children }) => (
  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
    {children}
  </td>
)

const GetQuote = () => {
  const alert = useAlert()
  const [gallon, setGallon] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [todayDate, setTodayDate] = useState('')
  const [prevHist, setPrevHist] = useState([])
  const [addr1, setAddr1] = useState('')
  const [addr2, setAddr2] = useState('')

  const [pricePerGallon, setPricePerGallon] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)

  const { data: quoteData, error, mutate } = useSwr(
    'http://localhost:3001/quoteinfo',
    apiclient
  )

  useEffect(() => {
    ;(async () => {
      const uinfo = await apiclient
        .get('http://localhost:3001/userinfo')
        .then(r => {
          return {
            addr1: r.data.addr1,
            addr2: r.data.addr2,
          }
        })
      setAddr1(uinfo.addr1)
      setAddr2(uinfo.addr2)
    })()
  }, [])
  const checkPrice = useCallback(async () => {
    try {
      // send request WITHOUT finalize
      const response = await apiclient
        .post('http://localhost:3001/quote', {
          gallon,
          deliveryDate,
        })
        .then(r => r.data.price)
      const { ppg, totalPrice } = response
      setTotalPrice(totalPrice)
      setPricePerGallon(ppg)
    } catch (e) {
      console.error(e?.response?.data)
      const message = e?.response?.data?.message
      if (message) {
        alert.error(message)
      } else {
        // show generic message
        alert.error('unknown error occurred')
      }
    }
  }, [apiclient, gallon, deliveryDate])

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    console.log('submitting')
    try {
      const response = await apiclient.post('http://localhost:3001/quote', {
        gallon,
        deliveryDate,
        finalize: true,
      })
      console.log(response)
      alert.success('Quote updated successfully')
      mutate()
      console.log(response)
    } catch (e) {
      console.error(e?.response?.data)
      const message = e?.response?.data?.message
      if (message) {
        alert.error(message)
      } else {
        // show generic message
        alert.error('unknown error occurred')
      }
    }
  }

  useEffect(() => {
    const now = DateTime.now()
      .plus({ days: 1 })
      .toSQLDate()
    setTodayDate(now)
  }, [])

  return (
    <Layout>
      <div className='lg:h-screen bg-fuel'>
        <div className='flex h-full flex-col justify-center items-center lg:pt-5  w-full text-sm'>
          <div className='bg-white w-2/3 rounded-lg m-5 gap-y-20 text-'>
            <div className='p-10'>
              <div className='mt-8'>
                <span className='text-xl font-medium'>Fuel Quote Form</span>
                <div className='mt-6'>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                      <label
                        htmlFor='gallon'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Gallon
                      </label>
                      <div className='mt-1'>
                        <input
                          type='number'
                          value={gallon}
                          id='gallon'
                          name='gallon'
                          onChange={e => setGallon(e.currentTarget.value)}
                          required
                          className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        ></input>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor='deliveryAddress'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Delivery Address
                      </label>
                      <div className='mt-1'>
                        <label className='appearance-none bg-gray-200 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                          <div>{addr1}</div>
                          <div>{addr2}</div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor='deliveryDate'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Delivery Date
                      </label>
                      <div className='mt-1'>
                        <input
                          type='date'
                          value={deliveryDate}
                          onChange={e => setDeliveryDate(e.currentTarget.value)}
                          min={todayDate}
                          placeholder={todayDate}
                          required
                        ></input>
                      </div>
                    </div>
                    <div className='flex flex-row items-end'>
                      <div className='mr-2'>
                        <label
                          htmlFor='deliveryDate'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Price Per Gallon
                        </label>
                        <div className='appearance-none bg-gray-200 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                          <input disabled value={pricePerGallon || ''}></input>
                        </div>
                      </div>
                      <div className='mr-2'>
                        <label
                          htmlFor='deliveryDate'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Total Price
                        </label>
                        <div className='appearance-none bg-gray-200 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                          <input
                            disabled
                            value={totalPrice / 100 || ''}
                          ></input>
                        </div>
                      </div>
                      <div>
                        <button
                          type='button'
                          onClick={checkPrice}
                          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                          Check Price
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        type='submit'
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      >
                        Get Quote
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className=' bg-white w-2/3 rounded-lg m-5'>
            <div className='p-10'>
              <div className='mt-8'>
                <span className='text-xl font-medium'>Quote History</span>
                <div className='mt-6 text-xs text-center'>
                  <Table
                    headers={[
                      'Quote ID',
                      'Date',
                      'Gallons',
                      'Delivery Date',
                      'Price Per Gallon',
                      'Total Amount due',
                    ]}
                    rows={quoteData?.data?.quotes}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GetQuote
