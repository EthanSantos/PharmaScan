import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseConfig";

const PillList = () => {
    const [pills, setPills] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-700 text-lg">Loading pills...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8">
            <h1 className="text-4xl font-semibold text-gray-900 text-center mb-8">
                Pill List
            </h1>
            {pills.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No pills found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pills.map((pill) => (
                        <div
                            key={pill.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center p-4"
                        >
                            <img
                                src={pill.image_url}
                                alt={pill.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-medium text-gray-800">{pill.name}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PillList;
