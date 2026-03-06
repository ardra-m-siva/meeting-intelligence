import React from 'react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    function NavItem({ to, label ,icon}) {
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
                <i className={`${icon} me-2`}></i>
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
                    <NavItem to="/" label="Dashboard" icon='fa-solid fa-chart-line' />
                    <NavItem to="/upload" label="Upload" icon='fa-solid fa-file-export' />
                    <NavItem to="/meetings" label="Meetings" icon='fa-solid fa-handshake' />
                    <NavItem to="/chat" label="Chatbot" icon='fa-solid fa-comments' />
                    <NavItem to="/sentiment" label="Sentiment" icon='fa-solid fa-face-grin' />
                </nav>
            </div>
        </>
    )
}

export default Sidebar