import React, { useState, useEffect } from 'react';
import CommonLayout from '../../layout/CommonLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, resetAuthState } from '../../redux/slices/authSlice';

export default function LoginPage() {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [activeAuthMode, setActiveAuthMode] = useState("login");
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error, success } = useSelector((state) => state.auth);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeAuthMode === "login") {
            dispatch(login({ email: formData.email, password: formData.password }));
        } else {
            dispatch(register({ name: formData.name, email: formData.email, password: formData.password, mobile: formData.mobile }));
            navigate('/');
        }
    };

    // Redirect if logged in
    useEffect(() => {
        if (user && user.role) {
            if (user.role === "admin") {
                navigate('/admin/dashboard');
            } else if (user.role === "user") {
                navigate(from, { replace: true });
            }
        }
    }, [user, navigate, from]);


    // Reset error/success state on mode change
    useEffect(() => {
        dispatch(resetAuthState());
    }, [activeAuthMode, dispatch]);

    return (
        <CommonLayout>
            {/* LOGIN */}
            {activeAuthMode === "login" && (
                <div className="flex flex-col md:flex-row gap-8 items-center divide-y md:divide-x md:divide-y-0 divide-gray-200 my-10">
                    <div className="w-full md:w-1/2 md:pr-8 space-y-4 pb-10 md:pb-0">
                        <h1 className="text-2xl font-bold mb-4">Login</h1>
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                                <div className="border border-gray-200 rounded-md p-2 flex items-center gap-2">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <Link to="/forgot-password" className="pt-6 hover:text-orange-700">Forgot Password?</Link>
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">New to MRITTIKA?</h2>
                        <p className="mb-4">Create an account to enjoy exclusive offers and faster checkout.</p>
                        <button
                            onClick={() => setActiveAuthMode("register")}
                            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}

            {/* REGISTER */}
            {activeAuthMode === "register" && (
                <div className="flex flex-col md:flex-row gap-8 items-center divide-y md:divide-x md:divide-y-0 divide-gray-200 my-10">
                    <div className="w-full md:w-1/2 md:pr-8 space-y-4 pb-10 md:pb-0">
                        <h1 className="text-2xl font-bold mb-4">Register</h1>
                        {error && <p className="text-red-500">{error}</p>}
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="mobile" className="block text-sm font-medium mb-2">Mobile</label>
                                <input
                                    type="text"
                                    id="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                                <div className="border border-gray-200 rounded-md p-2 flex items-center gap-2">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Already have an account?</h2>
                        <p className="mb-4">Login to access your account and manage your orders.</p>
                        <button
                            onClick={() => setActiveAuthMode("login")}
                            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
        </CommonLayout>
    );
}
