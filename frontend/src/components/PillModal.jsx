import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api"; // Ensure your API client is set up

const PillModal = ({ isOpen, onClose, pill, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false); // State to show/hide confirmation dialog
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    const handleDelete = async () => {
        try {
            await api.delete(`/pills/${pill.id}`); // API endpoint to delete a pill
            onDelete(pill.id); // Notify the parent component about the deletion
            setShowConfirm(false); // Close the confirmation dialog
            onClose(); // Close the main modal
        } catch (error) {
            console.error("Failed to delete pill:", error);
            setErrorMessage("Failed to delete pill. Please try again.");
        }
    };

    const openConfirm = () => setShowConfirm(true); // Show confirmation dialog
    const closeConfirm = () => {
        setShowConfirm(false); // Hide confirmation dialog
        setErrorMessage(""); // Clear error messages
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Static Background Shadow for Main Modal */}
                    <div
                        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
                        onClick={onClose} // Close when clicking outside the modal
                    ></div>

                    {/* Animated Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                            <button
                                onClick={onClose}
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
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {pill.name}
                            </h2>
                            <div className="relative w-full pt-[56.25%] mb-4">
                                <img
                                    src={pill.image_url || "/placeholder.svg"}
                                    alt={pill.name}
                                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <p className="text-gray-700 text-sm">{pill.description}</p>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={openConfirm}
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Confirmation Dialog */}
                            <AnimatePresence>
                                {showConfirm && (
                                    <>
                                        {/* Static Background Shadow for Confirmation */}
                                        <div
                                            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
                                            onClick={closeConfirm} // Close when clicking outside the confirmation dialog
                                        ></div>

                                        {/* Animated Confirmation Box */}
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="fixed inset-0 flex items-center justify-center z-50"
                                        >
                                            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Confirm Deletion
                                                </h3>
                                                <p className="text-sm text-gray-700 mt-2">
                                                    Are you sure you want to delete{" "}
                                                    <span className="font-semibold">
                                                        {pill.name}
                                                    </span>
                                                    ? This action cannot be undone.
                                                </p>
                                                {errorMessage && (
                                                    <p className="text-red-500 text-sm mt-2">
                                                        {errorMessage}
                                                    </p>
                                                )}
                                                <div className="mt-4 flex space-x-4">
                                                    <button
                                                        onClick={handleDelete}
                                                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                                                    >
                                                        Yes, Delete
                                                    </button>
                                                    <button
                                                        onClick={closeConfirm}
                                                        className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PillModal;
