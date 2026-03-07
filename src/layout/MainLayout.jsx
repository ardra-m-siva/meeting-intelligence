import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify'


const MainLayout = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarWidth = collapsed ? "w-16" : "w-60";
    const contentMargin = collapsed ? "md:ml-16" : "md:ml-60";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">

            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center p-4 bg-slate-900 border-b border-slate-800">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-xl"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <h1 className="ml-4 font-semibold">Meeting Hub</h1>
            </div>

            {/* Sidebar */}
            <div
                className={`
        fixed left-0 top-0 h-screen ${sidebarWidth}
        bg-slate-900 border-r border-slate-800
        transition-all duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        `}
            >
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            {/* Main Content */}
            <div
                className={`
        ${contentMargin}
        p-6
        h-screen
        overflow-y-auto
        transition-all duration-300
        `}
            >
                <Outlet />
            </div>
            <ToastContainer />
        </div>
    );
};

export default MainLayout;