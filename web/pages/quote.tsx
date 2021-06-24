// import TestConnect from '../components/TestConnect'

import { SetStateAction, useState } from 'react'
import classNames from '../utils/classNames'



const GetQuote = () => {
    const [gallon, setGallon] = useState('')

  return (
    <div className='bg-fuel h-screen'>
        <div className=' h-full container mx-auto flex justify-center items-center'>
             <div className='w-full h-full sm:h-auto sm:w-1/2 md:1/3 bg-white  rounded-lg'>
                <div className='p-10'>
                    <div className='mt-8'>
                    Fuel Quote Form
                    <div className='mt-6'>
                        <form className='space-y-6'>
                            <div>
                                <label 
                                    htmlFor='gallon' 
                                    className='block text-sm font-medium text-gray-700' >
                                    Gallon
                                </label>
                                <div className='mt-1'>
                                    <input 
                                        value={gallon}
                                        id='gallon'
                                        name='gallon'
                                        onChange={(e) => setGallon(e.currentTarget.value)} 
                                        required
                                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                    >
                                    </input>

                                </div>
                            </div>
                            <div>
                                <label 
                                    htmlFor='deliveryAddress' 
                                    className='block text-sm font-medium text-gray-700' >
                                    Delivery Address
                                </label>
                                <div className='mt-1'>
                                    <label 
                                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                    >
                                    1800 Main Street, Houston, TX, 77083
                                    </label>

                                </div>
                            </div>
                            <div>
                                <label 
                                    htmlFor='deliveryDate' 
                                    className='block text-sm font-medium text-gray-700' >
                                    Delivery Date
                                </label>
                                <div className='mt-1'>
                                    <label 
                                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                    >
                                    06/23/2021
                                    </label>

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

            <div className=' w-full h-full sm:h-auto sm:w-1/2 md:1/3 bg-white rounded-lg'>
                <div className='p-10'>
                    <div className='mt-8'>
                    Quote History
                    <div className='mt-6 text-xs text-center'>
                        <table className='table-fixed '>
                            <thead>
                                <tr>
                                    <th className='w-1/6'>Date</th>
                                    <th className='w-1/6'>Gallon</th>
                                    <th className='w-1/6'>Delivery Date</th>
                                    <th className='w-1/6'>Price per Gallon</th>
                                    <th className='w-1/6'>Total Ammount due</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                        <td>06/23/2021</td>
                                        <td>20</td>
                                        <td>09/23/2021</td>
                                        <td>2</td>
                                        <td>40</td>
                                </tr>
                                <tr>
                                        <td>10/07/2020</td>
                                        <td>25</td>
                                        <td>01/05/2021</td>
                                        <td>2</td>
                                        <td>50</td>
                                </tr>
                                <tr>
                                        <td>02/28/2019</td>
                                        <td>40</td>
                                        <td>05/01/2019</td>
                                        <td>1.5</td>
                                        <td>60</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>

      
  )
}

export default GetQuote


