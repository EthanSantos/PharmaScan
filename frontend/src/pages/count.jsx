import { useEffect, useRef, useState } from "react";

const PillCounter = () => {
  const videoRef = useRef(null);
  const [pillCount, setPillCount] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

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
      }
    }
  }, [isCameraOn]);

  const handlePillCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPillCount(isNaN(value) ? null : value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Pill Counter</h1>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col items-center justify-center">
          <div className="mt-6 border-2 border-gray-300 rounded-lg w-[640px] h-[480px] flex items-center justify-center">
            {isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Camera feed will appear here</p>
            )}
          </div>
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`mt-4 py-2 px-6 rounded-lg text-white transition ${
              isCameraOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl mb-4">
            Current Pill Count:{" "}
            <span className="font-semibold">
              {pillCount !== null ? pillCount : "Enter a value"}
            </span>
          </p>

          <input
            type="number"
            placeholder="Enter pill count"
            onChange={handlePillCountChange}
            className="w-80 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PillCounter;
