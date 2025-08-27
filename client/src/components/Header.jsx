import React, { useState, useEffect, Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { fetchCart } from '../redux/slices/cartSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.categories);
    const { items: cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        if (user) {
            dispatch(fetchCategories());
            dispatch(fetchCart());
        }
    }, [user, dispatch]);



    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(true);


    let linkTo = "/auth"; // Default: not logged in
    if (user) {
        if (user.role === "admin") linkTo = "/admin/dashboard";
        else linkTo = "/user/profile";
    }

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [sidebarOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();

        if (location.pathname !== '/') {
            // Navigate to home page first with hash, then scroll will happen on load
            navigate('/#' + sectionId);
        } else {
            // Already on homepage, scroll smoothly
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <header className='w-full sticky top-0 flex justify-between items-center px-2 py-4 md:px-10 bg-white z-50 uppercase'>
            <div className="flex">
                <button onClick={toggleSidebar} className="md:hidden">
                    MENU
                </button>
                <nav className="hidden md:flex items-center gap-4">
                    <Link to="/" className="hover:text-orange-600">Home</Link>
                    <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="group inline-flex justify-center hover:hover:text-orange-600 focus:outline-none">
                            ALL COLLECTIONS
                            <FaAngleDown
                                aria-hidden="true"
                                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute left z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                {items.map((option) => (
                                    <MenuItem key={option.name}>
                                        <Link
                                            to={`/collections/${option.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={classNames(
                                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                                            )}
                                        >
                                            {option.name}
                                        </Link>
                                    </MenuItem>
                                ))}
                            </div>
                        </MenuItems>
                    </Menu>
                    <a href="#latest-section" onClick={e => scrollToSection(e, 'latest-section')} className="hover:text-orange-600">Latest</a>
                    <a href="#popular-section" onClick={e => scrollToSection(e, 'popular-section')} className="hover:text-orange-600">Popular</a>
                </nav>
            </div>

            <div className="flex items-center gap-4 relative lg:-left-26">
                <Link to="/" className="text-xl font-bold">MRITTIKA</Link>
                {/* <img src="/logo.png" alt="Logo" className="" /> */}
            </div>

            <div className="flex items-center gap-4">
                <Link to="/cart" className="relative hover:text-orange-600">
                    Cart ({cartItems?.length || 0})
                </Link>
                <Link to={linkTo} className="hover:text-orange-600 hidden md:block">
                    {user ? user.name : "Log in"}
                </Link>
            </div>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            >
                <div
                    className={`absolute top-0 left-0 w-80 h-full bg-orange-50 p-4 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={toggleSidebar}
                        className="w-full flex justify-end mb-4"
                        aria-label="Close menu"
                    >
                        CLOSE
                    </button>
                    <nav id="mobile-menu" className="flex flex-col gap-4 text-base font-semibold">
                        <Link to="/" onClick={toggleSidebar} className="border-b border-orange-400 pb-1">Home</Link>
                        <Link onClick={() => setOpenDropdown(!openDropdown)} className="border-b flex justify-between items-center border-orange-400 pb-1">
                            All Collections
                            {openDropdown ? <FaAngleUp /> : <FaAngleDown />}
                        </Link>
                        {openDropdown && <div className="">
                            <div className="grid grid-cols-2 gap-2 my-2 text-sm">
                                {items.map(({ name, image }, index) => (
                                    <Link
                                        key={index}
                                        to={`/collections/${name.toLowerCase().replace(/\s+/g, '-')}`}
                                        onClick={toggleSidebar}
                                        className="flex flex-col items-center gap-2 font-"
                                    >
                                        <img src={image} alt={name} className="h-28 w-28 rounded-lg" />
                                        <span>{name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>}
                        <a href="#latest-section" onClick={toggleSidebar} className="border-b border-orange-400 pb-1">Latest</a>
                        <a href="#popular-section" onClick={toggleSidebar} className="border-b border-orange-400 pb-1">Popular</a>
                        <Link to="/about" onClick={toggleSidebar} className="border-b border-orange-400 pb-1">About</Link>
                        <Link to={linkTo} onClick={toggleSidebar} className="border-b border-orange-400 pb-1">{user ? user.name : "Log in"}</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
