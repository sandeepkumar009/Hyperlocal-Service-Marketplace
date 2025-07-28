import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} onClick={onClick} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}>
            {children}
        </Link>
    );
};

const Navbar = () => {
    const { isAuthenticated, user, logout, apiClient } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await apiClient.get('/api/categories');
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, [apiClient]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsMenuOpen(false); 
        navigate(`/services?q=${searchTerm}&category=${selectedCategory}`);
    };
    
    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'admin': return '/dashboard/admin';
            case 'provider': return '/dashboard/provider';
            default: return '/dashboard/user';
        }
    }

    const isUserOrGuest = !isAuthenticated || user?.role === 'user';

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to={isUserOrGuest ? "/" : getDashboardLink()} className="text-2xl font-bold text-indigo-600">
                        UrbanEase
                    </Link>

                    {isUserOrGuest && (
                        <div className="hidden md:flex flex-grow max-w-xl mx-4">
                            <form onSubmit={handleSearch} className="flex w-full">
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                                <input type="text" placeholder="Search for services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700">Search</button>
                            </form>
                        </div>
                    )}

                    <div className="hidden md:flex items-center space-x-2">
                        {isUserOrGuest && (
                            <>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/services">Services</NavLink>
                            </>
                        )}
                        {isAuthenticated ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}`} onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_API_BASE_URL}/uploads/profilePictures/default-avatar.png`}} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 border-b"><p className="text-sm font-medium text-gray-900 truncate">{user.name}</p><p className="text-sm text-gray-500 truncate">{user.email}</p></div>
                                        <Link to={getDashboardLink()} onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-indigo-600">Login</Link>
                                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Register</Link>
                            </>
                        )}
                    </div>
                    
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu with Category Selector */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {isUserOrGuest && (
                            <form onSubmit={handleSearch} className="space-y-2">
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"/>
                                <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md">Search</button>
                            </form>
                        )}
                        {isUserOrGuest && (
                            <>
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
                                <Link to="/services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Services</Link>
                            </>
                        )}
                        {isAuthenticated ? (
                             <>
                                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 text-center">Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
