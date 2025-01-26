import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
    LogOutIcon,
    PillIcon,
    CameraIcon,
    HomeIcon,
} from "lucide-react";

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            navigate("/signin");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <aside
            className="
        hidden 
        md:flex 
        flex-col 
        w-64 
        bg-white 
        border-r 
        border-gray-200
        sticky 
        top-0 
        h-screen
      "
        >
            {/* Brand / App Title */}
            <div className="h-16 flex items-center px-4">
                <h1 className="text-xl font-semibold text-blue-600">PharmaScan</h1>
            </div>

            {/* Small horizontal line under PharmaScan */}
            <div className="px-4">
                <div className="border-b border-gray-200 mb-2" />
            </div>

            {/*
        1) NAV LINKS go in a scrollable container flex-1 
           so if they exceed the height, you can scroll.
      */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        "flex items-center py-2 px-3 rounded transition-colors " +
                        (isActive
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700")
                    }
                >
                    <HomeIcon className="w-4 h-4 mr-2" color="currentColor" />
                    Home
                </NavLink>

                <NavLink
                    to="/upload"
                    className={({ isActive }) =>
                        "flex items-center py-2 px-3 rounded transition-colors " +
                        (isActive
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700")
                    }
                >
                    <PillIcon className="w-4 h-4 mr-2" color="currentColor" />
                    Pill Database
                </NavLink>

                <NavLink
                    to="/camera"
                    className={({ isActive }) =>
                        "flex items-center py-2 px-3 rounded transition-colors " +
                        (isActive
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700")
                    }
                >
                    <CameraIcon className="w-4 h-4 mr-2" color="currentColor" />
                    Scan Pill
                </NavLink>
            </nav>

            {/*
        2) Logout pinned at the bottom 
           by virtue of the parent being flex-col h-screen + sticky.
      */}
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-black inline-flex items-center"
                >
                    <LogOutIcon className="w-4 h-4 mr-1" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default NavBar;
