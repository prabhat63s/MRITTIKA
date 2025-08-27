import React, { useEffect, useState } from 'react';
import CommonLayout from '../../layout/CommonLayout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const API_BASE = "http://localhost:8080/api/users"; // adjust to your backend URL

    // Reset error message whenever step changes
    useEffect(() => {
        setError('');
    }, [step]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email.');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE}/forgot-password/send-otp`, { email });
            setSuccessMsg(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE}/forgot-password/verify-otp`, { email, otp });
            setSuccessMsg(res.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setError('Please fill out both password fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE}/forgot-password/reset-password`, { email, password });
            setSuccessMsg(res.data.message || 'Password updated successfully! You can now log in.');
            setEmail('');
            setOtp('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating password.');
        }
    };

    return (
        <CommonLayout>
            <div className="flex flex-col items-center justify-center my-20">
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

                {step === 1 && (
                    <>
                        <p className="mb-4">Enter your email address to receive an OTP.</p>
                        <form onSubmit={handleEmailSubmit} className="w-full max-w-sm">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                placeholder="Email address"
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button type="submit" className="mt-4 bg-orange-600 text-white rounded-md p-2 w-full">
                                Send OTP
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="mb-4">Enter the OTP sent to your email.</p>
                        <form onSubmit={handleOtpSubmit} className="w-full max-w-sm">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="border border-gray-200 rounded-md p-2 w-full focus-visible:outline-none"
                                placeholder="OTP"
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button type="submit" className="mt-4 bg-orange-600 text-white rounded-md p-2 w-full">
                                Verify OTP
                            </button>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <>
                        <p className="mb-4">Enter your new password.</p>
                        <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <div className="border border-gray-200 rounded-md p-2 flex items-center gap-2">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="w-full focus-visible:outline-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <div className="border border-gray-200 rounded-md p-2 flex items-center gap-2">
                                    <input
                                        type={confirmPasswordVisible ? "text" : "password"}
                                        className="w-full focus-visible:outline-none"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button type="submit" className="mt-4 bg-orange-600 text-white rounded-md p-2 w-full">
                                Update Password
                            </button>
                        </form>
                    </>
                )}

                {successMsg && <p className="text-green-500 text-sm mt-2">{successMsg}</p>}
            </div>
        </CommonLayout>
    );
}
