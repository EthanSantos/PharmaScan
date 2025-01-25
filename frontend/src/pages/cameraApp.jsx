import { useState } from "react";

export default function CameraApp() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medication, setMedication] = useState("");

    const handleSubmit = () => {
        alert(`Medication entered: ${medication}`);
        setIsModalOpen(false);
        setMedication("");
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-width">
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Camera</h1>
                    <div className="mt-4 h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Camera Feed</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <button className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition">
                    Start Camera
                </button>
                <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition">
                    Stop Camera
                </button>
                <button className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition">
                    Capture
                </button>
            </div>
        </div>
    );
};

export default CameraApp;


