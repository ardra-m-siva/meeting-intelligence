import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className='flex min-h-screen bg-slate-950 text-slate-200'>
            <div className='w-60'>
                <Sidebar />
            </div>
            {/* navbar */}
            <div className='flex-1 p-8'>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout