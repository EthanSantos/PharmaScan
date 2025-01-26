import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PillForm from "../components/PillForm";
import { supabase } from "../supabaseConfig";

const UploadPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pills, setPills] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fetch pills from Supabase
    const fetchPills = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("pills").select("*");
        if (error) {
            console.error("Error fetching pills:", error);
        } else {
            setPills(data);
        }
        setLoading(false);
    };

    // Fetch pills on component mount
    useEffect(() => {
        fetchPills();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8">Pill Database</h1>
            <div className="mb-6 flex space-x-4">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out shadow-md"
                >
                    Back to Home
                </button>
                <button
                    onClick={openModal}
                    className="bg-blue-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
                >
                    Add Pill
                </button>
            </div>

            {/* Modal for PillForm */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <PillForm closeModal={closeModal} fetchPills={fetchPills} />
                    </div>
                </div>
            )}

            {/* Pill List */}
            <div className="mt-8 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pill List</h2>
                {loading ? (
                    <p className="text-gray-700 text-center">Loading pills...</p>
                ) : pills.length === 0 ? (
                    <p className="text-center text-gray-600">No pills found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pills.map((pill) => (
                            <div
                                key={pill.id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center p-4"
                            >
                                <img
                                    src={pill.image_url}
                                    alt={pill.name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                                <h2 className="text-lg font-medium text-gray-800">{pill.name}</h2>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
