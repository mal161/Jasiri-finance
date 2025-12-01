import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '../firebase/Firebase';
import SideBar from '../components/SideBar';

function Dashboard() {
    const db = getFirestore(app);
    const auth = getAuth();
    const user = auth.currentUser;

    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch incomes
                const incomeQuery = query(
                    collection(db, "incomes"),
                    where("userId", "==", user.uid)
                );
                const incomeSnap = await getDocs(incomeQuery);
                let incomeTotal = 0;
                const incomeData = [];

                incomeSnap.forEach((doc) => {
                    incomeTotal += doc.data().amount;
                    incomeData.push({ id: doc.id, ...doc.data(), type: "income" });
                });

                // Fetch expenses
                const expenseQuery = query(
                    collection(db, "expenses"),
                    where("userId", "==", user.uid)
                );
                const expenseSnap = await getDocs(expenseQuery);
                let expenseTotal = 0;
                const expenseData = [];

                expenseSnap.forEach((doc) => {
                    expenseTotal += doc.data().amount;
                    expenseData.push({ id: doc.id, ...doc.data(), type: "expense" });
                });

                setTotalIncome(incomeTotal);
                setTotalExpense(expenseTotal);
                setBalance(incomeTotal - expenseTotal);

                // Combine and sort transactions by date (most recent first)
                const allTransactions = [...incomeData, ...expenseData];
                allTransactions.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });

                setRecentTransactions(allTransactions.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, db]);

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <SideBar />
                <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 p-4 md:p-8 w-full overflow-y-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Total Income Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Total Income</p>
                                <h2 className="text-2xl md:text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</h2>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-lg md:text-xl">↑</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Expense Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Total Expense</p>
                                <h2 className="text-2xl md:text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</h2>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-lg md:text-xl">↓</span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Balance</p>
                                <h2 className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    ${balance.toFixed(2)}
                                </h2>
                            </div>
                            <div className={`w-10 h-10 md:w-12 md:h-12 ${balance >= 0 ? 'bg-blue-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                                <span className={balance >= 0 ? 'text-blue-600' : 'text-red-600'}>₹</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
                    {recentTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm md:text-base">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700">Type</th>
                                        <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700">Category</th>
                                        <th className="hidden sm:table-cell text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700">Description</th>
                                        <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700">Amount</th>
                                        <th className="hidden md:table-cell text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-2 md:py-3 px-2 md:px-4">
                                                <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                                                </span>
                                            </td>
                                            <td className="py-2 md:py-3 px-2 md:px-4 text-gray-700 text-sm md:text-base">{transaction.category}</td>
                                            <td className="hidden sm:table-cell py-2 md:py-3 px-2 md:px-4 text-gray-700 text-sm md:text-base">{transaction.description}</td>
                                            <td className={`py-2 md:py-3 px-2 md:px-4 font-semibold text-sm md:text-base ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4 text-gray-600 text-sm md:text-base">{transaction.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No transactions yet. Start by adding income or expenses!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;