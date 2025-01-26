import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PillModal = ({ isOpen, onClose, pill }) => {
    if (!isOpen || !pill) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={onClose} // Close when clicking outside the modal
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
                    >
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
                        <button
                            onClick={onClose}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PillModal;
