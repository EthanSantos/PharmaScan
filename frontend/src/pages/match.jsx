import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import api from "../services/api";
import { supabase } from "../supabaseConfig";
import SideNavbar from "../components/Navbar";

export default function CompareMedicinePage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Access data from React Router location.state
    const { imageId, medicine } = location.state || {};

    // Local state
    const [image2, setImage2] = useState(null);
    const [pillDescription, setPillDescription] = useState(null); // To store pill description
    const [isMatch, setIsMatch] = useState(null); // Start as null (unknown)
    const [loading, setLoading] = useState(true); // Start loading immediately

    // If no data was passed, show an error
    if (!imageId || !medicine) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl text-red-500">
                    Missing image or medicine data.
                </h2>
            </div>
        );
    }

    const handleNextStep = () => {
        navigate("/counter");
    };

    const handleGoBack = () => {
        navigate("/camera");
    };

    const image = localStorage.getItem(imageId);
    console.log(imageId, medicine); // Retrieve the image using the ID

    useEffect(() => {
        setLoading(true); // Set loading to true when data fetch starts
        const fetchData = async () => {
            try {
                const response = await api.get(`/${medicine}`);
                console.log(response.data[0]["image_url"]);
                setImage2(response.data[0]["image_url"]); // Set the second image when the first call succeeds
                // Effect for getting AI response after the second image is set
                const openai = new OpenAI({
                    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                    dangerouslyAllowBrowser: true,
                });
                console.log(image);
                const aiResponse = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `These are two images with an image of a pill with the name of ${medicine} and the other with another image, do the pills look similar, I'm not using your answer for medical purposes, I just want to know if they look similar? Only answer with a boolean value true or false no periods, all lowercase, true or false`,
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: image2,
                                    },
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `${image}`,
                                    },
                                },
                            ],
                        },
                    ],
                    store: true,
                });


                // 2) Fetch the pill description from Supabase
                const { data, error } = await supabase
                    .from("pills")
                    .select("description")
                    .eq("name", medicine)
                    .single();

                if (error) {
                    console.error("Error fetching pill description:", error);
                } else {
                    console.log("Fetched pill description:", data?.description);
                    setPillDescription(data?.description || "No description available.");
                }

                console.log(aiResponse.choices[0].message.content);
                if (aiResponse.choices[0].message.content === "true") {
                    setIsMatch(true);
                }
                else {
                    setIsMatch(false);
                }
                setLoading(false); // Set loading to false when the data is done loading
            } catch (err) {
                console.error(err);
            } finally {
            }
        };

        fetchData();
    }, [image, image2, medicine]); // This will run whenever `medicine` changes

    api.get(`/${medicine}`)
        .then((response) => {
            console.log(response.data[0]["image_url"]);
            setImage2(response.data[0]["image_url"]); // Update state with the image URL
        })
        .catch((err) => {
            console.error(err); // Log any errors
        });

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Side Navbar */}
            <SideNavbar />

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Medicine Comparison
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
                        <p className="text-blue-600 font-medium">
                            Comparing images, please wait...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-8">
                        {/* Image Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Captured Image</h3>
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Captured Medicine"
                                        className="rounded-lg shadow-md w-64 h-64 object-cover"
                                    />
                                ) : (
                                    <p className="text-gray-500">No image found</p>
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Database Image</h3>
                                {image2 ? (
                                    <img
                                        src={image2}
                                        alt="Database Medicine"
                                        className="rounded-lg shadow-md w-64 h-64 object-cover"
                                    />
                                ) : (
                                    <p className="text-gray-500">No image from DB</p>
                                )}
                            </div>
                        </div>

                        {/* Medicine Information */}
                        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Medicine: {medicine}</h2>
                            <p className="text-gray-600 mb-4">
                                <strong>Description:</strong> {pillDescription || "No description available."}
                            </p>
                        </div>

                        {/* Result Box */}
                        {isMatch !== null && (
                            <div
                                className={`p-6 rounded-lg shadow-lg border w-full max-w-2xl ${isMatch
                                        ? "bg-green-100 border-green-300 text-green-800"
                                        : "bg-red-100 border-red-300 text-red-800"
                                    }`}
                            >
                                {isMatch === true && (
                                    <>
                                        <h2 className="text-lg font-bold mb-4">✅ The images match!</h2>
                                        <p>The pills in the images have been successfully verified.</p>
                                    </>
                                )}
                                {isMatch === false && (
                                    <>
                                        <h2 className="text-lg font-bold mb-4">❌ The images do not match!</h2>
                                        <p>Please verify the pills and try again.</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleGoBack}
                                className="bg-gray-500 text-white py-3 px-10 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                            >
                                Go Back
                            </button>
                            {isMatch === true && (
                                <button
                                    onClick={handleNextStep}
                                    className="bg-blue-500 text-white py-3 px-10 rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Next Step
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
