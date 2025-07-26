import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;

    if (userInfoFromStorage) {
      setUser(userInfoFromStorage);
      setIsAuthenticated(true);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userInfoFromStorage.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
        const { data } = await apiClient.post('/api/users/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
  };
  
  const register = async (formData) => {
    try {
      const { data } = await apiClient.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  const updateUserContext = (updatedData) => {
      localStorage.setItem('userInfo', JSON.stringify(updatedData));
      setUser(updatedData);
  }

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUserContext, apiClient }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
