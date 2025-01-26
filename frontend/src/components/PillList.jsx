import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseConfig";
import PillCard from "./PillCard";

const PillList = ({ newPill, searchTerm }) => {
    const [pills, setPills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPill, setSelectedPill] = useState(null);
    const pillsPerPage = 9;

    useEffect(() => {
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

        fetchPills();
    }, []);

    useEffect(() => {
        if (newPill) {
            setPills((prevPills) => [newPill, ...prevPills]);
        }
    }, [newPill]);

    const filteredPills = pills.filter((pill) =>
        pill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPill = currentPage * pillsPerPage;
    const indexOfFirstPill = indexOfLastPill - pillsPerPage;
    const currentPills = filteredPills.slice(indexOfFirstPill, indexOfLastPill);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (pill) => {
        setSelectedPill(pill);
    };

    const closeModal = () => {
        setSelectedPill(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-700 text-lg"
                >
                    Loading pills...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {filteredPills.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No pills found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentPills.map((pill) => (
                            <div
                                key={pill.id}
                                onClick={() => openModal(pill)}
                                className="cursor-pointer"
                            >
                                <PillCard name={pill.name} imageUrl={pill.image_url} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    {Array.from({ length: Math.ceil(filteredPills.length / pillsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {selectedPill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={closeModal} // Close when clicking outside the modal
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {selectedPill.name}
                            </h2>
                            <div className="relative w-full pt-[56.25%] mb-4">
                                <img
                                    src={selectedPill.image_url || "/placeholder.svg"}
                                    alt={selectedPill.name}
                                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <p className="text-gray-700 text-sm">{selectedPill.description}</p>
                            <button
                                onClick={closeModal}
                                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PillList;
