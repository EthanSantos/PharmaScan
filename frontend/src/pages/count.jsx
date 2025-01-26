import { useEffect, useRef, useState } from "react";
import SideNavbar from "../components/Navbar"; // Adjust the import path as necessary
import api from "../services/api";

const PillCounter = () => {
  const videoRef = useRef(null);
  const [pillCount, setPillCount] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    // Poll the backend every 1 second to get the pill count
    const interval = setInterval(() => {
      api
        .get("/pill_count") // Use the Axios instance to call the API
        .then((response) => {
          setPillCount(response.data.pill_count);
        })
        .catch((error) => {
          console.error("Error fetching pill count:", error);
        });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing webcam:", error));
    } else {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        stream?.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOn]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navbar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <header className="h-16 bg-white flex items-center border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Pill Counter</h2>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col h-full space-y-4">
            {/* Webcam Section */}
            <section
              className={`bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col transition-all duration-300 ${isCameraOn ? "flex-none h-2/3" : "flex-grow h-3/4"
                }`}
            >
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500 text-center">
                    Camera feed will appear here
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`mt-4 py-2 px-6 rounded-md text-white font-medium transition-colors ${isCameraOn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
              </button>
            </section>

            {/* Live Video Feed */}
            <div>
              <img
                src="http://127.0.0.1:5000/video_feed"
                alt="Live Video Feed"
                style={{ width: "100%", height: "auto", border: "1px solid #ccc" }}
              />
            </div>

            {/* Pill Count Section */}
            <section className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center justify-center mt-4">
              <div className="w-full max-w-sm text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Detected Pill Count
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {pillCount !== null ? pillCount : "0"}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PillCounter;
