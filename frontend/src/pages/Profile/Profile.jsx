import React, { useEffect } from 'react';
import axios from 'axios';

function Profile() {

    const [user, setUser] = React.useState({});
    const [err, setErr] = React.useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setUser(res.data))
            .catch(() => setErr("Access denied"));
    }, []);

    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className='bg-blue-600 py-1 px-2 m-1 text-2xl rounded-xl'>Profile</h1>
            {err && <p className='text-red-500'>{err}</p>}
            {
                user &&
                <div className='bg-blue-200 p-5 m-3 text-xl rounded-2xl'>

                    <h2>Name: {user.name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Phone Number: {user.phoneNumber}</p>
                    <p>Address: {user.address ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zip}` : "Not provided"}</p>
                </div>
            }
        </div>
    )
};

export default Profile;
