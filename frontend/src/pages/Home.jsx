import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { supabase } from "../supabaseConfig"; // Adjust if you're fetching from Supabase for the featured meds

import NavBar from "../components/Navbar";
import { ArrowRight } from "lucide-react"; // We'll use an arrow icon from Lucide

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [featuredMeds, setFeaturedMeds] = useState([]);

  useEffect(() => {
    // Get user info from Firebase
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(
        user.displayName || user.email?.split("@")[0] || "Pharmacist"
      );
    }
  }, []);

  // Fetch featured pills from Supabase (limit to 3 or your chosen number)
  useEffect(() => {
    const fetchFeaturedMeds = async () => {
      try {
        const { data, error } = await supabase
          .from("pills")
          .select("*")
          .limit(3); // Adjust limit or filter if desired

        if (error) {
          console.error("Error fetching pills:", error);
        } else {
          setFeaturedMeds(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchFeaturedMeds();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Left Sidebar Nav */}
      <NavBar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white flex items-center border-b border-gray-200 px-4">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome, {userName}!
          </h2>
        </header>

        {/* Scrollable main area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Stats / Info Section */}
          {/* Featured Medications */}
          <section>
            <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800">
                Featured Medication Works
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Discover newly added or commonly used pills from our database.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredMeds.length === 0 ? (
                  <p className="col-span-full text-gray-500">
                    No featured pills found.
                  </p>
                ) : (
                  featuredMeds.map((med) => (
                    <div
                      key={med.id}
                      className="border border-gray-200 bg-white rounded p-4"
                    >
                      <img
                        src={
                          med.image_url || "https://via.placeholder.com/300x200"
                        }
                        alt={med.name}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h4 className="text-lg font-semibold text-gray-800">
                        {med.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {med.description || "No description provided."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Camera Page Step-by-Step Flow */}
          <section>
            <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800">
                How the Camera Page Works
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Follow these steps to verify your pill with YOLOv8:
              </p>

              {/* Horizontal step flow with arrows */}
              <div className="mt-6 flex flex-wrap items-center justify-around gap-8 text-sm">
                {/* Step 1 */}
                <div className="text-center max-w-[10rem]">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    1. Snap a Picture
                  </h4>
                  <p className="text-gray-500">
                    Capture the pill you&apos;re verifying.
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Step 2 */}
                <div className="text-center max-w-[10rem]">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    2. Cross-Reference
                  </h4>
                  <p className="text-gray-500">
                    Automatically match the pill to our database.
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Step 3 */}
                <div className="text-center max-w-[10rem]">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    3. YOLOv8 Counting
                  </h4>
                  <p className="text-gray-500">
                    AI identifies the number of pills, ensuring accuracy.
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Step 4 */}
                <div className="text-center max-w-[10rem]">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    4. Instant Feedback
                  </h4>
                  <p className="text-gray-500">
                    Get real-time alerts if there&apos;s a mismatch or error.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800">
              Pharmacy Overview
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Track your medication inventory, prescription frequency,
              and more with PharmaScan’s powerful analytics.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded bg-gray-50 text-center">
                <p className="text-3xl font-bold text-blue-600">10,000+</p>
                <p className="text-gray-600 text-sm mt-2">
                  Images used to train YOLOv8
                </p>
              </div>
              <div className="p-4 border rounded bg-gray-50 text-center">
                <p className="text-3xl font-bold text-blue-600">300</p>
                <p className="text-gray-600 text-sm mt-2">
                  Prescriptions processed daily
                </p>
              </div>
              <div className="p-4 border rounded bg-gray-50 text-center">
                <p className="text-3xl font-bold text-blue-600">3-5%</p>
                <p className="text-gray-600 text-sm mt-2">
                  Error rate in scripts
                </p>
              </div>
            </div>
          </section>


          {/* Another Section (Optional) */}
          <section>
            <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">
                Pill Database Overview
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                A quick summary or instructions for how to manage pills in
                the database. You can link directly to the Pill Database page
                to add or edit pills.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
