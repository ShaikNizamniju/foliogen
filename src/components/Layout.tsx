
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Briefcase, Wallet, Clock } from 'lucide-react';

const Layout = () => {
    const navItems = [
        {
            to: '/career',
            icon: Briefcase,
            label: 'Career',
            activeColor: 'text-yellow-400',
            glowColor: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]',
            borderColor: 'border-yellow-500',
            activeBg: 'bg-yellow-500/10'
        },
        {
            to: '/wealth',
            icon: Wallet,
            label: 'Wealth',
            activeColor: 'text-red-400',
            glowColor: 'shadow-[0_0_15px_rgba(248,113,113,0.5)]',
            borderColor: 'border-red-500',
            activeBg: 'bg-red-500/10'
        },
        {
            to: '/chronos',
            icon: Clock,
            label: 'Chronos',
            activeColor: 'text-blue-400',
            glowColor: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]',
            borderColor: 'border-blue-500',
            activeBg: 'bg-blue-500/10'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* Glassmorphism Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 z-50
        bg-slate-900/30 backdrop-blur-md border-r border-slate-800">

                <div className="mb-8 p-2 bg-slate-800 rounded-lg">
                    {/* Logo Placeholder or App Icon */}
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md" />
                </div>

                <nav className="flex flex-col space-y-6 w-full px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `
                p-3 rounded-xl transition-all duration-300 group relative flex justify-center
                ${isActive
                                    ? `${item.activeBg} ${item.activeColor} ${item.glowColor} border ${item.borderColor}`
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
              `}
                        >
                            <item.icon size={24} strokeWidth={2} />

                            {/* Tooltip on Hover */}
                            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                                {item.label}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-20 p-4 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
