import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseConfig";
import PillCard from "./PillCard";
import PillModal from "./PillModal";

const PillList = ({ newPill, searchTerm }) => {
    const [pills, setPills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPill, setSelectedPill] = useState(null);
    const pillsPerPage = 9;

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

    useEffect(() => {
        if (newPill) {
            setPills((prevPills) => [newPill, ...prevPills]);
        }
    }, [newPill]);

    const filteredPills = pills.filter((pill) =>
        pill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPill = currentPage * pillsPerPage;
    const indexOfFirstPill = indexOfLastPill - pillsPerPage;
    const currentPills = filteredPills.slice(indexOfFirstPill, indexOfLastPill);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (pill) => {
        setSelectedPill(pill);
    };

    const closeModal = () => {
        setSelectedPill(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
        <div className="bg-gray-50 min-h-screen font-sans">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {filteredPills.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No pills found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentPills.map((pill) => (
                            <div
                                key={pill.id}
                                onClick={() => openModal(pill)}
                                className="cursor-pointer"
                            >
                                <PillCard name={pill.name} imageUrl={pill.image_url} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    {Array.from({ length: Math.ceil(filteredPills.length / pillsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </main>

            {/* Modal */}
            <PillModal isOpen={!!selectedPill} onClose={closeModal} pill={selectedPill} />
        </div>
    );
};

export default PillList;
