//TODO: State proper selector.
// import TestConnect from '../components/TestConnect'

import { useState } from 'react'

const ProfileManagement = () => {
    const [name, setName] = useState('')
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')

    const profMan = () => {
        // TODO: Send info to the backend for verifcation
        // TODO: Set UI to loading state
    }

    const states = {
        AL: "Alabama",
        AK: "Alaska",
        AS: "American Samoa",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        DC: "District Of Columbia",
        FM: "Federated States Of Micronesia",
        FL: "Florida",
        GA: "Georgia",
        GU: "Guam",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MH: "Marshall Islands",
        MD: "Maryland",
        MA: "Massachusetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        MP: "Northern Mariana Islands",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PW: "Palau",
        PA: "Pennsylvania",
        PR: "Puerto Rico",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VI: "Virgin Islands",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming"
    };

    return (
        <div className='mt-8'>
            Profile Management
            <div className='mt-6'>
                <form className='space-y-6'>
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
                                onChange={(e) => setName(e.currentTarget.value)}
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
                                onChange={(e) => setAddr1(e.currentTarget.value)}
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
                                onChange={(e) => setAddr2(e.currentTarget.value)}
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
                                onChange={(e) => setCity(e.currentTarget.value)}
                                required
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor='state'
                            className='block text-sm font-medium text-gray-700'
                        >
                            State
                        </label>
                        <select onChange={(e) => setState(e.currentTarget.value)} required>
                            <option value=""></option>
                            {Object.keys(states).map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='zipCode'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Zip Code
                        </label>
                        <div className='mt-1'>
                            <input
                                value={zipCode}
                                id='zipCode'
                                name='zipCode'
                                onChange={(e) => setZipCode(e.currentTarget.value)}
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
