import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const RoleBasedRedirect = ({ children }) => {
    const { isAuthenticated, user } = useAppContext();

    if (isAuthenticated && (user.role === 'provider' || user.role === 'admin')) {
        const dashboardPath = user.role === 'provider' ? '/dashboard/provider' : '/dashboard/admin';
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default RoleBasedRedirect;
