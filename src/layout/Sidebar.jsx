import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {

    const NavItem = ({ to, label, icon }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center py-2 rounded-lg transition-all duration-200
        ${collapsed ? "justify-center" : "px-4"}
        ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
            }
        >
            <i className={`${icon} ${collapsed ? "" : "mr-3"}`}></i>
            {!collapsed && label}
        </NavLink>
    );

    return (
        <div
            className={`h-screen bg-slate-900 text-white fixed left-0 top-0 transition-all duration-300 ${collapsed ? "w-20" : "w-60"
                } p-4`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">

                {!collapsed && (
                    <h1 className="text-lg font-bold text-blue-500">
                        Meeting Hub
                    </h1>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-white text-xl p-2 hover:bg-slate-700 rounded"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-3">
                <NavItem to="/" label="Dashboard" icon="fa-solid fa-chart-line" />
                <NavItem to="/upload" label="Upload" icon="fa-solid fa-file-export" />
                <NavItem to="/meetings" label="Meetings" icon="fa-solid fa-handshake" />
                <NavItem to="/chat" label="Chatbot" icon="fa-solid fa-comments" />
                <NavItem to="/sentiment" label="Sentiments" icon="fa-solid fa-face-grin" />
            </nav>
        </div>
    );
};

export default Sidebar;