import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProviderDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/provider", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Access denied"));
  }, []);

  return (
    <div className="text-7xl text-center my-10">
      <h2>{message}</h2>
    </div>
  );
};

export default ProviderDashboard;
