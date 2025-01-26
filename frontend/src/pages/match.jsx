import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import api from "../services/api";

export default function CompareMedicinePage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Access data from React Router location.state
    const { imageId, medicine } = location.state || {};

    // Local state
    const [image2, setImage2] = useState(null);
    const [isMatch, setIsMatch] = useState(null); // Start as null (unknown)
    const [loading, setLoading] = useState(false);

    // Retrieve the first image from localStorage
    const image = localStorage.getItem(imageId);
    console.log("Image ID:", imageId, "Medicine:", medicine);

    // Optional early return if no data is passed in
    if (!imageId || !medicine) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl text-red-500">
                    Missing image or medicine data.
                </h2>
            </div>
        );
    }

    // This function is just a placeholder that navigates away,
    // but you can replace it with your real comparison logic
    const compareImages = () => {
        setIsMatch(null); // Reset matching state if needed
        navigate("/counter"); // Navigate to next page
    };

    useEffect(() => {
        // Wrap everything in an async function for clarity
        const fetchAndCompareImages = async () => {
            setLoading(true);

            try {
                // 1) Get the second image from your API using the medicine name
                const response = await api.get(`/${medicine}`);
                const pillImageUrl = response.data[0]?.image_url;
                console.log("API pill image URL:", pillImageUrl);

                if (!pillImageUrl) {
                    throw new Error("No image URL returned from API");
                }

                setImage2(pillImageUrl);

                // 2) Once we have both images, call OpenAI to see if they match
                const openai = new OpenAI({
                    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                    dangerouslyAllowBrowser: true,
                });

                // Compose your request to OpenAI
                const aiResponse = await openai.chat.completions.create({
                    model: "gpt-4o-mini", // Check your valid model name
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `These are two images with an image of a pill with the name of ${medicine} and the other with another image. Do the pills look similar? I'm not using your answer for medical purposes, I just want to know if they look similar. Only answer with "true" or "false" (lowercase, no periods).`,
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: pillImageUrl,
                                    },
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: image,
                                    },
                                },
                            ],
                        },
                    ],
                    store: true,
                });

                const answer = aiResponse.choices[0]?.message?.content?.trim();
                console.log("OpenAI Response:", answer);

                // If the AI says 'true', set isMatch to true. Otherwise, false.
                if (answer === "true") {
                    setIsMatch(true);
                } else {
                    setIsMatch(false);
                }
            } catch (err) {
                console.error("Error fetching or comparing images:", err);
                // You might want to show an error message in the UI
            } finally {
                setLoading(false);
            }
        };

        fetchAndCompareImages();
    }, [image, medicine]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Medicine Comparison
            </h1>

            {/* Show Loading Spinner */}
            {loading && (
                <div className="flex items-center justify-center my-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                    <span className="ml-4 text-blue-600 font-semibold">Comparing...</span>
                </div>
            )}

            {/* Show content when not loading */}
            {!loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                        {/* First Image (Captured) */}
                        <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
                            {image ? (
                                <img
                                    src={image}
                                    alt="First Medicine"
                                    className="rounded-lg shadow-md w-64 h-64 object-cover"
                                />
                            ) : (
                                <p className="text-gray-500">No image found.</p>
                            )}
                        </div>

                        {/* Second Image (From DB) */}
                        <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
                            {image2 ? (
                                <img
                                    src={image2}
                                    alt="Second Medicine"
                                    className="rounded-lg shadow-md w-64 h-64 object-cover"
                                />
                            ) : (
                                <p className="text-gray-500">No image from DB.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Medicine Information
                        </h2>
                        {isMatch === null && (
                            <p className="text-gray-500">Waiting for AI comparison...</p>
                        )}
                        {isMatch === true && (
                            <p className="text-green-600 font-semibold">The pills match!</p>
                        )}
                        {isMatch === false && (
                            <p className="text-red-600 font-semibold">Not a match.</p>
                        )}
                    </div>

                    {/* Compare / Next Step Button */}
                    <button
                        onClick={compareImages}
                        className="mt-6 bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Compare Images
                    </button>

                    {/* If we want to display a "result" box once we have a response */}
                    {isMatch !== null && !loading && (
                        <div
                            className={`mt-6 p-4 w-full max-w-md text-center text-lg font-semibold rounded-lg shadow-lg 
                ${isMatch
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                        >
                            {isMatch
                                ? "The images match!"
                                : "The images do not match!"}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
