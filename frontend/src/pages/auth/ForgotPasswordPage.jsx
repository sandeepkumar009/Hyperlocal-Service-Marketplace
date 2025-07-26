import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Password reset requested for:", email);
        setMessage('If an account with that email exists, a password reset link has been sent.');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h1>
                {message ? (
                    <p className="text-green-600 text-center">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Enter your email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                )}
                <p className="text-sm text-center text-gray-600">
                    Remember your password? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
