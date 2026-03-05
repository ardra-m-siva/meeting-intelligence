import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const MainLayout = () => {
    return (
        <div className='flex min-h-screen bg-slate-950 text-slate-200'>
            <div className='w-60 fixed left-0 top-0 h-screen'>
                <Sidebar />
            </div>
            {/* Main Content */}
            <div className='flex-1 ml-60 p-8 overflow-y-auto'>
                <Outlet />
            </div>
            <ToastContainer />
        </div>
    )
}

export default MainLayout