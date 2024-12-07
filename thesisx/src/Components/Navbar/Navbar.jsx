import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BellIcon, UserCircleIcon, Bars3Icon, XMarkIcon, UserIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Dropdown, { DropdownItem } from "../Dropdown/Dropdown";


const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const SignOut = () =>{
        localStorage.removeItem("authToken");
        navigate("/signin")
    }
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <nav className="bg-[hsl(220,15%,95%)] dark:bg-[hsl(0,0%,10%)] shadow-md relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 z-0">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <NavLink
                            to="/"
                            className="text-xl font-bold"
                        >
                            thesis X
                        </NavLink>
                    </div>

                    {/* Center: Navigation Links (Hidden on small screens) */}
                    <div className="hidden md:flex items-center text-[hsl(0,0,10%)] dark:text-[hsl(0,0,90%)]">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/thesis", label: "Thesis" },
                            { to: "/supervisors", label: "Supervisors" },
                            { to: "/appointments", label: "Appointments" },
                        ].map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    ` px-4 py-[6px] rounded-full hover:text-[hsl(18,73%,30%)] dark:hover:text-[hsl(18,73%,70%)] transition duration-300 ${
                                        isActive ? " text-[hsl(18,73%,30%)] dark:text-[hsl(18,73%,70%)] bg-[hsl(220,15%,85%)] dark:bg-[hsl(220,15%,15%)]" : ""
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right: Notification & Profile Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            className="text-[hsl(220, 15%, 40%)] hover:text-[hsl(220, 50%, 40%)] transition duration-300"
                            aria-label="Notifications"
                        >
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <Dropdown trigger={
                            <button
                                className="text-[hsl(220, 15%, 40%)] hover:text-[hsl(220, 50%, 40%)] transition duration-300"
                                aria-label="Profile"
                            >
                                <UserCircleIcon className="w-6 h-6" />
                            </button>
                        }>
                            <DropdownItem>
                                <UserIcon className="w-4 h-4"/>
                                <Link to={"/profile"}>My Profile</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Cog6ToothIcon className="w-4 h-4"/>
                                <Link to={"/accountmanagement"}>Account Management</Link>
                            </DropdownItem>
                            <DropdownItem onPress = {SignOut}>
                                <ArrowRightStartOnRectangleIcon className="w-4 h-4"/>
                                <p>Sign Out</p>
                            </DropdownItem>
                        </Dropdown>
                    </div>

                    {/* Hamburger Menu (Visible on small screens) */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleSidebar}
                            className="text-[hsl(220, 15%, 40%)] hover:text-[hsl(220, 50%, 40%)] transition duration-300"
                            aria-label="Menu"
                        >
                            {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar (Responsive) */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-[hsl(220,10%,95%)] z-50 shadow-lg transform ${
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 md:hidden`}
            >
                <div className="flex flex-col h-full">
                    <button
                        onClick={toggleSidebar}
                        className="text-[hsl(220, 15%, 40%)] p-4 self-end hover:text-[hsl(220, 50%, 40%)]"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col space-y-4 mt-6 px-6">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/thesis", label: "Thesis" },
                            { to: "/supervisors", label: "Supervisors" },
                            { to: "/appointments", label: "Appointments" },
                        ].map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `text-[hsl(220, 15%, 40%)] hover:text-[hsl(220, 50%, 40%)] transition duration-300 ${
                                        isActive ? "font-bold text-[hsl(220, 50%, 40%)]" : ""
                                    }`
                                }
                                onClick={toggleSidebar} // Close sidebar on link click
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

