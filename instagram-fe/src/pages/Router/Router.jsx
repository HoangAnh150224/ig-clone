import React from 'react'
import SideBar from '../../components/SideBar'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../HomePage/HomePage'
import Profile from '../Profile/Profile'

const Router = () => {
    return (
        <div>
            <div className='flex'>
                <div className='w-[20%] border border-1-slate-500'>
                    <SideBar />
                </div>
                <div className='w-full'>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/profile' element={<Profile />} />
                    </Routes>
                </div>
            </div>

        </div>
    )
}

export default Router