import { useEffect, useRef, useState } from "react";
import { InferenceEngine, CVImage } from "inferencejs"; // Import the Roboflow API

const PillCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pillCount, setPillCount] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cvPillCount, setcvPillCount] = useState(0);

  // useEffect(() => {
  //   // Fetch data from Flask backend
  //   fetch('http://localhost:5000/api/get_data')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setcvPillCount(data.pill_count);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  useEffect(() => {
    const initInference = async () => {
      // Initialize the Inference Engine
      const inferEngine = new InferenceEngine();

      // Replace with your actual model name, version, and publishable key
      const workerId = await inferEngine.startWorker('pills-detection-s9ywn', '19', 'YOUR_PUBLISHABLE_KEY');

      if (isCameraOn && videoRef.current) {
        try {
          // Request the webcam stream
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;

          const video = videoRef.current;

          // Inference on each frame
          const processFrame = async () => {
            if (video.paused || video.ended) return;

            const cvimg = new CVImage(video); // Use the CVImage class to wrap the video element
            const newPredictions = await inferEngine.infer(workerId, cvimg);

            // Update state with predictions and count pills
            setPredictions(newPredictions); // Update predictions state
            setPillCount(newPredictions.length); // Set the pill count based on predictions

            // Call the processFrame again to keep inferring
            requestAnimationFrame(processFrame);
          };

          // Start processing frames
          processFrame();
        } catch (error) {
          console.error("Error accessing webcam:", error);
          alert("Camera access denied or failed. Please allow camera access.");
        }
      }
    };

    if (isCameraOn) {
      initInference();
    } else {
      // Stop webcam stream when camera is turned off
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
    }

    return () => {
      // Clean up on component unmount
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isCameraOn]);

  // Draw bounding boxes on canvas
  const drawPredictions = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    // Set canvas size to match video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      const { x, y, width, height, confidence, class: label } = prediction;

      // Draw bounding box and label
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - width / 2, y - height / 2, width, height);

      ctx.font = "16px Arial";
      ctx.fillStyle = "green";
      ctx.fillText(`${label}: ${confidence.toFixed(2)}`, x - width / 2, y - height / 2 - 10);
    });

    // Display the pill count
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(`Pills detected: ${pillCount}`, 10, 30); // Display the pill count in the top-left corner
  };

  useEffect(() => {
    // Call drawPredictions whenever predictions or pillCount change
    if (predictions.length > 0) {
      drawPredictions(predictions);
    }
  }, [predictions, pillCount]);

  const handlePillCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPillCount(isNaN(value) ? 0 : value);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Pill Counter</h1>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-[640px] h-[480px] mt-6 border-2 border-gray-300 rounded-lg">
            {isCameraOn ? (
              <>
                {/* <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                /> */}
                <img
              src="http://localhost:5000/video_feed" // Ensure this matches the backend route
              alt="Live Video Feed"
              style={{ width: "100%", height: "auto", border: "1px solid #ccc" }}
            />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </>
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
