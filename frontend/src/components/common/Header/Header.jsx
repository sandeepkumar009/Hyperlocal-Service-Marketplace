import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    const handleDashboard = () => {
        if (user && user.role === "admin")
            navigate("/adminDashboard");
        else if (user && user.role === "provider")
            navigate("/providerDashboard");
        else
            navigate("/userDashboard");
    }

    return (
        <header>
            <nav className="bg-green-200 p-3 flex justify-between">
                <div onClick={() => {navigate("/")}} className="bg-black text-white px-4 py-3 rounded-full cursor-pointer">
                    LOGO
                </div>
                <ul className="flex gap-4 items-center">
                    <li><NavLink to="/" className={({ isActive }) => `${(isActive ? "bg-red-600 text-white" : "bg-green-600")} px-2 py-1 rounded-md`}>
                        Home
                    </NavLink></li>
                    {
                        (!user) ?
                            (<>
                                <li><NavLink to="/login" className={({ isActive }) => `${(isActive ? "bg-red-600 text-white" : "bg-green-600")} px-2 py-1 rounded-md`}>
                                    Login
                                </NavLink></li>
                                <li><NavLink to="/register" className={({ isActive }) => `${(isActive ? "bg-red-600 text-white" : "bg-green-600")} px-2 py-1 rounded-md`}>
                                    Register
                                </NavLink></li>
                            </>)
                            :
                            (<>
                                <li><button onClick={handleDashboard} className="bg-green-600 px-2 py-1 rounded-md hover:bg-red-600 hover:text-white cursor-pointer">
                                    Dashboard
                                </button></li>
                                <li><button onClick={handleLogout} className="bg-green-600 px-2 py-1 rounded-md hover:bg-red-600 hover:text-white cursor-pointer">
                                    Logout
                                </button></li>
                            </>)
                    }
                </ul>
            </nav>
        </header>
    )
};

export default Header;
