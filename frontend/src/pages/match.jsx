import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function CompareMedicinePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { image, medicine } = location.state || {};  // Access data from state
    const [image2, setImage2] = useState(null);
    const [isMatch, setIsMatch] = useState(null);


    const compareImages = () => {
        // Placeholder logic for comparison; replace with actual algorithm if needed
        setIsMatch(null);
        navigate("/counter");
    };

    api.get(`/${medicine}`)
        .then((response) => {
            console.log(response.data[0]["image_url"]);
            setImage2(response.data[0]["image_url"]); // Update state with the image URL
        })
        .catch((err) => {
            console.error(err); // Log any errors
        });

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Medicine Comparison</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
                    {image && <img src={image} alt="First Medicine" className="mt-4 rounded-lg shadow-md" />}
                </div>

                <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
                    {image2 && <img src={image2} alt="Second Medicine" className="mt-4 rounded-lg shadow-md" />}
                </div>
            </div>

            <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Medicine Information</h2>
                <p className="text-gray-600">{medicine}</p>
            </div>

            <button
                onClick={compareImages}
                className="mt-6 bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                Compare Images
            </button>

            {isMatch !== null && (
                <div className="mt-6 p-4 w-full max-w-md text-center text-lg font-semibold rounded-lg shadow-lg 
                    ${isMatch ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}"
                >
                    {isMatch ? "The images match!" : "The images do not match!"}
                </div>
            )}
        </div>
    );
}
