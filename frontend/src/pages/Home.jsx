import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Pill Manager</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-md">
                Manage your pills with ease. Upload images of pills to store them with details, or use the camera feature to capture new images.
            </p>
            <div className="flex space-x-6">
                <Link
                    to="/upload"
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
                >
                    Go to Upload Page
                </Link>
                <Link
                    to="/camera"
                    className="bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
                >
                    Go to Camera Page
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
