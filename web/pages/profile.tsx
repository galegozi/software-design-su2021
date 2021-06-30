// import TestConnect from '../components/TestConnect'

import { useState } from 'react'

const ProfileManagement = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    /*
      - State (Drop Down, selection required) DB will store 2 character state code
      - Zipcode (9 characters, at least 5 character code required)
     */

    const profMan = () => {
        // TODO: Send username and password to the backend for verifcation
        // TODO: Set UI to loading state
    }

    const getStates = () => {
        // TODO: Access states from backend.
        return [
            "TX",
            "US",
            "IL"
        ];
    }

    return (
        <div className='mt-8'>
            Profile Management
            <div className='mt-6'>
                <form className='space-y-6'>
                    <div>
                        <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Username
                        </label>
                        <div className='mt-1'>
                            <input
                                value={username}
                                id='username'
                                name='username'
                                onChange={(e) => setUsername(e.currentTarget.value)}
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Password
                        </label>
                        <div className='mt-1'>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Full Name
                        </label>
                        <div className='mt-1'>
                            <input
                                value={name}
                                id='name'
                                name='name'
                                onChange={(e)=>setName(e.currentTarget.value)}
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='addr1'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Address 1
                        </label>
                        <div className='mt-1'>
                            <input
                                value={addr1}
                                id='addr1'
                                name='addr1'
                                onChange={(e)=>setAddr1(e.currentTarget.value)}
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='addr2'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Address 2
                        </label>
                        <div className='mt-1'>
                            <input
                                value={addr2}
                                id='addr2'
                                name='addr2'
                                onChange={(e)=>setAddr2(e.currentTarget.value)}
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='city'
                            className='block text-sm font-medium text-gray-700'
                        >
                            City
                        </label>
                        <div className='mt-1'>
                            <input
                                value={city}
                                id='city'
                                name='city'
                                onChange={(e)=>setCity(e.currentTarget.value)}
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const IndexPage = () => {
    return (
        <div className='bg-fuel h-screen'>
            <div className='h-full container mx-auto flex justify-center items-center'>
                <div className=' w-full h-full sm:h-auto sm:w-1/2 md:1/3 bg-white  rounded-lg'>
                    <div className='p-10'>
                        <ProfileManagement />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndexPage
