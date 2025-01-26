import React, { useState } from "react"
import PillForm from "../components/PillForm"

const UploadPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8">Pill Database</h1>
            <button
                onClick={openModal}
                className="bg-blue-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
            >
                Add Pill
            </button>

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <PillForm closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadPage
