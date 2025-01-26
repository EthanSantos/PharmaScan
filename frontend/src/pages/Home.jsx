import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { PillIcon, CameraIcon, LogOutIcon } from "lucide-react";

const HomePage = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || user.email?.split('@')[0] || "User");
        }
    }, []);

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate("/signin");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                {/* Greeting Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Hello, <span className="text-blue-600">{userName}!</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your medications with ease and precision
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/upload"
                        className="flex flex-col items-center justify-center p-5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group"
                    >
                        <PillIcon 
                            className="w-10 h-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" 
                            strokeWidth={1.5} 
                        />
                        <span className="text-blue-800 font-semibold">
                            Pills Database
                        </span>
                    </Link>

                    <Link
                        to="/camera"
                        className="flex flex-col items-center justify-center p-5 bg-green-50 hover:bg-green-100 rounded-xl transition-all group"
                    >
                        <CameraIcon 
                            className="w-10 h-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" 
                            strokeWidth={1.5} 
                        />
                        <span className="text-green-800 font-semibold">
                            Open Camera
                        </span>
                    </Link>
                </div>

                {/* Logout Button */}
                <div className="text-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors group"
                    >
                        <LogOutIcon 
                            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
                            strokeWidth={2} 
                        />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;