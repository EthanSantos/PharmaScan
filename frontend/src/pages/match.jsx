import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OpenAI from "openai";
import api from "../services/api";

export default function CompareMedicinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageId, medicine } = location.state || {}; // Access data from state
  const [image2, setImage2] = useState(null);
  const [isMatch, setIsMatch] = useState(false);
  const [loading, setLoading] = useState(false); // For loading state
  const compareImages = () => {
    // Placeholder logic for comparison; replace with actual algorithm if needed
    setIsMatch(null);
    navigate("/counter");
  };

  const image = localStorage.getItem(imageId);
  console.log(imageId, medicine); // Retrieve the image using the ID

  useEffect(() => {
    setLoading(true); // Set loading to true when data fetch starts
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${medicine}`);
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
        console.log(aiResponse.choices[0].message.content);
        if (aiResponse.choices[0].message.content === "true") {
          setIsMatch(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false when the data is done loading
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
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Medicine Comparison</h1>

      {/* Show Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Show content after loading is finished */}
      {!loading && (
        <>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
              {image && (
                <img
                  src={image}
                  alt="First Medicine"
                  className="mt-4 rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
              {image2 && (
                <img
                  src={image2}
                  alt="Second Medicine"
                  className="mt-4 rounded-lg shadow-md w-full min-h-full"
                />
              )}
            </div>
          </div>

          <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Medicine Information
            </h2>
            {isMatch && <p>Match</p>}
            {!isMatch && <p>Not a match</p>}
          </div>

          <button
            onClick={compareImages}
            className="mt-6 bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Compare Images
          </button>

          {isMatch !== null && (
            <div
              className={`mt-6 p-4 w-full max-w-md text-center text-lg font-semibold rounded-lg shadow-lg 
                        ${isMatch ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
            >
              {isMatch ? "The images match!" : "The images do not match!"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
