import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, isAuthenticated } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); 
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('email', formData.email);
        submissionData.append('phoneNumber', formData.phoneNumber);
        submissionData.append('password', formData.password);
        submissionData.append('role', formData.role);
        if (profilePicture) {
            submissionData.append('profilePicture', profilePicture);
        }

        try {
            await register(submissionData);
            navigate('/'); 
        } catch (err) {
            setError(err);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
                {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phoneNumber" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Register as</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500">
                            <option value="user">User</option>
                            <option value="provider">Service Provider</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
                        <input type="file" name="profilePicture" onChange={handleFileChange} className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                             {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
