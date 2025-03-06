import React, { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchWikipediaSummary = async (constellationName) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${constellationName}`
      );
      return response.data.extract || "No information available.";
    } catch (error) {
      console.error("Error fetching Wikipedia summary:", error);
      return "No information available.";
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      const detectedConstellations = response.data.constellations || [];
      const facts = await Promise.all(
        detectedConstellations.map(async (item) => ({
          name: item.constellation,
          probability: (item.probability * 100).toFixed(2), 
          summary: await fetchWikipediaSummary(item.constellation),
        }))
      );

      setResults(facts);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-spaceBlue text-softWhite space-y-6">
      <h2 className="text-3xl font-bold text-neonBlue">🌌 Star Constellation Identifier</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <label className="flex flex-col items-center bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition">
          <FaUpload className="text-2xl text-neonBlue" />
          <span className="mt-2 text-sm text-gray-300">Click to Upload Night Sky Image</span>
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button 
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-neonBlue text-spaceBlue font-bold rounded-lg shadow-md hover:bg-blue-400 transition"
        >
          Detect Constellations
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neonBlue"></div>
          <p>Analyzing Image...</p>
        </div>
      )}
      {results.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg mt-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-neonBlue">Detected Constellations:</h3>
          {results.map((item, index) => (
            <div key={index} className="mt-4 p-3 bg-gray-800 rounded-lg shadow">
              <h4 className="text-lg font-bold text-softWhite">
                {item.name} - <span className="text-neonBlue">{item.probability}% Confidence</span>
              </h4>
              <p className="text-sm text-gray-300">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
