import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const AccountManagementLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-full">
            {/* Sidebar Container */}
            <div className="relative md:w-64">
                {/* Sidebar */}
                <div
                    className={`absolute w-60 top-0 left-0 z-40 h-full bg-[hsl(0,0,100)] dark:bg-black  border-r border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] flex flex-col p-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-lg font-semibold">Account Management</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="dark:text-white text-black focus:outline-none"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <h2 className="hidden md:block text-lg font-semibold mb-6">Account Management</h2>
                    <nav className="flex flex-col space-y-2">
                        <NavLink
                            key={""}
                            to=""
                            end
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-white dark:bg-[hsl(0,0,15)]' : ''}`
                            }
                        >
                            General
                        </NavLink>
                        <NavLink
                            key={"publication"}
                            to="publication"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-white dark:bg-[hsl(0,0,15)]' : ''}`
                            }
                        >
                            Publication
                        </NavLink>
                        <NavLink
                            key="addresearchpaper"
                            to="addresearchpaper"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-white dark:bg-[hsl(0,0,15)]' : ''}`
                            }
                        >
                            Add Research Paper
                        </NavLink>
                        
                    </nav>
                </div>
                {
                    !isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-4 left-5 z-50 text-gray-800 dark:text-white bg-white dark:bg-black p-2 rounded-md shadow-md md:hidden"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    )
                }
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AccountManagementLayout;
