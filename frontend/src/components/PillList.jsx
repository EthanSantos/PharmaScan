import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseConfig";
import PillCard from "./PillCard";
import PillModal from "./PillModal";

const PillList = ({ newPill, searchTerm }) => {
  const [pills, setPills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPill, setSelectedPill] = useState(null);
  const pillsPerPage = 9;

  // Fetch pills
  useEffect(() => {
    const fetchPills = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("pills").select("*");
      if (error) {
        console.error("Error fetching pills:", error);
      } else {
        setPills(data);
      }
      setLoading(false);
    };

    fetchPills();
  }, []);

  // Add newly created pill
  useEffect(() => {
    if (newPill) {
      setPills((prevPills) => [newPill, ...prevPills]);
    }
  }, [newPill]);

  // Filter by search term
  const filteredPills = pills.filter((pill) =>
    pill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastPill = currentPage * pillsPerPage;
  const indexOfFirstPill = indexOfLastPill - pillsPerPage;
  const currentPills = filteredPills.slice(indexOfFirstPill, indexOfLastPill);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const openModal = (pill) => setSelectedPill(pill);
  const closeModal = () => setSelectedPill(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-gray-700 text-lg"
        >
          Loading pills...
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Pill Grid */}
      {filteredPills.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No pills found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentPills.map((pill) => (
            <div
              key={pill.id}
              onClick={() => openModal(pill)}
              className="cursor-pointer"
            >
              <PillCard
                name={pill.name}
                imageUrl={pill.image_url}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        {Array.from({
          length: Math.ceil(filteredPills.length / pillsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Pill Modal */}
      <PillModal
        isOpen={!!selectedPill}
        onClose={closeModal}
        pill={selectedPill}
        onDelete={(deletedId) =>
          setPills((prevPills) =>
            prevPills.filter((pill) => pill.id !== deletedId)
          )
        }
      />
    </div>
  );
};

export default PillList;
