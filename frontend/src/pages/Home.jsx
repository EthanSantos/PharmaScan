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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Logout Button in Top Right */}
            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center"
            >
                <LogOutIcon className="w-5 h-5 mr-2" />
                Logout
            </button>

            <div className="w-full max-w-md text-center mb-8">
                {/* Greeting */}
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                    Hello, <span className="text-blue-600">{userName}!</span>
                </h1>
                <p className="text-gray-500 mt-4 text-lg">
                    Medication Tracker
                </p>
            </div>

            <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <Link 
                        to="/upload"
                        className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                    >
                        <div className="bg-blue-50 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <PillIcon 
                                className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" 
                                strokeWidth={1.5} 
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Pill Database
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Manage your medications
                        </p>
                    </Link>

                    <Link 
                        to="/camera"
                        className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                    >
                        <div className="bg-green-50 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <CameraIcon 
                                className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" 
                                strokeWidth={1.5} 
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Scan Pill
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Identify medications
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;