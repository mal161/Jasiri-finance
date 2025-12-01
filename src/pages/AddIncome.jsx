import React, { useState, useRef, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { doc, collection, addDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '../firebase/Firebase';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import SideBar from '../components/SideBar';

function AddIncome() {
    const amountRef = useRef();
    const sourceRef = useRef();
    const categoryRef = useRef();
    const descriptionRef = useRef();
    const dateRef = useRef();

    const db = getFirestore(app);
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            if (!currentUser) {
                swal("Error!", "Please sign in first", "error");
            }
        });

        return unsubscribe;
    }, [auth]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!amountRef.current.value || isNaN(amountRef.current.value) || parseFloat(amountRef.current.value) <= 0) {
            newErrors.amount = "Please enter a valid amount";
        }
        
        if (!sourceRef.current.value.trim()) {
            newErrors.source = "Source is required";
        }
        
        if (!categoryRef.current.value.trim()) {
            newErrors.category = "Category is required";
        }
        
        if (!descriptionRef.current.value.trim()) {
            newErrors.description = "Description is required";
        }
        
        if (!dateRef.current.value) {
            newErrors.date = "Date is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddIncome = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user) {
            swal("Error!", "Please sign in first", "error");
            return;
        }

        setLoading(true);

        try {
            const incomeData = {
                userId: user.uid,
                amount: parseFloat(amountRef.current.value),
                source: sourceRef.current.value,
                category: categoryRef.current.value,
                description: descriptionRef.current.value,
                date: dateRef.current.value,
                createdAt: new Date()
            };

            await addDoc(collection(db, "incomes"), incomeData);

            // Clear form
            amountRef.current.value = "";
            sourceRef.current.value = "";
            categoryRef.current.value = "";
            descriptionRef.current.value = "";
            dateRef.current.value = "";
            setErrors({});

            setLoading(false);
            swal("Success!", "Income added successfully!", "success");
        } catch (error) {
            setLoading(false);
            console.error("Error adding income:", error);
            swal("Error!", error.message || "Failed to add income", "error");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 p-4 md:p-8 w-full overflow-y-auto flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 md:p-8 my-6 md:my-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add Income</h1>
                    
                    <form onSubmit={handleAddIncome} className="space-y-6">
                        {/* Amount Input */}
                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                ref={amountRef}
                                className={`w-full h-10 border rounded-lg px-3 md:px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter amount"
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>

                        {/* Source Input */}
                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Source</label>
                            <input
                                type="text"
                                ref={sourceRef}
                                className={`w-full h-10 border rounded-lg px-3 md:px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base ${errors.source ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Employer, Bank, Investment"
                            />
                            {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
                        </div>

                        {/* Category Input */}
                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <input
                                type="text"
                                ref={categoryRef}
                                className={`w-full h-10 border rounded-lg px-3 md:px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Salary, Bonus, Investment"
                            />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                ref={descriptionRef}
                                className={`w-full h-20 border rounded-lg px-3 md:px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter income description"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Date Input */}
                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                ref={dateRef}
                                className={`w-full h-10 border rounded-lg px-3 md:px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm md:text-base ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-blue-500 rounded-lg text-white font-semibold text-sm md:text-base hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Add Income"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddIncome;
