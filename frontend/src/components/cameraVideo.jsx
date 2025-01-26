import React, { useEffect, useRef, useState } from 'react';
import { InferenceEngine, CVImage } from 'inferencejs';

const Camera = () => {
  const [predictions, setPredictions] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initInference = async () => {
      // Initialize the Inference Engine
      const inferEngine = new InferenceEngine();

      // Replace with your actual model name, version, and publishable key
      const workerId = await inferEngine.startWorker('pills-detection-s9ywn', '19', 'YOUR_PUBLISHABLE_KEY');

      // Start the video stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      const video = videoRef.current;

      // Inference on each frame
      const processFrame = async () => {
        if (video.paused || video.ended) return;

        const cvimg = new CVImage(video); // Use the CVImage class to wrap the video element
        const predictions = await inferEngine.infer(workerId, cvimg);

        // Update state with predictions
        setPredictions(predictions);

        // Call the processFrame again to keep inferring
        requestAnimationFrame(processFrame);
      };

      // Start processing frames
      processFrame();
    };

    initInference();

    return () => {
      // Clean up on component unmount
      const stream = videoRef.current.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach(track => track.stop());
    };
  }, []);

  // Draw bounding boxes on the canvas
  const drawPredictions = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    // Set canvas size to match video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
      const { x, y, width, height, confidence, class: label } = prediction;

      // Draw bounding box and label
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - width / 2, y - height / 2, width, height);

      ctx.font = '16px Arial';
      ctx.fillStyle = 'green';
      ctx.fillText(`${label}: ${confidence.toFixed(2)}`, x - width / 2, y - height / 2 - 10);
    });
  };

  useEffect(() => {
    drawPredictions();
  }, [predictions]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Camera;
