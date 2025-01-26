import React, { useState } from "react";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const PillForm = ({ closeModal, fetchPills }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await api.post("/upload", formData); // Call the backend
            const { message, image_url } = response.data;

            setSuccess(message);
            setTimeout(() => {
                setSuccess("");
                closeModal();
                fetchPills(); // Refresh pill list
            }, 2000);
        } catch (err) {
            setError("Failed to upload pill. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Upload Pill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="pillName" className="block text-sm font-medium text-gray-700 mb-1">
                        Pill Name
                    </label>
                    <input
                        id="pillName"
                        type="text"
                        placeholder="Enter pill name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none shadow-sm transition duration-150 ease-in-out"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pillImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Pill Image
                    </label>
                    <div className="relative">
                        <input
                            id="pillImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                            required
                        />
                        <label
                            htmlFor="pillImage"
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2 text-blue-500" />
                            {image ? image.name : "Choose an image"}
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
                >
                    Upload
                </button>
            </form>
            {success && (
                <p className="flex items-center justify-center text-sm text-green-500 font-medium mt-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    {success}
                </p>
            )}
            {error && (
                <p className="flex items-center justify-center text-sm text-red-500 font-medium mt-4">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default PillForm;
