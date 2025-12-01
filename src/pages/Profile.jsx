import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import app from '../firebase/Firebase';
import swal from 'sweetalert';
import Spinner from 'react-bootstrap/Spinner';
import SideBar from '../components/SideBar';

function Profile() {
    const auth = getAuth();
    const db = getFirestore(app);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [tempBusinessName, setTempBusinessName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    // Track auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setEmail(currentUser.email || "");
                fetchBusinessName(currentUser.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const fetchBusinessName = async (uid) => {
        try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                setBusinessName(data.businessName || "");
                setTempBusinessName(data.businessName || "");
            } else {
                setBusinessName("");
                setTempBusinessName("");
            }
        } catch (error) {
            console.error("Error fetching business name:", error);
            setBusinessName("");
            setTempBusinessName("");
        } finally {
            setLoading(false);
        }
    };

    const handleEditBusinessName = () => {
        setIsEditing(true);
        setTempBusinessName(businessName);
        setError("");
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTempUsername(username);
        setError("");
    };

    const handleSaveBusinessName = async () => {
        if (!tempBusinessName.trim()) {
            setError("Business name cannot be empty");
            return;
        }

        if (tempBusinessName.trim() === businessName) {
            setIsEditing(false);
            return;
        }

        setUpdating(true);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                businessName: tempBusinessName.trim(),
                updatedAt: new Date()
            });

            setBusinessName(tempBusinessName.trim());
            setIsEditing(false);
            setError("");
            swal("Success!", "Business name updated successfully!", "success");
        } catch (error) {
            console.error("Error updating business name:", error);
            setError(error.message || "Failed to update business name");
            swal("Error!", error.message || "Failed to update business name", "error");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 items-center justify-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 p-4 md:p-8 w-full overflow-y-auto flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 md:p-10 my-6 md:my-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Profile</h1>
                    <p className="text-sm md:text-base text-gray-600 mb-8">View and manage your account</p>

                    {user && (
                        <div className="space-y-8">
                            {/* Email Section */}
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-3">Email Address</label>
                                <div className="w-full px-4 md:px-5 py-3 md:py-4 bg-gray-100 border border-gray-300 rounded-lg">
                                    <p className="text-sm md:text-base text-gray-800 font-medium">{email}</p>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 mt-2">Your registered email </p>
                            </div>

                            {/* Business Name Section */}
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-3">Business Name</label>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={tempBusinessName}
                                            onChange={(e) => {
                                                setTempBusinessName(e.target.value);
                                                setError("");
                                            }}
                                            className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm md:text-base"
                                            placeholder="Enter your business name"
                                        />
                                        {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSaveBusinessName}
                                                disabled={updating}
                                                className="flex-1 px-4 py-2 md:py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm md:text-base"
                                            >
                                                {updating ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={updating}
                                                className="flex-1 px-4 py-2 md:py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm md:text-base"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-full px-4 md:px-5 py-3 md:py-4 bg-gray-100 border border-gray-300 rounded-lg">
                                            <p className="text-sm md:text-base text-gray-800 font-medium">
                                                {businessName || "No business name set"}
                                            </p>
                                        </div>
                                        <div className="w-full py-4 flex justify-center">
                                            <button
                                            onClick={handleEditBusinessName}
                                            className="w-2/3 px-4 py-2  md:py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition text-sm md:text-base"
                                        >
                                            Edit Business Name
                                        </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
