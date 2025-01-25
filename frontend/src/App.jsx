import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow text-center">
        <pre className="bg-gray-200 p-4 rounded mt-2 text-gray-800">
          {data.message}
        </pre>
      </div>
    </div>
  );
};

export default App;
