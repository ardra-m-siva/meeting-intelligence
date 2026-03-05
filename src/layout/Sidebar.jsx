import React from 'react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    function NavItem({ to, label }) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm transition 
        ${isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                }
            >
                {label}
            </NavLink>
        );
    }
    return (
        <>
            <div className="h-screen w-60 bg-slate-900 text-slate-200 fixed left-0 top-0 p-6">
                <h1 className="text-lg font-bold mb-8 text-blue-500">
                    Menu
                </h1>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-3">
                    <NavItem to="/" label="Dashboard" />
                    <NavItem to="/upload" label="Upload" />
                    <NavItem to="/meetings" label="Meetings" />
                    <NavItem to="/chat" label="Chatbot" />
                    <NavItem to="/sentiment" label="Sentiment" />
                </nav>
            </div>
        </>
    )
}

export default Sidebar