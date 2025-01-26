import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CameraApp() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medication, setMedication] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageId, setImageId] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
  };

  // Capture photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    const newImageId = `image_${Date.now()}`;

    // Clear out old items, then store the new image
    localStorage.clear();
    localStorage.setItem(newImageId, imageData);

    setCapturedImage(imageData);
    setImageId(newImageId);

    // Stop camera automatically after capturing
    stopCamera();
  };

  // Submit the medication name
  const handleSubmit = () => {
    if (!medication.trim()) {
      alert("Please enter a medication name.");
      return;
    }
    // Navigate to compare screen with the captured image ID & medication name
    navigate("/compare", { state: { imageId, medicine: medication } });
    setIsModalOpen(false);
    setMedication("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Camera</h1>

        {/* Camera & Buttons */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
          {/* Camera Preview Card */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="object-cover w-full h-full"
              ></video>
            </div>

            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={startCamera}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
              >
                Start
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
              >
                Stop
              </button>
              <button
                onClick={() => {
                  capturePhoto();
                  setIsModalOpen(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
              >
                Capture
              </button>
            </div>
          </div>

          {/* Captured Image Preview & Download */}
          {capturedImage ? (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-auto h-64 rounded-lg shadow-md"
              />
              <a
                href={capturedImage}
                download="captured-photo.png"
                className="mt-3 text-blue-500 hover:underline"
              >
                Download Photo
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center text-gray-500">
              No photo captured yet.
            </div>
          )}
        </div>

        {/* Hidden Canvas for Photo Capture */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Enter Medication Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Container */}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setIsModalOpen(false)}
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

                  {/* Modal Content */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                    Enter Medication
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Please enter the name of the medication you want to compare.
                  </p>

                  <div className="mb-4">
                    <label
                      htmlFor="medication"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Medication Name
                    </label>
                    <input
                      id="medication"
                      type="text"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Acetaminophen"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
