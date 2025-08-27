import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    MdOutlineMenu,
    MdClose,
    MdNotifications,
    MdLogout,
    MdOutlineDashboard,
    MdOutlineCategory,
} from "react-icons/md";
import { LuPackage, LuUserRound } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../redux/slices/authSlice";
import ConfirmationModal from "../components/ConfirmationModal";

export default function AdminLayout({ children }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth");
    };

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
    }, [sidebarOpen]);

    const getInitials = (fullName) =>
        fullName
            ?.split(" ")
            .map((word) => word[0]?.toUpperCase())
            .join("");

    const navItems = [
        { path: "/admin/dashboard", icon: <MdOutlineDashboard />, label: "Dashboard" },
        { path: "/admin/category", icon: <MdOutlineCategory />, label: "Category" },
        { path: "/admin/product", icon: <AiOutlineProduct />, label: "Products" },
        { path: "/admin/orders", icon: <LuPackage />, label: "Orders" },
        { path: "/admin/users", icon: <LuUserRound />, label: "Users" },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="hidden md:flex md:w-64 flex-col bg-neutral-900 text-gray-200 shadow-lg">
                <div className="px-2 md:px-4 py-3 border-b border-neutral-700">
                    <Link to="/" className="text-2xl font-bold text-orange-500">
                        MRITTIKA
                    </Link>
                </div>
                <nav className="flex flex-col p-4 gap-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${location.pathname === item.path
                                ? "bg-orange-600 text-white shadow-md"
                                : "hover:bg-neutral-800 hover:text-white"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={toggleSidebar}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-neutral-900 text-gray-200 p-4 transform z-50 transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="text-xl font-semibold text-orange-500">
                        MRITTIKA
                    </Link>
                    <button onClick={toggleSidebar}>
                        <MdClose size={24} className="text-white" />
                    </button>
                </div>
                <nav className="flex flex-col gap-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={toggleSidebar}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${location.pathname === item.path
                                ? "bg-orange-600 text-white"
                                : "hover:bg-neutral-800 hover:text-white"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 bg-white border-b border-neutral-200 flex justify-between items-center px-2 md:px-4 py-3 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden text-gray-700"
                            aria-label="Toggle menu"
                        >
                            <MdOutlineMenu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-700">
                            Welcome, {user?.name || "Admin"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setNotificationDropdownOpen(!notificationDropdownOpen);
                                setProfileDropdownOpen(false);
                            }}
                            className="relative text-gray-600 hover:text-orange-600"
                        >
                            <MdNotifications size={22} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => {
                                setProfileDropdownOpen(!profileDropdownOpen);
                                setNotificationDropdownOpen(false);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold"
                        >
                            {getInitials(user?.name || "A")}
                        </button>
                    </div>
                </header>

                {/* Dropdowns */}
                {profileDropdownOpen && (
                    <div onClick={() => setProfileDropdownOpen(false)} className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 bg-opacity-40">
                        <div className="absolute right-6 top-14 divide-y divide-neutral-200 w-56 bg-white rounded-lg shadow-xl z-50">
                            <div className="p-4 bg-gray-50 text-center">
                                <p className="font-medium">{user?.name}</p>
                                <span className="text-sm text-gray-500">{user?.email}</span>
                            </div>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                                <LuUserRound /> Profile
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full flex items-center mb-2 gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <MdLogout /> Logout
                            </button>
                        </div>
                    </div>
                )}

                <ConfirmationModal
                    isOpen={isModalOpen}
                    title="Logout"
                    message="Are you sure you want to logout?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsModalOpen(false)}
                />

                {notificationDropdownOpen && (
                    <div onClick={() => setNotificationDropdownOpen(false)} className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 bg-opacity-40">
                        <div className="absolute right-16 top-14 w-64 divide-y divide-neutral-200 bg-white rounded-md shadow-xl z-50">
                            <div className="p-3 bg-gray-50 font-medium">Notifications</div>
                            <div className="max-h-48 overflow-y-auto">
                                <p className="px-4 py-2 text-sm text-gray-600">No new notifications</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-2 md:p-4">{children}</main>

                {/* Footer */}
                <footer className="bg-white border-t border-neutral-200 px-2 py-3 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} MRITTIKA — Admin Panel
                </footer>
            </div>
        </div>
    );
}
