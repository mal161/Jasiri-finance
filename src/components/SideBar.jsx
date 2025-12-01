import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import financelogo from '../assets/Lucid_Origin_A_sleek_modern_logo_for_a_finance_web_app_named_J_0-removebg-preview.png'

function SideBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden w-full h-16 bg-blue-300 text-white flex items-center justify-between px-4">
        <img className='h-10' src={financelogo} alt="finance logo" />
        <button onClick={toggleMobileMenu} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-1/5 h-screen bg-blue-300 text-white flex-col">
        <div className="w-full h-1/5 flex items-start justify-center p-4">
          <img className='w-4/6 h-30' src={financelogo} alt="finance logo" />
        </div>

        <div className="w-full flex flex-col items-start px-4 py-2 gap-4">
          <ul className="w-full flex flex-col gap-3">
            <Link to="/dashboard" className="relative left-1 w-full text-lg text-gray-400 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Dashboard</Link>
            <Link to="/income" className="w-full text-lg text-gray-400 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Add Income</Link>
            <Link to="/expense" className="w-full text-lg text-gray-400 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Add Expense</Link>
            <Link to="/profile" className="w-full text-lg text-gray-400 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Profile</Link>
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed left-0 top-16 w-3/4 h-screen bg-blue-300 text-white flex flex-col md:hidden z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-full flex flex-col items-start px-4 py-6 gap-4">
          <ul className="w-full flex flex-col gap-3">
            <Link to="/dashboard" onClick={closeMobileMenu} className="w-full text-lg text-gray-300 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Dashboard</Link>
            <Link to="/income" onClick={closeMobileMenu} className="w-full text-lg text-gray-300 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Add Income</Link>
            <Link to="/expense" onClick={closeMobileMenu} className="w-full text-lg text-gray-300 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Add Expense</Link>
            <Link to="/profile" onClick={closeMobileMenu} className="w-full text-lg text-gray-300 px-4 py-3 rounded-lg transition duration-200 hover:bg-white hover:text-blue-600 font-semibold">Profile</Link>
          </ul>
        </div>
      </div>
    </>
  )
}

export default SideBar