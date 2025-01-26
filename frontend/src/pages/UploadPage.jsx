import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import NavBar from "../components/Navbar"; // Adjust path if needed
import PillForm from "../components/PillForm";
import PillList from "../components/PillList";

const UploadPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPill, setNewPill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Left NavBar (sticky) */}
      <NavBar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/*
          Top header bar: 
          - same height as NavBar brand area (h-16)
          - border-b for a clean line
        */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Pill Database
          </h2>

          {/* Search + Add Pill */}
          <div className="flex space-x-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pills..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 w-64 text-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg 
                hover:bg-blue-600 transition-colors flex items-center text-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Pill
            </motion.button>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PillList
            newPill={newPill}
            searchTerm={searchTerm}
          />
        </main>

        {/* Modal for adding pills */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 backdrop-blur-sm 
                flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                    focus:outline-none"
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

                <PillForm closeModal={closeModal} onPillAdded={setNewPill} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
