import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CameraApp = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); 
            } else {
                setUser(null); 
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-700">
                {user ? `Hello, ${user.email}` : "Loading..."}
            </h1>
        </div>
    );
};

export default CameraApp;
