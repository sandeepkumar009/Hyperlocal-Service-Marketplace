import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';

const UserDashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Access denied"));
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <h2 className="text-7xl text-center my-10">{message}</h2>
      <button
        className='bg-blue-600 p-2 m-3 text-white rounded-2xl font-bold text-2xl hover:cursor-pointer'
        onClick={() => navigate("/userDashboard/profile")}
      >
        View Profile
      </button>
      <Outlet />
    </div>
  );
};

export default UserDashboard;
