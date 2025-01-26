import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraApp() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medication, setMedication] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // Store captured image
  const videoRef = useRef(null); // Create videoRef to point to the video element
  const streamRef = useRef(null); // To store the media stream
  const canvasRef = useRef(null); // Reference to canvas for capturing the image

  // Start camera function
  const startCamera = async () => {
    console.log("startCamera function called");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream; // Assign stream to the video element
      setIsCameraOn(true); // Update camera state
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  // Stop camera function
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks
    }
    videoRef.current.srcObject = null; // Clear video source
    setIsCameraOn(false); // Update camera state
  };

  // Capture photo function
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a base64 image string
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData); // Store the captured image
    stopCamera();
  };

  // Submit function for medication
  const handleSubmit = () => {
    if (medication === "") {
      alert("Insert a value");
    } else {
      navigate("/compare", { state: { image: capturedImage, medicine: medication } });
      setIsModalOpen(false);
      setMedication("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-width">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800">Camera</h1>
          <div className="mt-4 h-[500px] w-full bg-gray-200 rounded-lg flex items-center justify-center">
            <video
              ref={videoRef} // Attach ref to video element
              autoPlay
              muted
              className="w-full h-full object-cover rounded-lg"
            ></video>
          </div>
        </div>
      </div>

      {/* Hidden canvas element to capture the photo */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={startCamera} // Start camera when clicked
        >
          Start Camera
        </button>
        <button
          className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
          onClick={stopCamera} // Stop camera when clicked
        >
          Stop Camera
        </button>
        <button
          className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
          onClick={() => {
            capturePhoto(); // Call the capturePhoto function
            setIsModalOpen(true); // Open the modal
          }}// Capture photo when clicked
        >
          Capture
        </button>
      </div>

      {/* Display the captured image */}
      {capturedImage && (
        <div className="mt-8 flex justify-center">
          <img src={capturedImage} alt="Captured" className="w-64 h-auto border rounded-lg shadow-md" />
          <a
            href={capturedImage}
            download="captured-photo.png"
            className="ml-4 text-blue-500 hover:text-blue-700"
          >
            Download Photo
          </a>
        </div>
      )}

      {isModalOpen && (
        <>
          {/* Modal background overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Enter Medication
              </h2>
              <input
                type="text"
                placeholder="Medication name"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
