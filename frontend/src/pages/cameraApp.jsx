import { useState } from "react";
import { useNavigate } from 'react-router-dom';
export default function CameraApp() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medication, setMedication] = useState("");

    const handleSubmit = () => {
        if (medication === "") {
            alert('insert a value')
        } else {
            navigate('/compare');
            setIsModalOpen(false);
            setMedication("");
        }
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
                <button className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition" onClick={() => setIsModalOpen(true)}>
                    Capture
                </button>
            </div>

            {isModalOpen && (
    <>
        {/* Modal background overlay */}
        <div 
            className="fixed inset-0 bg-black opacity-50 z-40" 
            onClick={() => setIsModalOpen(false)}
        ></div>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Medication</h2>
                <input
                    type="text"
                    placeholder="Medication name"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleSubmit();
                        }}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </>
)}

        </div>
    );
};


